import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

const ProjectSchema = z.object({
    title: z.string().min(1, 'Le titre est requis'),
    category: z.string().min(1, 'La catégorie est requise'),
    description: z.string().min(1, 'La description est requise'),
    imageUrl: z.string().optional().nullable().or(z.literal('')),
});

export async function GET(
    req: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const id = parseInt(params.id);
        if (isNaN(id)) {
            return NextResponse.json({ error: 'Invalid ID' }, { status: 400 });
        }

        const project = await prisma.project.findUnique({ where: { id } });

        if (!project) {
            return NextResponse.json({ error: 'Project not found' }, { status: 404 });
        }

        return NextResponse.json(project);
    } catch (e) {
        return NextResponse.json(
            { error: 'Server error', details: e instanceof Error ? e.message : e },
            { status: 500 }
        );
    }
}

export async function PUT(
    req: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const id = parseInt(params.id);
        if (isNaN(id)) {
            return NextResponse.json({ error: 'Invalid ID' }, { status: 400 });
        }

        const data = await req.json();
        const parsed = ProjectSchema.safeParse(data);

        if (!parsed.success) {
            return NextResponse.json(
                { error: 'Invalid data', details: parsed.error.issues },
                { status: 400 }
            );
        }

        const projectData = {
            title: parsed.data.title,
            category: parsed.data.category,
            description: parsed.data.description,
            imageUrl: parsed.data.imageUrl && parsed.data.imageUrl.trim() !== '' ? parsed.data.imageUrl : null,
        };

        const project = await prisma.project.update({
            where: { id },
            data: projectData,
        });

        return NextResponse.json({ success: true, project });
    } catch (e) {
        if (e instanceof Error && e.message.includes('Record to update not found')) {
            return NextResponse.json({ error: 'Project not found' }, { status: 404 });
        }
        return NextResponse.json(
            { error: 'Server error', details: e instanceof Error ? e.message : e },
            { status: 500 }
        );
    }
}

export async function DELETE(
    req: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const id = parseInt(params.id);
        if (isNaN(id)) {
            return NextResponse.json({ error: 'Invalid ID' }, { status: 400 });
        }

        await prisma.project.delete({ where: { id } });

        return NextResponse.json({ success: true, message: 'Project deleted' });
    } catch (e) {
        if (e instanceof Error && e.message.includes('Record to delete does not exist')) {
            return NextResponse.json({ error: 'Project not found' }, { status: 404 });
        }
        return NextResponse.json(
            { error: 'Server error', details: e instanceof Error ? e.message : e },
            { status: 500 }
        );
    }
}

