# 🎫 Event QR Check-In System

A fast, reliable web-based QR code check-in system built for event delegate management. Designed for ~350 delegates using **Next.js 16** (App Router), **TypeScript**, and **Upstash Redis**.

🔗 **Live:** [natcon-delegate-reg-6ue5.vercel.app](https://natcon-delegate-reg-6ue5.vercel.app)

---

## ✨ Features

| Feature | Description |
|---------|-------------|
| **CSV Upload** | Upload delegate data via CSV from Tally or any spreadsheet |
| **Auto ID Generation** | Unique delegate IDs (`DEL001`, `DEL002`, ...) assigned automatically |
| **QR Code Generation** | Generate & download QR codes for all delegates as a ZIP |
| **Email Distribution** | Send personalized emails with QR codes to each delegate |
| **Mobile QR Scanner** | Scan delegate QR codes using phone camera for instant check-in |
| **Live Dashboard** | Real-time check-in statistics with search & filter |
| **Duplicate Detection** | Warns if a delegate is already checked in |

---

## 📁 Project Structure

```
qr-checkin/
├── src/
│   ├── app/
│   │   ├── page.tsx              # Home page (landing)
│   │   ├── admin/page.tsx        # Admin panel (CSV upload, QR, emails)
│   │   ├── scanner/page.tsx      # QR scanner (mobile-friendly)
│   │   ├── dashboard/page.tsx    # Check-in dashboard with stats
│   │   ├── delegate/[id]/        # Individual delegate info page
│   │   ├── api/
│   │   │   ├── delegates/        # CRUD API for delegates
│   │   │   │   ├── route.ts      # GET all / POST new delegates
│   │   │   │   └── [id]/
│   │   │   │       ├── route.ts  # GET / PATCH (check-in) single delegate
│   │   │   │       └── qr/route.ts  # Generate QR code image
│   │   │   ├── stats/route.ts    # Check-in statistics
│   │   │   ├── email/route.ts    # Send QR code emails via Resend
│   │   │   └── qr/export/route.ts # Export all QR codes as ZIP
│   │   ├── globals.css           # All styles
│   │   └── layout.tsx            # Root layout
│   └── lib/
│       ├── delegates.ts          # Data layer (Upstash Redis)
│       └── types.ts              # TypeScript interfaces
├── data/
│   └── delegates.json            # Local dev fallback data
├── .env.local                    # Environment variables
└── package.json
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** 18+
- **Upstash Redis** account (free tier works fine)

### 1. Clone & Install

```bash
git clone https://github.com/Lasal0425/natcon_delegate_reg.git
cd natcon_delegate_reg
npm install
```

### 2. Configure Environment Variables

Create `.env.local` in the project root:

```env
# Upstash Redis (required for production)
STORAGE_REST_API_URL=your_upstash_rest_url
STORAGE_REST_API_TOKEN=your_upstash_rest_token

# Or use KV_ prefix:
# KV_REST_API_URL=your_upstash_rest_url
# KV_REST_API_TOKEN=your_upstash_rest_token

# Event domain for QR code URLs
EVENT_DOMAIN=https://natcon-delegate-reg-6ue5.vercel.app

# Resend API Key (optional, for sending emails)
# RESEND_API_KEY=re_your_api_key_here
```

### 3. Run Locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## 📖 How to Use

### Step 1: Upload Delegates

1. Go to **Admin Panel** (`/admin`)
2. Upload a CSV file with delegate data
3. Click **"Save & Generate IDs"**

**Required CSV columns:**

| Column | Aliases Accepted |
|--------|-----------------|
| Name | `name`, `Full Name`, `full_name` |
| Email | `email`, `Email`, `email_address` |
| Age | `age`, `Age` |
| Entity | `entity`, `Entity`, `Entity (AIESEC Local Committee)`, `AIESEC Local Committee` |
| Food Preference | `foodPreference`, `Food Preference`, `food_preference` |
| Delegate Pack | `delegatePack`, `Delegate Pack`, `delegate_pack` (values: yes/true/1) |

### Step 2: Generate & Distribute QR Codes

From the Admin Panel:
- **Download QR Codes** → Downloads a ZIP file with individual QR code PNGs
- **Send Emails** → Sends personalized emails with embedded QR codes (requires Resend API key)

### Step 3: Check-In at the Event

1. Open **QR Scanner** (`/scanner`) on your phone
2. Allow camera access
3. Point at a delegate's QR code
4. The system shows:
   - ✅ **Green** → Successfully checked in
   - ⚠️ **Yellow** → Already checked in (shows previous check-in time)
   - ❌ **Red** → Error (invalid QR or delegate not found)

### Step 4: Monitor Progress

Open **Dashboard** (`/dashboard`) to see:
- Total / Checked-in / Remaining counts
- Progress bar
- Searchable delegate table with filter options
- Auto-refreshes every 10 seconds

---

## 🌐 Deployment (Vercel)

### 1. Push to GitHub

```bash
git add -A
git commit -m "Initial commit"
git push
```

### 2. Deploy on Vercel

1. Import your GitHub repo on [vercel.com](https://vercel.com)
2. Vercel auto-detects Next.js — deploy with defaults

### 3. Connect Upstash Redis

1. In Vercel Dashboard → **Storage** tab → **Create Database**
2. Select **Upstash KV (Redis)** → Create (free tier)
3. Connect it to your project
4. Redeploy if needed

### 4. Set Environment Variables

In Vercel → **Settings** → **Environment Variables**, add:

| Variable | Description |
|----------|-------------|
| `EVENT_DOMAIN` | Your deployed URL (e.g., `https://your-app.vercel.app`) |
| `RESEND_API_KEY` | *(Optional)* For sending emails via Resend |

> **Note:** The `STORAGE_REST_API_URL` and `STORAGE_REST_API_TOKEN` are added automatically when you connect Upstash.

---

## 🔌 API Reference

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/delegates` | Get all delegates |
| `POST` | `/api/delegates` | Import delegates from CSV data |
| `GET` | `/api/delegates/:id` | Get single delegate |
| `PATCH` | `/api/delegates/:id` | Check in a delegate |
| `GET` | `/api/delegates/:id/qr` | Get QR code image (PNG) |
| `GET` | `/api/stats` | Get check-in statistics |
| `GET` | `/api/qr/export` | Download all QR codes as ZIP |
| `POST` | `/api/email` | Send QR code emails to all delegates |

---

## 🛠 Tech Stack

- **Framework:** Next.js 16 (App Router)
- **Language:** TypeScript
- **Database:** Upstash Redis (via `@upstash/redis`)
- **QR Generation:** `qrcode`
- **QR Scanning:** `html5-qrcode`
- **CSV Parsing:** `papaparse`
- **ZIP Export:** `jszip`
- **Email:** `resend`
- **Hosting:** Vercel

---

## 🗑 Managing Data

| Action | How |
|--------|-----|
| **Add delegates** | Upload CSV via Admin Panel (`/admin`) |
| **Replace all delegates** | Re-upload a new CSV (overwrites existing data) |
| **Clear all data** | Go to [Upstash Console](https://console.upstash.com) → Data Browser → delete the `delegates` key |
| **Reset check-ins** | Re-upload the same CSV (resets all check-in states) |

---

## 📄 License

This project is private and built for AIESEC National Conference delegate management.
