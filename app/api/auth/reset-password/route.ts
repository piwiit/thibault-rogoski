import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { hashPassword } from '@/lib/auth';
import { checkRateLimit, getClientIp } from '@/lib/rate-limit';
import { z } from 'zod';
import crypto from 'crypto';

const RequestResetSchema = z.object({
    email: z.string().email('Adresse email invalide'),
});

const ResetPasswordSchema = z.object({
    token: z.string().min(1, 'Le token est requis'),
    newPassword: z
        .string()
        .min(8, 'Le mot de passe doit comporter au moins 8 caractères')
        .regex(/[A-Z]/, 'Le mot de passe doit contenir au moins une majuscule')
        .regex(/[a-z]/, 'Le mot de passe doit contenir au moins une minuscule')
        .regex(/[0-9]/, 'Le mot de passe doit contenir au moins un chiffre'),
});

function hashResetToken(token: string): string {
    return crypto.createHash('sha256').update(token).digest('hex');
}

export async function POST(req: NextRequest) {
    try {
        const ip = getClientIp(req);
        const data = await req.json();

        // 1. Demande de réinitialisation
        if ('email' in data) {
            const rateCheck = checkRateLimit('reset-request', ip, 3, 15 * 60 * 1000); // 3 demandes / 15 min
            if (!rateCheck.allowed) {
                return NextResponse.json(
                    { error: 'Trop de demandes de réinitialisation. Veuillez patienter avant de réessayer.' },
                    { status: 429 }
                );
            }

            const parsed = RequestResetSchema.safeParse(data);
            if (!parsed.success) {
                return NextResponse.json(
                    { error: 'Données invalides', details: parsed.error.issues },
                    { status: 400 }
                );
            }

            const { email } = parsed.data;
            const user = await prisma.user.findFirst({ where: { email } });

            // Réponse uniforme pour éviter l'énumération des utilisateurs
            const genericResponse = {
                success: true,
                message: 'Si cette adresse email est associée à un compte, un lien de réinitialisation vous sera envoyé.',
            };

            if (!user) {
                return NextResponse.json(genericResponse);
            }

            const rawToken = crypto.randomBytes(32).toString('hex');
            const hashedToken = hashResetToken(rawToken);

            const resetTokenExpiry = new Date();
            resetTokenExpiry.setHours(resetTokenExpiry.getHours() + 1); // 1 heure de validité

            await prisma.user.update({
                where: { id: user.id },
                data: {
                    resetToken: hashedToken,
                    resetTokenExpiry,
                },
            });

            console.log(`[AUTH] Token de réinitialisation généré pour ${email}`);

            return NextResponse.json({
                ...genericResponse,
                // Le token en clair n'est retourné qu'en développement local pour le debug
                token: process.env.NODE_ENV === 'development' ? rawToken : undefined,
            });
        }

        // 2. Réinitialisation avec token
        if ('token' in data) {
            const parsed = ResetPasswordSchema.safeParse(data);
            if (!parsed.success) {
                return NextResponse.json(
                    { error: 'Données invalides', details: parsed.error.issues },
                    { status: 400 }
                );
            }

            const { token, newPassword } = parsed.data;
            const hashedToken = hashResetToken(token);

            const user = await prisma.user.findFirst({
                where: {
                    resetToken: hashedToken,
                    resetTokenExpiry: {
                        gt: new Date(),
                    },
                },
            });

            if (!user) {
                return NextResponse.json(
                    { error: 'Le token de réinitialisation est invalide ou a expiré' },
                    { status: 400 }
                );
            }

            const newPasswordHash = await hashPassword(newPassword);

            await prisma.user.update({
                where: { id: user.id },
                data: {
                    passwordHash: newPasswordHash,
                    resetToken: null,
                    resetTokenExpiry: null,
                },
            });

            return NextResponse.json({
                success: true,
                message: 'Mot de passe réinitialisé avec succès',
            });
        }

        return NextResponse.json({ error: 'Requête invalide' }, { status: 400 });
    } catch (e) {
        console.error('Reset password error:', e);
        return NextResponse.json(
            { error: 'Une erreur serveur est survenue' },
            { status: 500 }
        );
    }
}
