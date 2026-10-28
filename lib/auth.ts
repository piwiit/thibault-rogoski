import { cookies } from 'next/headers';
import { prisma } from './prisma';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';

const SESSION_SECRET =
    process.env.SESSION_SECRET ||
    process.env.ADMIN_PASSWORD ||
    'fallback-thibault-secret-key-32-chars-long!';
const SESSION_MAX_AGE_SECONDS = 60 * 60 * 24 * 7; // 7 days

export async function hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, 10);
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
}

export function signSession(userId: number): string {
    const payload = `${userId}.${Date.now()}`;
    const hmac = crypto.createHmac('sha256', SESSION_SECRET).update(payload).digest('base64url');
    return `${payload}.${hmac}`;
}

export function verifySession(token: string): number | null {
    try {
        const parts = token.split('.');
        if (parts.length !== 3) return null;

        const [userIdStr, timestampStr, signature] = parts;
        const payload = `${userIdStr}.${timestampStr}`;
        const expectedSignature = crypto.createHmac('sha256', SESSION_SECRET).update(payload).digest('base64url');

        if (
            signature.length !== expectedSignature.length ||
            !crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expectedSignature))
        ) {
            return null;
        }

        const timestamp = parseInt(timestampStr, 10);
        if (isNaN(timestamp) || Date.now() - timestamp > SESSION_MAX_AGE_SECONDS * 1000) {
            return null;
        }

        const userId = parseInt(userIdStr, 10);
        return isNaN(userId) ? null : userId;
    } catch {
        return null;
    }
}

export function createSessionCookie(userId: number): string {
    const token = signSession(userId);
    const isProd = process.env.NODE_ENV === 'production';
    return `admin-session=${token}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${SESSION_MAX_AGE_SECONDS}${isProd ? '; Secure' : ''}`;
}

export async function getSession(): Promise<number | null> {
    try {
        const cookieStore = await cookies();
        const session = cookieStore.get('admin-session');
        if (!session?.value) return null;

        const userId = verifySession(session.value);
        if (!userId) return null;

        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: { id: true },
        });
        return user ? user.id : null;
    } catch {
        return null;
    }
}

export async function destroySessionCookie(): Promise<string> {
    const isProd = process.env.NODE_ENV === 'production';
    return `admin-session=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0${isProd ? '; Secure' : ''}`;
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
