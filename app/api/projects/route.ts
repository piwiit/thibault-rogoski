import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

const ProjectSchema = z.object({
  title: z.string().min(1, 'Le titre est requis'),
  category: z.string().min(1, 'La catégorie est requise'),
  description: z.string().min(1, 'La description est requise'),
  imageUrl: z
    .string()
    .regex(/^\/images\//, 'Seules les images uploadées sont autorisées')
    .nullable(),
});

export async function GET() {
  try {
    const projects = await prisma.project.findMany({ orderBy: { createdAt: 'desc' } });
    return NextResponse.json(projects);
  } catch (e) {
    return NextResponse.json({ error: 'Server error', details: e instanceof Error ? e.message : e }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();

    // Normaliser imageUrl : convertir chaîne vide en null
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

    const project = await prisma.project.create({ data: projectData });
    return NextResponse.json({ success: true, project }, { status: 201 });
  } catch (e) {
    console.error('Error creating project:', e);
    return NextResponse.json(
      {
        error: 'Server error',
        details: e instanceof Error ? e.message : String(e),
        stack: process.env.NODE_ENV === 'development' && e instanceof Error ? e.stack : undefined
      },
      { status: 500 }
    );
  }
}
