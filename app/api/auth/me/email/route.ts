import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

const UpdateEmailSchema = z.object({
    email: z.string().trim().email('Adresse email invalide'),
});

export async function PUT(req: NextRequest) {
    try {
        const userId = await getSession();

        if (!userId) {
            return NextResponse.json(
                { error: 'Non authentifié' },
                { status: 401 }
            );
        }

        const data = await req.json();
        const parsed = UpdateEmailSchema.safeParse(data);

        if (!parsed.success) {
            return NextResponse.json(
                { error: 'Données invalides', details: parsed.error.issues },
                { status: 400 }
            );
        }

        const { email } = parsed.data;

        await prisma.user.update({
            where: { id: userId },
            data: { email },
        });

        return NextResponse.json({
            success: true,
            message: 'Email mis à jour avec succès'
        });
    } catch (e) {
        console.error('PUT /api/auth/me/email error:', e);
        return NextResponse.json(
            { error: 'Erreur lors de la mise à jour de l\'adresse email' },
            { status: 500 }
        );
    }
}
