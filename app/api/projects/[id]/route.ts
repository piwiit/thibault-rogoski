// Force redeploy
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';
import {
  type FacebookPostResult,
  buildProjectFacebookMessage,
  deleteFacebookPost,
  syncProjectToFacebook,
} from '@/lib/facebook';

const ProjectSchema = z.object({
    title: z.string().min(1, 'Le titre est requis'),
    category: z.string().min(1, 'La catégorie est requise'),
    description: z.string().min(1, 'La description est requise'),
    imageUrl: z
        .string()
        .regex(/^\/images\//, 'Seules les images uploadées sont autorisées')
        .nullable(),
    publishToSocial: z.boolean().optional(),
});

export async function GET(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const id = parseInt((await params).id);
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
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const id = parseInt((await params).id);
        if (isNaN(id)) {
            return NextResponse.json({ error: 'Invalid ID' }, { status: 400 });
        }

        const existingProject = await prisma.project.findUnique({ where: { id } });
        if (!existingProject) {
            return NextResponse.json({ error: 'Project not found' }, { status: 404 });
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
                { error: 'Invalid data', details: parsed.error.issues },
                { status: 400 }
            );
        }

        const projectData = {
            title: parsed.data.title,
            category: parsed.data.category,
            description: parsed.data.description,
            imageUrl: parsed.data.imageUrl,
        };

        const project = await prisma.project.update({
            where: { id },
            data: projectData,
        });

        let facebook: any = { success: false, reposted: false, oldPostDeleted: null, postId: null, error: null };
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
            // Si on déactive et qu'il y avait un post, on le supprime
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
                reposted: Boolean(existingProject.facebookPostId && facebook.success),
                oldPostDeleted: facebook.oldPostDeleted ?? null,
                postId: facebook.postId ?? null,
                error: facebook.error ?? null,
            },
        });
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
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const id = parseInt((await params).id);
        if (isNaN(id)) {
            return NextResponse.json({ error: 'Invalid ID' }, { status: 400 });
        }

        const project = await prisma.project.findUnique({ where: { id } });
        if (!project) {
            return NextResponse.json({ error: 'Project not found' }, { status: 404 });
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
            message: 'Project deleted',
            facebook,
        });
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
