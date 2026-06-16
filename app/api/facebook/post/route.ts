import { NextResponse } from 'next/server';
import { postToFacebook } from '@/lib/facebook';

export async function POST() {
  try {
    const message = 'Test depuis Next.js - publication Facebook';
    const result = await postToFacebook(message);

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 500 });
    }

    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
