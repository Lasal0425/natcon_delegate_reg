import Link from 'next/link';

export default function Home() {
  return (
    <div className="landing-container">
      <div className="landing-hero">
        <div className="landing-badge">QR Check-In System</div>
        <h1 className="landing-title">
          Event <span className="gradient-text">Check-In</span>
        </h1>
        <p className="landing-subtitle">
          Fast, reliable QR code check-in for your event delegates
        </p>
      </div>

      <div className="landing-cards">
        <Link href="/admin" className="landing-card">
          <div className="card-icon">⚙️</div>
          <h2>Admin Panel</h2>
          <p>Upload CSV, generate QR codes, and send emails</p>
          <span className="card-arrow">→</span>
        </Link>

        <Link href="/scanner" className="landing-card scanner-card">
          <div className="card-icon">📷</div>
          <h2>QR Scanner</h2>
          <p>Scan delegate QR codes for check-in</p>
          <span className="card-arrow">→</span>
        </Link>

        <Link href="/dashboard" className="landing-card">
          <div className="card-icon">📊</div>
          <h2>Dashboard</h2>
          <p>View check-in progress and delegate statistics</p>
          <span className="card-arrow">→</span>
        </Link>
      </div>
    </div>
  );
}
