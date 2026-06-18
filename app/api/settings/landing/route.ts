import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { getSession } from '@/lib/auth';
import { revalidatePath } from 'next/cache';
import {
  defaultLandingContent,
  getLandingContent,
  saveLandingContent,
  type LandingContent,
} from '@/lib/landing';

const highlightSchema = z.object({
  title: z.string().min(1),
  subtitle: z.string().min(1),
});

const serviceItemSchema = z.object({
  title: z.string().min(1),
  icon: z.string().min(1),
  description: z.string().min(1),
  items: z.array(z.string().min(1)).min(1),
  color: z.string().min(1),
});

const landingContentSchema = z.object({
  site: z.object({
    brandName: z.string().min(1),
    brandInitials: z.string().min(1).max(4),
    faviconUrl: z.string().optional(),
  }),
  hero: z.object({
    badge: z.string().min(1),
    titleLine1: z.string().min(1),
    titleLine2: z.string().min(1),
    subtitle: z.string().min(1),
    ctaPrimary: z.string().min(1),
    ctaSecondary: z.string().min(1),
    highlights: z.array(highlightSchema).length(3),
  }),
  services: z.object({
    title: z.string().min(1),
    subtitle: z.string().min(1),
    items: z.array(serviceItemSchema).min(1).max(6),
  }),
  cta: z.object({
    title: z.string().min(1),
    subtitle: z.string().min(1),
    buttonPrimary: z.string().min(1),
    buttonSecondary: z.string().min(1),
  }),
  footer: z.object({
    about: z.string().min(1),
    phone: z.string().min(1),
    email: z.string().email(),
    copyright: z.string().min(1),
  }),
  social: z.object({
    facebook: z.string(),
    instagram: z.string(),
    linkedin: z.string(),
  }),
});

export async function GET() {
  try {
    const content = await getLandingContent();
    return NextResponse.json(content);
  } catch (error) {
    console.error('GET /api/settings/landing error:', error);
    return NextResponse.json(defaultLandingContent);
  }
}

export async function PUT(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    }

    const body = await req.json();
    const parsed = landingContentSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Données invalides', details: parsed.error.issues },
        { status: 400 }
      );
    }

    await saveLandingContent(parsed.data as LandingContent);
    revalidatePath('/', 'layout');
    
    return NextResponse.json({ success: true, content: parsed.data });
  } catch (error) {
    console.error('PUT /api/settings/landing error:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}
