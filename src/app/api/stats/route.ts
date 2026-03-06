import { NextResponse } from 'next/server';
import { getStats } from '@/lib/delegates';

export async function GET() {
    try {
        const stats = await getStats();
        return NextResponse.json({ success: true, data: stats });
    } catch (error) {
        return NextResponse.json(
            { success: false, error: 'Failed to fetch stats' },
            { status: 500 }
        );
    }
}
