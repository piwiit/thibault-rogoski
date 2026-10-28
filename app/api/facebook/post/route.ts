import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { postToFacebook } from '@/lib/facebook';

export async function POST() {
  try {
    // Désactiver impérativement cet endpoint de test hors environnement de développement
    if (process.env.NODE_ENV !== 'development') {
      return NextResponse.json({ error: 'Endpoint indisponible' }, { status: 404 });
    }

    const userId = await getSession();
    if (!userId) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    }

    const message = 'Test depuis Next.js - publication Facebook sécurisée';
    const result = await postToFacebook(message);

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 500 });
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error('Test Facebook post error:', error);
    return NextResponse.json(
      { error: 'Erreur lors du test de publication Facebook' },
      { status: 500 }
    );
  }
}
