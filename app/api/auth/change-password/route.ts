import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyPassword, hashPassword, getSession } from '@/lib/auth';
import { z } from 'zod';

const ChangePasswordSchema = z.object({
    currentPassword: z.string().min(1, 'Le mot de passe actuel est requis'),
    newPassword: z
        .string()
        .min(8, 'Le mot de passe doit comporter au moins 8 caractères')
        .regex(/[A-Z]/, 'Le mot de passe doit contenir au moins une majuscule')
        .regex(/[a-z]/, 'Le mot de passe doit contenir au moins une minuscule')
        .regex(/[0-9]/, 'Le mot de passe doit contenir au moins un chiffre'),
});

export async function POST(req: NextRequest) {
    try {
        const userId = await getSession();

        if (!userId) {
            return NextResponse.json(
                { error: 'Non authentifié' },
                { status: 401 }
            );
        }

        const data = await req.json();
        const parsed = ChangePasswordSchema.safeParse(data);

        if (!parsed.success) {
            return NextResponse.json(
                { error: 'Données invalides', details: parsed.error.issues },
                { status: 400 }
            );
        }

        const { currentPassword, newPassword } = parsed.data;

        const user = await prisma.user.findUnique({ where: { id: userId } });

        if (!user) {
            return NextResponse.json(
                { error: 'Utilisateur non trouvé' },
                { status: 404 }
            );
        }

        const isValid = await verifyPassword(currentPassword, user.passwordHash);

        if (!isValid) {
            return NextResponse.json(
                { error: 'Le mot de passe actuel est incorrect' },
                { status: 400 }
            );
        }

        const newPasswordHash = await hashPassword(newPassword);

        await prisma.user.update({
            where: { id: userId },
            data: { passwordHash: newPasswordHash },
        });

        return NextResponse.json({ success: true, message: 'Mot de passe modifié avec succès' });
    } catch (e) {
        console.error('Change password error:', e);
        return NextResponse.json(
            { error: 'Une erreur serveur est survenue lors du changement de mot de passe' },
            { status: 500 }
        );
    }
}
