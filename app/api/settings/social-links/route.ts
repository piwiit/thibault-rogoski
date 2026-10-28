import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { getLandingContent, saveLandingContent } from '@/lib/landing';
import { z } from 'zod';

const SocialLinksSchema = z.object({
  facebook: z.string().trim().url('URL Facebook invalide').or(z.literal('')).optional(),
  instagram: z.string().trim().url('URL Instagram invalide').or(z.literal('')).optional(),
  linkedin: z.string().trim().url('URL LinkedIn invalide').or(z.literal('')).optional(),
});

export async function GET() {
  try {
    const content = await getLandingContent();
    return NextResponse.json({
      facebook: content.social.facebook,
      instagram: content.social.instagram,
      linkedin: content.social.linkedin,
    });
  } catch (error) {
    console.error('GET /api/settings/social-links error:', error);
    return NextResponse.json({ facebook: '', instagram: '', linkedin: '' });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    }

    const body = await req.json();
    const parsed = SocialLinksSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Données invalides', details: parsed.error.issues },
        { status: 400 }
      );
    }

    const content = await getLandingContent();

    content.social = {
      facebook: parsed.data.facebook ?? '',
      instagram: parsed.data.instagram ?? '',
      linkedin: parsed.data.linkedin ?? '',
    };

    await saveLandingContent(content);

    return NextResponse.json({
      success: true,
      message: 'Liens des réseaux sociaux mis à jour',
    });
  } catch (error) {
    console.error('POST /api/settings/social-links error:', error);
    return NextResponse.json({ error: 'Erreur lors de la mise à jour' }, { status: 500 });
  }
}
