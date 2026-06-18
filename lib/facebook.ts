import fs from 'fs';
import path from 'path';

const GRAPH_API_VERSION = 'v21.0';

export interface FacebookPostResult {
  success: boolean;
  postId?: string;
  error?: string;
}

function getFacebookConfig() {
  const pageId = process.env.FACEBOOK_PAGE_ID;
  const token = process.env.FACEBOOK_PAGE_TOKEN;

  console.log('Diagnostic Facebook Config:', {
    hasPageId: !!pageId,
    pageIdLength: pageId?.length || 0,
    hasToken: !!token,
    tokenLength: token?.length || 0,
    nodeEnv: process.env.NODE_ENV
  });

  if (!pageId || !token) {
    throw new Error(
      `FACEBOOK_PAGE_ID (${!!pageId}) et FACEBOOK_PAGE_TOKEN (${!!token}) doivent être configurés. ` +
      `Vérifiez les variables d'environnement sur Vercel.`
    );
  }

  return { pageId, token };
}

async function fetchGraphApi<T>(url: string, init?: RequestInit): Promise<T> {
  const response = await fetch(url, init);
  const data = await response.json();

  if (data.error) {
    const message = data.error.error_user_msg || data.error.message || 'Erreur Facebook inconnue';
    throw new Error(message);
  }

  return data as T;
}

async function deleteGraphObject(objectId: string, pageToken: string): Promise<void> {
  const response = await fetch(
    `https://graph.facebook.com/${GRAPH_API_VERSION}/${objectId}?access_token=${pageToken}`,
    { method: 'DELETE' }
  );
  const data = await response.json();

  if (data.error) {
    const message = data.error.error_user_msg || data.error.message || 'Erreur Facebook inconnue';
    throw new Error(message);
  }

  if (!data.success) {
    throw new Error('Suppression Facebook échouée');
  }
}

async function assertCanManagePages(token: string): Promise<void> {
  const data = await fetchGraphApi<{ data?: Array<{ permission: string; status: string }> }>(
    `https://graph.facebook.com/${GRAPH_API_VERSION}/me/permissions?access_token=${token}`
  );

  const granted = new Set(
    (data.data ?? [])
      .filter((permission) => permission.status === 'granted')
      .map((permission) => permission.permission)
  );

  if (!granted.has('pages_manage_posts')) {
    throw new Error(
      'Le token Facebook n\'a pas la permission "pages_manage_posts". ' +
      'Régénérez un token utilisateur avec pages_show_list, pages_manage_posts et pages_read_engagement, ' +
      'puis mettez à jour FACEBOOK_PAGE_TOKEN dans le .env.'
    );
  }

  if (!granted.has('pages_show_list')) {
    throw new Error(
      'Le token Facebook n\'a pas la permission "pages_show_list". ' +
      'Cette permission est nécessaire pour publier sur la page Facebook.'
    );
  }
}

async function resolvePageAccessToken(pageId: string, token: string): Promise<string> {
  const accountsData = await fetchGraphApi<{
    data?: Array<{ id: string; access_token: string; name: string }>;
  }>(`https://graph.facebook.com/${GRAPH_API_VERSION}/me/accounts?access_token=${token}`);

  const page = accountsData.data?.find((entry) => entry.id === pageId);
  if (page?.access_token) {
    return page.access_token;
  }

  if ((accountsData.data?.length ?? 0) === 0) {
    throw new Error(
      `Aucune page Facebook accessible avec ce token. ` +
      `Vérifiez que FACEBOOK_PAGE_ID (${pageId}) correspond à une page que vous administrez ` +
      `et que le token possède les permissions pages_show_list et pages_manage_posts.`
    );
  }

  throw new Error(
    `La page Facebook ${pageId} est introuvable dans les pages liées à ce token. ` +
    `Vérifiez FACEBOOK_PAGE_ID dans le .env.`
  );
}

async function getPageToken(): Promise<string> {
  const { pageId, token } = getFacebookConfig();
  await assertCanManagePages(token);
  return resolvePageAccessToken(pageId, token);
}

function resolveLocalImagePath(imageUrl: string): string {
  const relativePath = imageUrl.replace(/^\/+/, '');
  return path.join(process.cwd(), 'public', relativePath);
}

function getImageMimeType(filePath: string): string {
  const ext = path.extname(filePath).toLowerCase();
  const mimeTypes: Record<string, string> = {
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.png': 'image/png',
    '.webp': 'image/webp',
    '.gif': 'image/gif',
  };

  return mimeTypes[ext] ?? 'image/jpeg';
}

function buildPublicImageUrl(imageUrl: string): string | null {
  if (imageUrl.startsWith('http')) return imageUrl;

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || process.env.SITE_URL;
  if (!siteUrl) return null;

  return `${siteUrl.replace(/\/$/, '')}${imageUrl.startsWith('/') ? imageUrl : `/${imageUrl}`}`;
}

