import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';
import { getSession } from '@/lib/auth';
import { buildProjectFacebookMessage, postToFacebook, type FacebookPostResult } from '@/lib/facebook';

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

export async function GET() {
  try {
    const projects = await prisma.project.findMany({ orderBy: { createdAt: 'desc' } });
    return NextResponse.json(projects);
  } catch (e) {
    console.error('GET /api/projects error:', e);
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des projets' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const userId = await getSession();
    if (!userId) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
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

    let project = await prisma.project.create({ data: projectData });

    let facebook: FacebookPostResult = { success: false };
    if (data.publishToSocial !== false) {
      const message = buildProjectFacebookMessage(
        project.title,
        project.category,
        project.description
      );
      facebook = await postToFacebook(message, project.imageUrl);
    }

    if (facebook.success && facebook.postId) {
      project = await prisma.project.update({
        where: { id: project.id },
        data: { facebookPostId: facebook.postId },
      });
    }

    return NextResponse.json(
      {
        success: true,
        project,
        facebook: {
          published: facebook.success,
          postId: facebook.postId ?? null,
          error: facebook.error ?? null,
        },
      },
      { status: 201 }
    );
  } catch (e) {
    console.error('Error creating project:', e);
    return NextResponse.json(
      { error: 'Erreur lors de la création du projet' },
      { status: 500 }
    );
  }
}
