import 'dotenv/config';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    const username = process.env.ADMIN_USER;
    const email = process.env.ADMIN_EMAIL || 'admin@example.com';

    if (!username) {
        console.error('ADMIN_USER non défini dans le .env');
        return;
    }

    const user = await prisma.user.findUnique({ where: { username } });

    if (!user) {
        console.error(`Utilisateur "${username}" non trouvé.`);
        return;
    }

    await prisma.user.update({
        where: { id: user.id },
        data: { email }
    });

    console.log(`Email mis à jour pour "${username}" : ${email}`);
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
