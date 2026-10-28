import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';
import { getSession } from '@/lib/auth';
import {
  buildProjectFacebookMessage,
  deleteFacebookPost,
  syncProjectToFacebook,
} from '@/lib/facebook';

const ProjectSchema = z.object({
  title: z.string().min(1, 'Le titre est requis').max(200, 'Le titre est trop long'),
  category: z.string().min(1, 'La catégorie est requise').max(100, 'La catégorie est trop longue'),
  description: z.string().min(1, 'La description est requise').max(5000, 'La description est trop longue'),
  imageUrl: z
    .string()
    .refine(
      (val) => {
        if (val.includes('..')) return false;
        return (
          val.startsWith('/images/') ||
          /^https:\/\/[a-zA-Z0-9-]+\.supabase\.co\/storage\/v1\/object\/public\//.test(val)
        );
      },
      { message: 'Seules les images locales autorisées (/images/...) ou hébergées sur Supabase sont valides' }
    )
    .nullable(),
  publishToSocial: z.boolean().optional(),
});

interface FacebookSyncStatus {
  success: boolean;
  reposted: boolean;
  oldPostDeleted: boolean | null;
  postId: string | null;
  error: string | null;
}

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const id = parseInt((await params).id, 10);
    if (isNaN(id)) {
      return NextResponse.json({ error: 'Identifiant invalide' }, { status: 400 });
    }

    const project = await prisma.project.findUnique({ where: { id } });

    if (!project) {
      return NextResponse.json({ error: 'Projet introuvable' }, { status: 404 });
    }

    return NextResponse.json(project);
  } catch (e) {
    console.error('GET /api/projects/[id] error:', e);
    return NextResponse.json(
      { error: 'Erreur lors de la récupération du projet' },
      { status: 500 }
    );
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const userId = await getSession();
    if (!userId) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    }

    const id = parseInt((await params).id, 10);
    if (isNaN(id)) {
      return NextResponse.json({ error: 'Identifiant invalide' }, { status: 400 });
    }

    const existingProject = await prisma.project.findUnique({ where: { id } });
    if (!existingProject) {
      return NextResponse.json({ error: 'Projet introuvable' }, { status: 404 });
    }

    const data = await req.json();
    const normalizedData = {
      ...data,
      imageUrl:
        data.imageUrl && typeof data.imageUrl === 'string' && data.imageUrl.trim() !== ''
          ? data.imageUrl.trim()
          : null,
    };
    const parsed = ProjectSchema.safeParse(normalizedData);

    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Données invalides', details: parsed.error.issues },
        { status: 400 }
      );
    }

    const projectData = {
      title: parsed.data.title.trim(),
      category: parsed.data.category.trim(),
      description: parsed.data.description.trim(),
      imageUrl: parsed.data.imageUrl,
    };

    const project = await prisma.project.update({
      where: { id },
      data: projectData,
    });

    let facebook: FacebookSyncStatus = {
      success: false,
      reposted: false,
      oldPostDeleted: null,
      postId: null,
      error: null,
    };
    let updatedProject = project;

    if (data.publishToSocial !== false) {
      const message = buildProjectFacebookMessage(
        project.title,
        project.category,
        project.description
      );

      const fbResult = await syncProjectToFacebook({
        existingPostId: existingProject.facebookPostId,
        message,
        imageUrl: project.imageUrl,
      });

      facebook = {
        success: fbResult.success,
        reposted: Boolean(existingProject.facebookPostId && fbResult.success),
        oldPostDeleted: fbResult.oldPostDeleted ?? null,
        postId: fbResult.postId ?? null,
        error: fbResult.error ?? null,
      };

      if (fbResult.success && fbResult.postId) {
        updatedProject = await prisma.project.update({
          where: { id },
          data: { facebookPostId: fbResult.postId },
        });
      }
    } else if (existingProject.facebookPostId) {
      const fbResult = await deleteFacebookPost(existingProject.facebookPostId);
      facebook = {
        success: false,
        reposted: false,
        oldPostDeleted: fbResult.success,
        postId: null,
        error: fbResult.error ?? null,
      };
      updatedProject = await prisma.project.update({
        where: { id },
        data: { facebookPostId: null },
      });
    }

    return NextResponse.json({
      success: true,
      project: updatedProject,
      facebook: {
        published: facebook.success,
        reposted: facebook.reposted,
        oldPostDeleted: facebook.oldPostDeleted,
        postId: facebook.postId,
        error: facebook.error,
      },
    });
  } catch (e) {
    console.error('PUT /api/projects/[id] error:', e);
    return NextResponse.json(
      { error: 'Erreur lors de la mise à jour du projet' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const userId = await getSession();
    if (!userId) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    }

    const id = parseInt((await params).id, 10);
    if (isNaN(id)) {
      return NextResponse.json({ error: 'Identifiant invalide' }, { status: 400 });
    }

    const project = await prisma.project.findUnique({ where: { id } });
    if (!project) {
      return NextResponse.json({ error: 'Projet introuvable' }, { status: 404 });
    }

    let facebook = { deleted: false, error: null as string | null };

    if (project.facebookPostId) {
      const result = await deleteFacebookPost(project.facebookPostId);
      facebook = {
        deleted: result.success,
        error: result.error ?? null,
      };
    }

    await prisma.project.delete({ where: { id } });

    return NextResponse.json({
      success: true,
      message: 'Projet supprimé avec succès',
      facebook,
    });
  } catch (e) {
    console.error('DELETE /api/projects/[id] error:', e);
    return NextResponse.json(
      { error: 'Erreur lors de la suppression du projet' },
      { status: 500 }
    );
  }
}
