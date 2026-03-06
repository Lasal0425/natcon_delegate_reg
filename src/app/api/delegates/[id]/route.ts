import { NextRequest, NextResponse } from 'next/server';
import { getDelegate, checkInDelegate } from '@/lib/delegates';

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const delegate = await getDelegate(id);
        if (!delegate) {
            return NextResponse.json(
                { success: false, error: 'Delegate not found' },
                { status: 404 }
            );
        }
        return NextResponse.json({ success: true, data: delegate });
    } catch (error) {
        return NextResponse.json(
            { success: false, error: 'Failed to fetch delegate' },
            { status: 500 }
        );
    }
}

export async function PATCH(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const result = await checkInDelegate(id);

        if (!result.success) {
            return NextResponse.json(
                { success: false, error: result.message },
                { status: 404 }
            );
        }

        return NextResponse.json({
            success: true,
            data: result,
        });
    } catch (error) {
        return NextResponse.json(
            { success: false, error: 'Failed to check in delegate' },
            { status: 500 }
        );
    }
}
