import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { verifyAuth } from '@/lib/auth';

const prisma = new PrismaClient();

// GET - Récupérer les liens des réseaux sociaux
export async function GET(req: NextRequest) {
    try {
        // Récupérer les paramètres depuis la base de données
        const settings = await prisma.setting.findMany({
            where: {
                key: {
                    in: ['social_facebook', 'social_instagram', 'social_linkedin']
                }
            }
        });

        // Convertir en objet
        const links = {
            facebook: settings.find(s => s.key === 'social_facebook')?.value || '',
            instagram: settings.find(s => s.key === 'social_instagram')?.value || '',
            linkedin: settings.find(s => s.key === 'social_linkedin')?.value || ''
        };

        return NextResponse.json(links);
    } catch (error) {
        console.error('Erreur lors de la récupération des liens:', error);
        return NextResponse.json(
            { error: 'Erreur serveur' },
            { status: 500 }
        );
    }
}

// POST - Mettre à jour les liens des réseaux sociaux (nécessite authentification)
export async function POST(req: NextRequest) {
    try {
        // Vérifier l'authentification
        const authResult = await verifyAuth(req);
        if (!authResult.isAuthenticated) {
            return NextResponse.json(
                { error: 'Non autorisé' },
                { status: 401 }
            );
        }

        const body = await req.json();
        const { facebook, instagram, linkedin } = body;

        // Mettre à jour ou créer chaque lien
        const updates = [
            { key: 'social_facebook', value: facebook || '' },
            { key: 'social_instagram', value: instagram || '' },
            { key: 'social_linkedin', value: linkedin || '' }
        ];

        for (const update of updates) {
            await prisma.setting.upsert({
                where: { key: update.key },
                update: { value: update.value },
                create: { key: update.key, value: update.value }
            });
        }

        return NextResponse.json({
            success: true,
            message: 'Liens des réseaux sociaux mis à jour'
        });
    } catch (error) {
        console.error('Erreur lors de la mise à jour des liens:', error);
        return NextResponse.json(
            { error: 'Erreur serveur' },
            { status: 500 }
        );
    }
}
