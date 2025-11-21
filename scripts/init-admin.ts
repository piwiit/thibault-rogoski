import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
    const username = 'admin';
    const password = 'admin';

    const existingUser = await prisma.user.findUnique({ where: { username } });

    if (existingUser) {
        console.log('User admin already exists');
        return;
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
        data: {
            username,
            passwordHash,
        },
    });

    console.log('Admin user created successfully!');
    console.log('Username:', username);
    console.log('Password:', password);
    console.log('⚠️  Please change the password after first login!');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });

