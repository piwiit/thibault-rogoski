import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';

export async function POST(req: NextRequest) {
    try {
        const formData = await req.formData();
        const file = formData.get('file') as File;

        if (!file) {
            return NextResponse.json({ error: 'Aucun fichier fourni' }, { status: 400 });
        }

        // Vérifier le type de fichier
        const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];
        if (!allowedTypes.includes(file.type)) {
            return NextResponse.json(
                { error: 'Type de fichier non autorisé. Utilisez JPEG, PNG, WebP ou GIF.' },
                { status: 400 }
            );
        }

        // Vérifier la taille (max 5MB)
        const maxSize = 5 * 1024 * 1024; // 5MB
        if (file.size > maxSize) {
            return NextResponse.json(
                { error: 'Fichier trop volumineux. Taille maximale : 5MB' },
                { status: 400 }
            );
        }

        // Créer le dossier images s'il n'existe pas
        const uploadDir = join(process.cwd(), 'public', 'images');
        if (!existsSync(uploadDir)) {
            await mkdir(uploadDir, { recursive: true });
        }

        // Générer un nom de fichier unique
        const timestamp = Date.now();
        const sanitizedName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
        const filename = `${timestamp}_${sanitizedName}`;
        const filepath = join(uploadDir, filename);

        // Convertir le fichier en buffer et l'écrire
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);
        await writeFile(filepath, buffer);

        // Retourner l'URL de l'image
        const imageUrl = `/images/${filename}`;

        return NextResponse.json({ success: true, imageUrl });
    } catch (e) {
        console.error('Upload error:', e);
        return NextResponse.json(
            { error: 'Erreur lors de l\'upload', details: e instanceof Error ? e.message : e },
            { status: 500 }
        );
    }
}

