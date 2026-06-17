import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

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

        // Générer un nom de fichier unique
        const timestamp = Date.now();
        const sanitizedName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
        const filename = `${timestamp}_${sanitizedName}`;

        // Upload vers Supabase
        const { data, error } = await supabase.storage
            .from('Image')
            .upload(filename, file, {
                contentType: file.type,
                upsert: true,
            });

        if (error) {
            console.error('Supabase upload error:', error);
            return NextResponse.json({ error: 'Erreur lors de l\'upload sur Supabase' }, { status: 500 });
        }

        // Obtenir l'URL publique
        const { data: publicUrlData } = supabase.storage
            .from('Image')
            .getPublicUrl(filename);

        return NextResponse.json({ success: true, imageUrl: publicUrlData.publicUrl });
    } catch (e) {
        console.error('Upload error:', e);
        return NextResponse.json(
            { error: 'Erreur lors de l\'upload', details: e instanceof Error ? e.message : e },
            { status: 500 }
        );
    }
}