function formatFacebookError(error: unknown): string {
  return error instanceof Error ? error.message : 'Erreur Facebook inconnue';
}

export function buildProjectFacebookMessage(
  title: string,
  category: string,
  description: string
): string {
  return `🚀 Projet réalisé : ${title}\n\n${category}\n\n${description}`;
}

export async function postToFacebook(
  message: string,
  imageUrl?: string | null
): Promise<FacebookPostResult> {
  try {
    const { pageId } = getFacebookConfig();
    const pageToken = await getPageToken();

    if (imageUrl) {
      const publicImageUrl = buildPublicImageUrl(imageUrl);
      const localPath = resolveLocalImagePath(imageUrl);

      if (publicImageUrl) {
        const postData = await fetchGraphApi<{ id?: string; post_id?: string }>(
          `https://graph.facebook.com/${GRAPH_API_VERSION}/${pageId}/photos`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              url: publicImageUrl,
              caption: message,
              access_token: pageToken,
            }),
          }
        );

        return {
          success: true,
          postId: postData.post_id ?? postData.id,
        };
      }

      if (fs.existsSync(localPath)) {
        const fileBuffer = fs.readFileSync(localPath);
        const mimeType = getImageMimeType(localPath);
        const formData = new FormData();
        formData.append('source', new Blob([fileBuffer], { type: mimeType }), path.basename(localPath));
        formData.append('caption', message);
        formData.append('access_token', pageToken);

        const postData = await fetchGraphApi<{ id?: string; post_id?: string }>(
          `https://graph.facebook.com/${GRAPH_API_VERSION}/${pageId}/photos`,
          {
            method: 'POST',
            body: formData,
          }
        );

        return {
          success: true,
          postId: postData.post_id ?? postData.id,
        };
      }

      console.warn(`Image introuvable (${localPath}), publication texte uniquement.`);
    }

    const postData = await fetchGraphApi<{ id?: string }>(
      `https://graph.facebook.com/${GRAPH_API_VERSION}/${pageId}/feed`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message,
          access_token: pageToken,
        }),
      }
    );

    return {
      success: true,
      postId: postData.id,
    };
  } catch (error) {
    const message = formatFacebookError(error);
    console.error('postToFacebook error:', message);
    return {
      success: false,
      error: message,
    };
  }
}

export async function updateFacebookPost(
  postId: string,
  message: string
): Promise<FacebookPostResult> {
  try {
    const pageToken = await getPageToken();

    try {
      await fetchGraphApi<{ success?: boolean }>(
        `https://graph.facebook.com/${GRAPH_API_VERSION}/${postId}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            message,
            access_token: pageToken,
          }),
        }
      );
    } catch {
      await fetchGraphApi<{ success?: boolean }>(
        `https://graph.facebook.com/${GRAPH_API_VERSION}/${postId}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            caption: message,
            access_token: pageToken,
          }),
        }
      );
    }

    return { success: true, postId };
  } catch (error) {
    const message = formatFacebookError(error);
    console.error('updateFacebookPost error:', message);
    return { success: false, error: message };
  }
}

export async function deleteFacebookPost(postId: string): Promise<FacebookPostResult> {
  try {
    const pageToken = await getPageToken();
    await deleteGraphObject(postId, pageToken);
    return { success: true };
  } catch (error) {
    const message = formatFacebookError(error);
    console.error('deleteFacebookPost error:', message);
    return { success: false, error: message };
  }
}

export async function syncProjectToFacebook(options: {
  existingPostId?: string | null;
  message: string;
  imageUrl?: string | null;
}): Promise<FacebookPostResult & { oldPostDeleted?: boolean }> {
  const { existingPostId, message, imageUrl } = options;

  if (!existingPostId) {
    return postToFacebook(message, imageUrl);
  }

  // L'API de mise à jour (POST /{post-id}) renvoie souvent l'erreur #3
  // ("Application does not have the capability"). On supprime puis on republie.
  const deleteResult = await deleteFacebookPost(existingPostId);
  if (!deleteResult.success) {
    console.warn('Ancien post Facebook non supprimé:', deleteResult.error);
  }

  const createResult = await postToFacebook(message, imageUrl);

  if (createResult.success && !deleteResult.success) {
    return {
      ...createResult,
      oldPostDeleted: false,
      error:
        'Nouveau post publié, mais l\'ancien post Facebook n\'a pas pu être supprimé. ' +
        'Supprimez-le manuellement sur Facebook si un doublon apparaît.',
    };
  }

  return {
    ...createResult,
    oldPostDeleted: deleteResult.success,
  };
}
