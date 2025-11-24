import { NextResponse } from 'next/server';
import { initAdminUser } from '@/lib/auth';

export async function GET() {
    try {
        await initAdminUser();

        return NextResponse.json({
            success: true,
            message: 'Admin user initialized (or already exists).'
        });
    } catch (error) {
        console.error('Error initializing admin:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to initialize admin.' },
            { status: 500 }
        );
    }
}
