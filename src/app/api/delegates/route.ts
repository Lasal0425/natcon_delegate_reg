import { NextRequest, NextResponse } from 'next/server';
import { getDelegates, saveDelegates } from '@/lib/delegates';
import { Delegate } from '@/lib/types';

export async function GET() {
    try {
        const delegates = await getDelegates();
        return NextResponse.json({ success: true, data: delegates });
    } catch (error) {
        return NextResponse.json(
            { success: false, error: 'Failed to fetch delegates' },
            { status: 500 }
        );
    }
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { delegates: rawDelegates } = body as { delegates: Array<Record<string, string>> };

        if (!rawDelegates || !Array.isArray(rawDelegates)) {
            return NextResponse.json(
                { success: false, error: 'Invalid data format' },
                { status: 400 }
            );
        }

        const delegates: Delegate[] = rawDelegates.map((row, index) => {
            const id = `DEL${String(index + 1).padStart(3, '0')}`;
            return {
                delegateId: id,
                name: row.name || row['Full Name'] || row['full_name'] || '',
                email: row.email || row['Email'] || row['email_address'] || '',
                age: parseInt(row.age || row['Age'] || '0', 10),
                entity: row.entity || row['Entity'] || row['Entity (AIESEC Local Committee)'] || row['AIESEC Local Committee'] || '',
                foodPreference: row.foodPreference || row['Food Preference'] || row['food_preference'] || '',
                delegatePack: ['yes', 'true', '1'].includes(
                    (row.delegatePack || row['Delegate Pack'] || row['delegate_pack'] || 'no').toLowerCase().trim()
                ),
                checkedIn: false,
            };
        });

        await saveDelegates(delegates);

        return NextResponse.json({
            success: true,
            data: { count: delegates.length },
        });
    } catch (error) {
        return NextResponse.json(
            { success: false, error: 'Failed to save delegates' },
            { status: 500 }
        );
    }
}
