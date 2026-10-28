import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyPassword, createSessionCookie } from '@/lib/auth';
import { checkRateLimit, getClientIp } from '@/lib/rate-limit';
import { z } from 'zod';

const LoginSchema = z.object({
    username: z.string().min(1, 'Le nom d\'utilisateur est requis'),
    password: z.string().min(1, 'Le mot de passe est requis'),
});

export async function POST(req: NextRequest) {
    try {
        const ip = getClientIp(req);
        const rateCheck = checkRateLimit('login', ip, 5, 15 * 60 * 1000); // 5 tentatives / 15 min
        if (!rateCheck.allowed) {
            return NextResponse.json(
                { error: `Trop de tentatives de connexion. Réessayez dans ${rateCheck.retryAfterSeconds} secondes.` },
                { status: 429, headers: { 'Retry-After': String(rateCheck.retryAfterSeconds) } }
            );
        }

        const data = await req.json();
        const parsed = LoginSchema.safeParse(data);

        if (!parsed.success) {
            return NextResponse.json(
                { error: 'Données invalides', details: parsed.error.issues },
                { status: 400 }
            );
        }

        const { username, password } = parsed.data;

        const user = await prisma.user.findUnique({ where: { username } });

        if (!user) {
            return NextResponse.json(
                { error: 'Identifiants invalides' },
                { status: 401 }
            );
        }

        const isValid = await verifyPassword(password, user.passwordHash);

        if (!isValid) {
            return NextResponse.json(
                { error: 'Identifiants invalides' },
                { status: 401 }
            );
        }

        const response = NextResponse.json({ success: true, user: { id: user.id, username: user.username } });
        response.headers.set('Set-Cookie', createSessionCookie(user.id));

        return response;
    } catch (e) {
        console.error('Login error:', e);
        return NextResponse.json(
            { error: 'Erreur serveur lors de la connexion' },
            { status: 500 }
        );
    }
}
