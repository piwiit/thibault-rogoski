import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { checkRateLimit, getClientIp } from '@/lib/rate-limit';

const ContactSchema = z.object({
  name: z.string().trim().min(2, 'Le nom doit contenir au moins 2 caractères').max(100, 'Le nom est trop long'),
  email: z.string().trim().email('Adresse email invalide').max(200, 'L\'adresse email est trop longue'),
  message: z.string().trim().min(5, 'Le message doit contenir au moins 5 caractères').max(5000, 'Le message est trop long'),
  honeypot: z.string().optional(),
});

export async function POST(req: NextRequest) {
  try {
    const ip = getClientIp(req);
    const rateCheck = checkRateLimit('contact', ip, 5, 10 * 60 * 1000); // 5 messages par 10 min
    if (!rateCheck.allowed) {
      return NextResponse.json(
        { error: 'Trop de messages envoyés. Veuillez patienter quelques minutes avant de réécrire.' },
        { status: 429 }
      );
    }

    const data = await req.json();
    const parsed = ContactSchema.safeParse(data);
    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Données invalides', details: parsed.error.issues },
        { status: 400 }
      );
    }

    // Protection anti-bot Honeypot : si le champ caché est rempli, on feint le succès sans enregistrer
    if (parsed.data.honeypot && parsed.data.honeypot.trim() !== '') {
      return NextResponse.json({ success: true });
    }

    await prisma.contact.create({
      data: {
        name: parsed.data.name,
        email: parsed.data.email,
        message: parsed.data.message,
      },
    });

    // Send notification email via Resend, but do not expose errors to the client.
    try {
      const { sendContactEmail } = await import('@/lib/email');
      await sendContactEmail({
        name: parsed.data.name,
        email: parsed.data.email,
        message: parsed.data.message,
      });
    } catch (emailErr) {
      console.error('Contact email sending failed:', emailErr);
    }

    return NextResponse.json({
      success: true,
      message: 'Votre message a bien été envoyé. Nous vous répondrons dans les plus brefs délais.',
    });
  } catch (e) {
    console.error('Contact form error:', e);
    return NextResponse.json(
      { error: 'Une erreur est survenue lors de l\'envoi du message' },
      { status: 500 }
    );
  }
}
