import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyPassword, createSessionCookie } from '@/lib/auth';
import { z } from 'zod';

const LoginSchema = z.object({
    username: z.string().min(1, 'Le nom d\'utilisateur est requis'),
    password: z.string().min(1, 'Le mot de passe est requis'),
});

export async function POST(req: NextRequest) {
    try {
        const data = await req.json();
        const parsed = LoginSchema.safeParse(data);

        if (!parsed.success) {
            return NextResponse.json(
                { error: 'Invalid data', details: parsed.error.issues },
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
        return NextResponse.json(
            { error: 'Server error', details: e instanceof Error ? e.message : e },
            { status: 500 }
        );
    }
}

