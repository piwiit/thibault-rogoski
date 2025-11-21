import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';

const ContactSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  message: z.string().min(5)
});

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    const parsed = ContactSchema.safeParse(data);
    if (!parsed.success) {
      return NextResponse.json({ error: 'Invalid data', details: parsed.error.issues }, { status: 400 });
    }
    const contact = await prisma.contact.create({ data: parsed.data });
    return NextResponse.json({ success: true, contact });
  } catch (e) {
    return NextResponse.json({ error: 'Server error', details: e instanceof Error ? e.message : e }, { status: 500 });
  }
}
