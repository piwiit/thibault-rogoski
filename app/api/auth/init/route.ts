import { NextResponse } from 'next/server';
import { initAdminUser } from '@/lib/auth';

export async function POST() {
    try {
        if (process.env.NODE_ENV !== 'development') {
            return NextResponse.json(
                { error: 'Endpoint désactivé en production' },
                { status: 403 }
            );
        }

        await initAdminUser();
        return NextResponse.json({ success: true, message: 'Admin user initialized' });
    } catch (e) {
        return NextResponse.json(
            { error: 'Server error', details: e instanceof Error ? e.message : e },
            { status: 500 }
        );
    }
}

