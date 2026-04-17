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

        const delegates: Delegate[] = rawDelegates.map((rawRow, index) => {
            const id = `DEL${String(index + 1).padStart(3, '0')}`;
            
            // Advanced fuzzy matcher: finds a column that contains ALL required keywords
            const find = (keywords: string[]) => {
                const keys = Object.keys(rawRow);
                const normalizedKeywords = keywords.map(k => k.toLowerCase().replace(/[^a-z0-9]/g, ''));
                
                const foundKey = keys.find(k => {
                    const nk = k.toLowerCase().replace(/[^a-z0-9]/g, '');
                    return normalizedKeywords.every(word => nk.includes(word));
                });
                return foundKey ? rawRow[foundKey] : undefined;
            };

            const firstName = find(['First', 'Name']) || find(['firstName']) || '';
            const lastName = find(['Last', 'Name']) || find(['lastName']) || '';
            const fullName = find(['Full', 'Name']) || find(['name']) || `${firstName} ${lastName}`.trim() || '';

            const parseBoolean = (val: any) => {
                const s = String(val || '').toLowerCase().trim();
                return ['yes', 'true', '1', 'y', 'checked', 'TRUE'].includes(s);
            };
            const parseNum = (val: any) => {
                const s = String(val || '0').replace(/[^0-9]/g, '');
                return parseInt(s || '0', 10);
            };

            return {
                delegateId: id,
                name: fullName,
                firstName: firstName,
                lastName: lastName,
                email: find(['email']) || '',
                age: parseNum(find(['age'])),
                entity: find(['Entity']) || '',
                role: find(['Role']) || find(['Position']) || '',
                foodPreference: find(['Food', 'Preference']) || '',
                delegatePack: parseBoolean(find(['Merch', 'Pack'])) || parseBoolean(find(['Delegate', 'Pack'])),
                contactNumber: find(['Contact', 'Number']) || find(['phone']) || '',
                checkedIn: false,
                
                merchPack: {
                    purchased: parseBoolean(find(['Merch', 'Pack'])) && !find(['Merch', 'Pack'])?.toString().toLowerCase().includes('size'),
                    size: find(['Merch', 'Pack', 'Size']) || '',
                    quantity: parseNum(find(['Merch', 'Pack', 'Qty']) || find(['Merch', 'Pack', 'Quantity']))
                },
                crewNeck: {
                    purchased: parseBoolean(find(['Crew', 'Neck'])),
                    size: find(['Crew', 'Neck', 'Size']) || '',
                    quantity: parseNum(find(['Crew', 'Neck', 'Qty']) || find(['Crew', 'Neck', 'Quantity']))
                },
                drawstringBag: {
                    purchased: parseBoolean(find(['Drawstring', 'Bag'])),
                    quantity: parseNum(find(['Drawstring', 'Bag', 'Qty']) || find(['Drawstring', 'Bag', 'Quantity']))
                },
                pouch: {
                    purchased: parseBoolean(find(['Pouch'])),
                    quantity: parseNum(find(['Pouch', 'Qty']) || find(['Pouch', 'Quantity']))
                },
                radiumWristBand: {
                    purchased: parseBoolean(find(['Radium', 'Wrist', 'Band'])) || parseBoolean(find(['Wrist', 'Band'])),
                    quantity: parseNum(find(['Wrist', 'Band', 'Qty']) || find(['Wrist', 'Band', 'Quantity']))
                },
                totalItems: parseNum(find(['Total', 'Item', 'Count']) || find(['Total']))
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
