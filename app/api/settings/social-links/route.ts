import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { getLandingContent, saveLandingContent } from '@/lib/landing';

export async function GET() {
  try {
    const content = await getLandingContent();
    return NextResponse.json({
      facebook: content.social.facebook,
      instagram: content.social.instagram,
      linkedin: content.social.linkedin,
    });
  } catch (error) {
    console.error('GET /api/settings/social-links error:', error);
    return NextResponse.json({ facebook: '', instagram: '', linkedin: '' });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    }

    const body = await req.json();
    const content = await getLandingContent();

    content.social = {
      facebook: body.facebook || '',
      instagram: body.instagram || '',
      linkedin: body.linkedin || '',
    };

    await saveLandingContent(content);

    return NextResponse.json({
      success: true,
      message: 'Liens des réseaux sociaux mis à jour',
    });
  } catch (error) {
    console.error('POST /api/settings/social-links error:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}
