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
    const delegate = await getDelegate(id);

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
                            <span className="detail-label">🏢 Entity</span>
                            <span className="detail-value">{delegate.entity}</span>
                        </div>
                        <div className="detail-row">
                            <span className="detail-label">🎒 Merch Pack</span>
                            <span className={`detail-value pack-badge ${delegate.merchPack?.purchased ? 'pack-yes' : 'pack-no'}`}>
                                {delegate.merchPack?.purchased ? `${delegate.merchPack.size} (x${delegate.merchPack.quantity})` : 'No'}
                            </span>
                        </div>
                        {delegate.crewNeck?.purchased && (
                            <div className="detail-row">
                                <span className="detail-label">👕 Crew Neck</span>
                                <span className="detail-value">{delegate.crewNeck.size} (x{delegate.crewNeck.quantity})</span>
                            </div>
                        )}
                        {delegate.drawstringBag?.purchased && (
                            <div className="detail-row">
                                <span className="detail-label">🎒 Drawstring Bag</span>
                                <span className="detail-value">x{delegate.drawstringBag.quantity}</span>
                            </div>
                        )}
                        {delegate.pouch?.purchased && (
                            <div className="detail-row">
                                <span className="detail-label">👝 Pouch</span>
                                <span className="detail-value">x{delegate.pouch.quantity}</span>
                            </div>
                        )}
                        {delegate.radiumWristBand?.purchased && (
                            <div className="detail-row">
                                <span className="detail-label">⌚ Radium Wrist Band</span>
                                <span className="detail-value">x{delegate.radiumWristBand.quantity}</span>
                            </div>
                        )}
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
