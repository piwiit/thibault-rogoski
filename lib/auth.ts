import { cookies } from 'next/headers';
import { prisma } from './prisma';
import bcrypt from 'bcryptjs';

// ----------------------------
// Password hashing
// ----------------------------
export async function hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, 10);
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
}

// ----------------------------
// Session cookie
// ----------------------------
export function createSessionCookie(userId: number): string {
    return `admin-session=${userId}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${60 * 60 * 24 * 7
        }${process.env.NODE_ENV === 'production' ? '; Secure' : ''}`;
}

export async function destroySessionCookie(): Promise<string> {
    return 'admin-session=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0';
}

export async function getSession(): Promise<number | null> {
    try {
        const cookieStore = await cookies();
        const session = cookieStore.get('admin-session');
        if (!session) return null;

        const id = Number(session.value);
        if (isNaN(id)) return null;

        const user = await prisma.user.findUnique({ where: { id } });
        return user ? id : null;
    } catch {
        return null;
    }
}

// ----------------------------
// Create FIRST admin user
// (Only if DB is empty)
// ----------------------------
export async function initAdminUser() {
    const count = await prisma.user.count();

    if (count === 0) {
        const passwordHash = await hashPassword('admin');

        await prisma.user.create({
            data: {
                username: 'admin',
                passwordHash,
                // Reset password fields (for future email reset system)
                resetToken: null,
                resetTokenExpiry: null,
            },
        });

        console.log('✔ First admin created: admin/admin');
    }
}

// ----------------------------
// Reset password (future email system)
// ----------------------------

// Generate reset token
export async function createPasswordResetToken() {
    const token = crypto.randomUUID();
    const expiry = new Date(Date.now() + 1000 * 60 * 15); // valid for 15 minutes

    await prisma.user.updateMany({
        data: {
            resetToken: token,
            resetTokenExpiry: expiry,
        },
    });

    return { token, expiry };
}

// Validate reset token
export async function validateResetToken(token: string) {
    return prisma.user.findFirst({
        where: {
            resetToken: token,
            resetTokenExpiry: { gt: new Date() },
        },
    });
}

// Change password
export async function updatePassword(userId: number, newPassword: string) {
    const hash = await hashPassword(newPassword);

    await prisma.user.update({
        where: { id: userId },
        data: {
            passwordHash: hash,
            resetToken: null,
            resetTokenExpiry: null,
        },
    });
}
