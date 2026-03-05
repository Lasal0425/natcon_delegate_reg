import fs from 'fs';
import path from 'path';
import { Delegate, CheckInResult, DelegateStats } from './types';

const DATA_DIR = path.join(process.cwd(), 'data');
const DATA_FILE = path.join(DATA_DIR, 'delegates.json');

function ensureDataDir() {
    if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, { recursive: true });
    }
}

export function getDelegates(): Delegate[] {
    ensureDataDir();
    if (!fs.existsSync(DATA_FILE)) {
        return [];
    }
    const raw = fs.readFileSync(DATA_FILE, 'utf-8');
    return JSON.parse(raw) as Delegate[];
}

export function getDelegate(id: string): Delegate | undefined {
    const delegates = getDelegates();
    return delegates.find((d) => d.delegateId === id);
}

export function saveDelegates(delegates: Delegate[]): void {
    ensureDataDir();
    fs.writeFileSync(DATA_FILE, JSON.stringify(delegates, null, 2), 'utf-8');
}

export function checkInDelegate(id: string): CheckInResult {
    const delegates = getDelegates();
    const delegate = delegates.find((d) => d.delegateId === id);

    if (!delegate) {
        return {
            success: false,
            delegate: null as unknown as Delegate,
            alreadyCheckedIn: false,
            message: 'Delegate not found',
        };
    }

    if (delegate.checkedIn) {
        return {
            success: true,
            delegate,
            alreadyCheckedIn: true,
            message: `Already checked in at ${delegate.checkedInAt || 'unknown time'}`,
        };
    }

    delegate.checkedIn = true;
    delegate.checkedInAt = new Date().toISOString();
    saveDelegates(delegates);

    return {
        success: true,
        delegate,
        alreadyCheckedIn: false,
        message: 'Check-in successful!',
    };
}

export function getStats(): DelegateStats {
    const delegates = getDelegates();
    const total = delegates.length;
    const checkedIn = delegates.filter((d) => d.checkedIn).length;
    return {
        total,
        checkedIn,
        remaining: total - checkedIn,
        percentage: total > 0 ? Math.round((checkedIn / total) * 100) : 0,
    };
}
