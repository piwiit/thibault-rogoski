import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';
import { buildProjectFacebookMessage, postToFacebook, type FacebookPostResult } from '@/lib/facebook';

const ProjectSchema = z.object({
  title: z.string().min(1, 'Le titre est requis'),
  category: z.string().min(1, 'La catégorie est requise'),
  description: z.string().min(1, 'La description est requise'),
  imageUrl: z
    .string()
    .regex(/^(\/images\/|https:\/\/.*\.supabase\.co\/)/, 'Seules les images uploadées sont autorisées')
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
      { error: 'Server error', details: e instanceof Error ? e.message : e },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
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
        { error: 'Invalid data', details: parsed.error.issues },
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
      {
        error: 'Server error',
        details: e instanceof Error ? e.message : String(e),
      },
      { status: 500 }
    );
  }
}
