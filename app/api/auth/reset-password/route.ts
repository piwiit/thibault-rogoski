import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { hashPassword } from '@/lib/auth';
import { z } from 'zod';
import crypto from 'crypto';

const RequestResetSchema = z.object({
    username: z.string().min(1, 'Le nom d\'utilisateur est requis'),
});

const ResetPasswordSchema = z.object({
    token: z.string().min(1, 'Le token est requis'),
    newPassword: z.string().min(6, 'Le nouveau mot de passe doit contenir au moins 6 caractères'),
});

// Générer un token de réinitialisation
function generateResetToken(): string {
    return crypto.randomBytes(32).toString('hex');
}

// Demander une réinitialisation (génère un token)
export async function POST(req: NextRequest) {
    try {
        const data = await req.json();

        // Vérifier si c'est une demande de reset ou une réinitialisation
        if ('username' in data) {
            // Demande de réinitialisation
            const parsed = RequestResetSchema.safeParse(data);

            if (!parsed.success) {
                return NextResponse.json(
                    { error: 'Invalid data', details: parsed.error.issues },
                    { status: 400 }
                );
            }

            const { username } = parsed.data;

            const user = await (prisma as any).user.findUnique({ where: { username } });

            if (!user) {
                // Pour la sécurité, on ne révèle pas si l'utilisateur existe
                return NextResponse.json({
                    success: true,
                    message: 'Si cet utilisateur existe, un email de réinitialisation sera envoyé.'
                });
            }

            const resetToken = generateResetToken();
            const resetTokenExpiry = new Date();
            resetTokenExpiry.setHours(resetTokenExpiry.getHours() + 1); // Token valide 1 heure

            await (prisma as any).user.update({
                where: { id: user.id },
                data: {
                    resetToken,
                    resetTokenExpiry,
                },
            });

            // En production, vous devriez envoyer un email avec le token
            // Pour le développement, on retourne le token (à ne JAMAIS faire en production)
            return NextResponse.json({
                success: true,
                message: 'Token de réinitialisation généré',
                // ⚠️ À RETIRER EN PRODUCTION - juste pour le développement
                token: process.env.NODE_ENV === 'development' ? resetToken : undefined,
            });
        } else if ('token' in data) {
            // Réinitialisation avec token
            const parsed = ResetPasswordSchema.safeParse(data);

            if (!parsed.success) {
                return NextResponse.json(
                    { error: 'Invalid data', details: parsed.error.issues },
                    { status: 400 }
                );
            }

            const { token, newPassword } = parsed.data;

            const user = await (prisma as any).user.findFirst({
                where: {
                    resetToken: token,
                    resetTokenExpiry: {
                        gt: new Date(),
                    },
                },
            });

            if (!user) {
                return NextResponse.json(
                    { error: 'Token invalide ou expiré' },
                    { status: 400 }
                );
            }

            const newPasswordHash = await hashPassword(newPassword);

            await (prisma as any).user.update({
                where: { id: user.id },
                data: {
                    passwordHash: newPasswordHash,
                    resetToken: null,
                    resetTokenExpiry: null,
                },
            });

            return NextResponse.json({
                success: true,
                message: 'Mot de passe réinitialisé avec succès'
            });
        } else {
            return NextResponse.json(
                { error: 'Invalid request' },
                { status: 400 }
            );
        }
    } catch (e) {
        return NextResponse.json(
            { error: 'Server error', details: e instanceof Error ? e.message : e },
            { status: 500 }
        );
    }
}

