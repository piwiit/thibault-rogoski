import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

const MIN_PASSWORD_LENGTH = 12;

function ensureDevelopmentEnvironment() {
    const env = process.env.NODE_ENV ?? 'development';
    if (env !== 'development') {
        throw new Error('scripts/init-admin.ts ne peut être exécuté qu’en environnement de développement.');
    }
}

function ensureCredentials(username: string | undefined, password: string | undefined) {
    if (!username) {
        throw new Error('ADMIN_USER est manquant dans les variables d’environnement.');
    }
    if (!password) {
        throw new Error('ADMIN_PASSWORD est manquant dans les variables d’environnement.');
    }
    const hasUpper = /[A-Z]/.test(password);
    const hasLower = /[a-z]/.test(password);
    const hasDigit = /[0-9]/.test(password);
    const hasSymbol = /[^A-Za-z0-9]/.test(password);
    if (
        password.length < MIN_PASSWORD_LENGTH ||
        !hasUpper ||
        !hasLower ||
        !hasDigit ||
        !hasSymbol
    ) {
        throw new Error(
            `ADMIN_PASSWORD doit contenir au moins ${MIN_PASSWORD_LENGTH} caractères, ` +
            'avec majuscules, minuscules, chiffres et caractères spéciaux.'
        );
    }
    return { username, password };
}

async function main() {
    ensureDevelopmentEnvironment();
    const { username, password } = ensureCredentials(process.env.ADMIN_USER, process.env.ADMIN_PASSWORD);

    const existingUser = await prisma.user.findUnique({ where: { username } });

    if (existingUser) {
        console.log(`L’utilisateur "${username}" existe déjà.`);
        return;
    }

    const passwordHash = await bcrypt.hash(password, 10);

    await prisma.user.create({
        data: {
            username,
            passwordHash,
        },
    });

    console.log('Utilisateur admin créé avec succès (environnement de développement).');
    console.log(`Identifiant : ${username}`);
    console.log('⚠️  Pensez à stocker ce mot de passe de façon sécurisée.');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });

