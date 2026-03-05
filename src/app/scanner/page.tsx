'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';

interface DelegateResult {
    delegateId: string;
    name: string;
    age: number;
    entity: string;
    foodPreference: string;
    delegatePack: boolean;
    checkedIn: boolean;
    checkedInAt?: string;
}

type ScanState = 'idle' | 'scanning' | 'success' | 'duplicate' | 'error';

export default function ScannerPage() {
    const [scanState, setScanState] = useState<ScanState>('idle');
    const [delegate, setDelegate] = useState<DelegateResult | null>(null);
    const [errorMsg, setErrorMsg] = useState('');
    const [scannerActive, setScannerActive] = useState(false);
    const scannerRef = useRef<HTMLDivElement>(null);
    const html5QrScannerRef = useRef<any>(null);

    const processUrl = useCallback(async (scannedUrl: string) => {
        // Extract delegateId from URL
        const match = scannedUrl.match(/\/delegate\/(DEL\d+)/i);
        if (!match) {
            setScanState('error');
            setErrorMsg('Invalid QR code format');
            return;
        }

        const delegateId = match[1];

        try {
            // Check in the delegate
            const res = await fetch(`/api/delegates/${delegateId}`, {
                method: 'PATCH',
            });
            const result = await res.json();

            if (!result.success) {
                setScanState('error');
                setErrorMsg(result.error || 'Delegate not found');
                return;
            }

            const checkInData = result.data;
            setDelegate(checkInData.delegate);

            if (checkInData.alreadyCheckedIn) {
                setScanState('duplicate');
            } else {
                setScanState('success');
            }
        } catch {
            setScanState('error');
            setErrorMsg('Network error. Please try again.');
        }
    }, []);

    const startScanner = useCallback(async () => {
        if (!scannerRef.current) return;

        try {
            const { Html5Qrcode } = await import('html5-qrcode');
            const scanner = new Html5Qrcode('qr-reader');
            html5QrScannerRef.current = scanner;

            await scanner.start(
                { facingMode: 'environment' },
                {
                    fps: 10,
                    qrbox: { width: 250, height: 250 },
                    aspectRatio: 1,
                },
                (decodedText) => {
                    scanner.stop().catch(() => { });
                    setScannerActive(false);
                    processUrl(decodedText);
                },
                () => { }
            );
            setScannerActive(true);
        } catch (err) {
            setErrorMsg('Camera access denied or not available');
            setScanState('error');
        }
    }, [processUrl]);

    const stopScanner = useCallback(async () => {
        if (html5QrScannerRef.current) {
            try {
                await html5QrScannerRef.current.stop();
            } catch { }
            html5QrScannerRef.current = null;
        }
        setScannerActive(false);
    }, []);

    const resetScanner = useCallback(() => {
        setScanState('idle');
        setDelegate(null);
        setErrorMsg('');
        setTimeout(() => startScanner(), 300);
    }, [startScanner]);

    useEffect(() => {
        return () => {
            stopScanner();
        };
    }, [stopScanner]);

    return (
        <div className="page-container scanner-page">
            <nav className="top-nav">
                <Link href="/" className="nav-back">← Home</Link>
                <h1 className="nav-title">QR Scanner</h1>
                <div style={{ width: 60 }} />
            </nav>

            <div className="scanner-content">
                {scanState === 'idle' && !scannerActive && (
                    <div className="scanner-start">
                        <div className="scanner-icon">📷</div>
                        <h2>Ready to Scan</h2>
                        <p>Point your camera at a delegate&apos;s QR code</p>
                        <button className="btn btn-primary btn-large" onClick={startScanner}>
                            Start Scanner
                        </button>
                    </div>
                )}

                {(scanState === 'idle' || scanState === 'scanning') && (
                    <div className={`scanner-viewport ${scannerActive ? 'active' : ''}`}>
                        <div id="qr-reader" ref={scannerRef}></div>
                        {scannerActive && (
                            <button className="btn btn-danger btn-small" onClick={stopScanner}>
                                Stop
                            </button>
                        )}
                    </div>
                )}

                {/* Success State */}
                {scanState === 'success' && delegate && (
                    <div className="scan-result success-result">
                        <div className="result-header success-header">
                            <div className="result-icon">✅</div>
                            <h2>Check-In Successful!</h2>
                        </div>
                        <DelegateCard delegate={delegate} />
                        <button className="btn btn-primary btn-large" onClick={resetScanner}>
                            Scan Next
                        </button>
                    </div>
                )}

                {/* Duplicate State */}
                {scanState === 'duplicate' && delegate && (
                    <div className="scan-result duplicate-result">
                        <div className="result-header duplicate-header">
                            <div className="result-icon">⚠️</div>
                            <h2>Already Checked In!</h2>
                            {delegate.checkedInAt && (
                                <p className="checkin-time">
                                    Checked in at {new Date(delegate.checkedInAt).toLocaleTimeString()}
                                </p>
                            )}
                        </div>
                        <DelegateCard delegate={delegate} />
                        <button className="btn btn-primary btn-large" onClick={resetScanner}>
                            Scan Next
                        </button>
                    </div>
                )}

                {/* Error State */}
                {scanState === 'error' && (
                    <div className="scan-result error-result">
                        <div className="result-header error-header">
                            <div className="result-icon">❌</div>
                            <h2>Error</h2>
                            <p>{errorMsg}</p>
                        </div>
                        <button className="btn btn-primary btn-large" onClick={resetScanner}>
                            Try Again
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}

function DelegateCard({ delegate }: { delegate: DelegateResult }) {
    return (
        <div className="delegate-card">
            <div className="delegate-id">{delegate.delegateId}</div>
            <h3 className="delegate-name">{delegate.name}</h3>
            <div className="delegate-details">
                <div className="detail-row">
                    <span className="detail-label">🎂 Age</span>
                    <span className="detail-value">{delegate.age}</span>
                </div>
                <div className="detail-row">
                    <span className="detail-label">🏢 Entity</span>
                    <span className="detail-value">{delegate.entity}</span>
                </div>
                <div className="detail-row">
                    <span className="detail-label">🍽️ Food</span>
                    <span className="detail-value food-badge" data-pref={delegate.foodPreference.toLowerCase().includes('veg') && !delegate.foodPreference.toLowerCase().includes('non') ? 'veg' : 'nonveg'}>
                        {delegate.foodPreference}
                    </span>
                </div>
                <div className="detail-row">
                    <span className="detail-label">🎒 Delegate Pack</span>
                    <span className={`detail-value pack-badge ${delegate.delegatePack ? 'pack-yes' : 'pack-no'}`}>
                        {delegate.delegatePack ? 'Yes ✓' : 'No ✗'}
                    </span>
                </div>
            </div>
        </div>
    );
}
