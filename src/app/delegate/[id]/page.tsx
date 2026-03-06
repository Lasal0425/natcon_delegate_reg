import { getDelegate } from '@/lib/delegates';
import Link from 'next/link';
import { notFound } from 'next/navigation';

export const dynamic = 'force-dynamic';

export default async function DelegatePage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;
    const delegate = getDelegate(id);

    if (!delegate) {
        notFound();
    }

    return (
        <div className="page-container delegate-page">
            <nav className="top-nav">
                <Link href="/scanner" className="nav-back">← Scanner</Link>
                <h1 className="nav-title">Delegate Info</h1>
                <div style={{ width: 60 }} />
            </nav>

            <div className="delegate-display">
                <div className={`status-banner ${delegate.checkedIn ? 'checked-in' : 'not-checked-in'}`}>
                    {delegate.checkedIn ? '✅ Checked In' : '⏳ Not Yet Checked In'}
                </div>

                <div className="delegate-card large-card">
                    <div className="delegate-id">{delegate.delegateId}</div>
                    <h2 className="delegate-name">{delegate.name}</h2>
                    <div className="delegate-details">
                        <div className="detail-row">
                            <span className="detail-label">📧 Email</span>
                            <span className="detail-value">{delegate.email}</span>
                        </div>
                        <div className="detail-row">
                            <span className="detail-label">🎂 Age</span>
                            <span className="detail-value">{delegate.age}</span>
                        </div>
                        <div className="detail-row">
                            <span className="detail-label">🏢 Entity</span>
                            <span className="detail-value">{delegate.entity}</span>
                        </div>
                        <div className="detail-row">
                            <span className="detail-label">🍽️ Food Preference</span>
                            <span className="detail-value">{delegate.foodPreference}</span>
                        </div>
                        <div className="detail-row">
                            <span className="detail-label">🎒 Delegate Pack</span>
                            <span className={`detail-value pack-badge ${delegate.delegatePack ? 'pack-yes' : 'pack-no'}`}>
                                {delegate.delegatePack ? 'Yes ✓' : 'No ✗'}
                            </span>
                        </div>
                    </div>
                </div>

                <div style={{ marginTop: 24, display: 'flex', justifyContent: 'center' }}>
                    <Link href="/scanner" className="btn btn-primary btn-large">
                        📷 Back to QR Scanner
                    </Link>
                </div>
            </div>
        </div>
    );
}
