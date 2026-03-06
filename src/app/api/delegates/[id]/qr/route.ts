import { NextRequest, NextResponse } from 'next/server';
import QRCode from 'qrcode';
import { getDelegate } from '@/lib/delegates';

const EVENT_DOMAIN = process.env.EVENT_DOMAIN || 'http://localhost:3000';

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const delegate = getDelegate(id);

        if (!delegate) {
            return NextResponse.json(
                { success: false, error: 'Delegate not found' },
                { status: 404 }
            );
        }

        const url = `${EVENT_DOMAIN}/delegate/${delegate.delegateId}`;
        const qrBuffer = await QRCode.toBuffer(url, {
            type: 'png',
            width: 400,
            margin: 2,
            color: {
                dark: '#000000',
                light: '#FFFFFF',
            },
        });

        return new NextResponse(new Uint8Array(qrBuffer), {
            headers: {
                'Content-Type': 'image/png',
                'Content-Disposition': `inline; filename="${delegate.delegateId}.png"`,
            },
        });
    } catch (error) {
        return NextResponse.json(
            { success: false, error: 'Failed to generate QR code' },
            { status: 500 }
        );
    }
}
