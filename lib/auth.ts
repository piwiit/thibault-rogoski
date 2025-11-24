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

const MIN_ADMIN_PASSWORD_LENGTH = 12;

function validateAdminCredentials() {
    const username = process.env.ADMIN_USER;
    const password = process.env.ADMIN_PASSWORD;

    if (!username) {
        throw new Error('ADMIN_USER doit être défini dans les variables d’environnement.');
    }
    if (!password) {
        throw new Error('ADMIN_PASSWORD doit être défini dans les variables d’environnement.');
    }

    const hasUpper = /[A-Z]/.test(password);
    const hasLower = /[a-z]/.test(password);
    const hasDigit = /[0-9]/.test(password);
    const hasSymbol = /[^A-Za-z0-9]/.test(password);

    if (
        password.length < MIN_ADMIN_PASSWORD_LENGTH ||
        !hasUpper ||
        !hasLower ||
        !hasDigit ||
        !hasSymbol
    ) {
        throw new Error(
            `ADMIN_PASSWORD doit contenir au moins ${MIN_ADMIN_PASSWORD_LENGTH} caractères ` +
            'et inclure majuscules, minuscules, chiffres et caractères spéciaux.'
        );
    }

    return { username, password };
}

export async function initAdminUser() {
    const env = process.env.NODE_ENV ?? 'development';
    if (env !== 'development') {
        throw new Error('initAdminUser est réservé à l’environnement de développement.');
    }

    const { username, password } = validateAdminCredentials();

    const existingUser = await prisma.user.findUnique({ where: { username } });

    if (existingUser) {
        console.log(`L’utilisateur "${username}" existe déjà.`);
        return;
    }

    const passwordHash = await hashPassword(password);
    await prisma.user.create({
        data: {
            username,
            passwordHash,
        },
    });
    console.log(`Utilisateur admin "${username}" créé avec succès en développement.`);
}

