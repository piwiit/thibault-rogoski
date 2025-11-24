import { cookies } from 'next/headers';
import { prisma } from './prisma';
import bcrypt from 'bcryptjs';

export async function hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, 10);
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
}

export function createSessionCookie(userId: number): string {
    // Retourne la chaîne de cookie à utiliser dans NextResponse
    return `admin-session=${userId.toString()}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${60 * 60 * 24 * 7}${process.env.NODE_ENV === 'production' ? '; Secure' : ''}`;
}

export async function getSession(): Promise<number | null> {
    try {
        const cookieStore = await cookies();
        const session = cookieStore.get('admin-session');
        if (!session) return null;

        const userId = parseInt(session.value);
        if (isNaN(userId)) return null;

        // Vérifier que l'utilisateur existe toujours
        const user = await prisma.user.findUnique({ where: { id: userId } });
        return user ? userId : null;
    } catch {
        return null;
    }
}

export async function destroySessionCookie(): Promise<string> {
    return 'admin-session=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0';
}

export async function initAdminUser() {
    const existingUser = await prisma.user.findUnique({ where: { username: 'admin' } });

    if (!existingUser) {
        const passwordHash = await hashPassword('admin');
        await prisma.user.create({
            data: {
                username: 'admin',
                passwordHash,
            },
        });
        console.log('Admin user created with username: admin, password: admin');
    }
}

