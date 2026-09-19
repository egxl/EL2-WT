# Elemen 2 — Mobile-First Cohort Weight & Health Tracker

A dedicated, mobile-first weight and biometric tracking web app and PWA built specifically for the close-knit group **"Elemen 2"**. Designed to be deployed for **100% free on Vercel** and hosted on **GitHub**.

![Elemen 2 App](https://img.shields.io/badge/Cohort-Elemen%202-amber.svg)
![Next.js 14](https://img.shields.io/badge/Next.js-14%20(App%20Router)-black)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS-06B6D4)
![TypeScript](https://img.shields.io/badge/TypeScript-5.6-blue)
![PWA Ready](https://img.shields.io/badge/PWA-Installable-emerald)
![Free Deployment](https://img.shields.io/badge/Vercel-Free%20Tier-success)

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fegxl%2FEL2-WT)


---

## Key Features

### 1. Dedicated to "Elemen 2" (Open & Transparent)
- Built specifically for the close group **Elemen 2**.
- No awkward privacy barriers—starting weights, target goals, current scale numbers, and % dropped are openly displayed and celebrated together.
- Group collective metrics: **Collective kg shed together** and **Group average BMI drop** (e.g. 27.2 $\rightarrow$ 25.4).

### 2. Mandatory Heights & Deep Biometric Insights
- **Height Registration**: Every member must have their height recorded in centimeters.
- **Continuous BMI Scale Gauge**: Real-time WHO classification (Underweight, Normal, Overweight, Obese classes).
- **Personalized Healthy Weight Range**: Mathematically computes the exact target weight bracket (BMI 18.5 – 24.9) customized to each member's height.
- **Velocity & Projections**: 7-day smoothed moving average to eliminate water-weight fluctuations, weekly rate of change (kg/wk), and projected weeks to goal.

### 3. Global Cohort Password Gate + Maintainer PIN Protection
- **Global Cohort Password Gate**: To prevent outsiders from accessing our data, all visitors must enter the cohort password upon first visiting.
  - **Default Cohort Password**: `elemen2` (configurable via `NEXT_PUBLIC_COHORT_PASSWORD` or in Settings).
  - **Instant Multi-Device Session Invalidation**: When an admin changes the password, all existing sessions across all cohort members are immediately invalidated, locking the site until the new password is provided.
- **Maintainer PIN Gate**: Logging weigh-ins, modifying members, or changing passwords requires the **Maintainer PIN** (Default PIN: `1234`).
- Frictionless viewing for cohort members once unlocked on their personal devices.

### 4. Mobile-First PWA & Double-Bezel Design
- **High-End Hardware Aesthetic**: Concentric double-bezel card structure, OLED midnight background, and precision `@phosphor-icons/react` iconography.
- **Tabular Numerals**: Numbers never jitter or trigger layout shifts during weight adjustments.
- **Floating Island Navigation**: Ergonomic bottom tab bar with iOS safe-area support (`safe-bottom`) and a spring "+ Log" action.
- **Installable**: "Add to Home Screen" on iOS Safari and Android Chrome for a native app feel.

### 5. Supabase Cloud Persistence & Multi-Device Realtime Sync
- **Centralized PostgreSQL Cloud**: Powered by free-tier [Supabase](https://supabase.com).
- **Real-Time WebSockets**: Any weigh-in logged by any member immediately reflects across all active phones without page refreshing.
- **Offline-First Hybrid Cache**: Works seamlessly offline; instantly loads from local cache and hydrates from the cloud in the background.
- **1-Click JSON Backup & Restore**: Upload your `.json` backup file (like `data/cohort-backup-with-heights.json`) to populate both local storage and Supabase cloud in one go.
- **Ready-to-Run Schema**: Included `supabase/schema.sql` sets up tables, indexes, RLS policies, and realtime publication in 1 click.

---

## Tech Stack

- **Framework**: [Next.js 14](https://nextjs.org/) (App Router, React 18)
- **Database & Realtime**: [Supabase](https://supabase.com/) (PostgreSQL + WebSockets)
- **Client Library**: `@supabase/supabase-js`
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Icons**: [@phosphor-icons/react](https://phosphoricons.com/)
- **Celebration Effects**: [canvas-confetti](https://www.npmjs.com/package/canvas-confetti)
- **Charts**: Custom lightweight, touch-responsive SVG engine with 7-day moving average trendlines

---

## Free Deployment on Vercel & Supabase (Step-by-Step)

### Step 1: Create Free Supabase Database
1. Go to [supabase.com](https://supabase.com/) and create a new free project (e.g. `elemen2-tracker`).
2. In your Supabase project dashboard, open the **SQL Editor** (left sidebar).
3. Open `supabase/schema.sql` from this repository, paste the entire contents into the SQL Editor, and click **Run**.
4. Go to **Project Settings** (gear icon) $\rightarrow$ **API**:
   - Copy your **Project URL**
   - Copy your **anon / public key**

### Step 2: Deploy on Vercel (Free)

1. **Push to your GitHub repository**:
   ```bash
   git add .
   git commit -m "feat: integrate Supabase cloud database and realtime sync"
   git branch -M main
   # Add your remote repository:
   git remote add origin https://github.com/YOUR_USERNAME/elemen2-tracker.git
   git push -u origin main
   ```

2. **Deploy on Vercel**:
   - Go to [vercel.com](https://vercel.com/) and log in with GitHub.
   - Click **"Add New..."** $\rightarrow$ **"Project"** and select `elemen2-tracker`.
   - In **Environment Variables**, add:
     - `NEXT_PUBLIC_SUPABASE_URL`: Your Supabase project URL (from Step 1)
     - `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Your Supabase anon public key (from Step 1)
     - `NEXT_PUBLIC_COHORT_PASSWORD`: Secret global password (defaults to `elemen2` if omitted)
     - `NEXT_PUBLIC_MAINTAINER_PASSWORD`: Maintainer PIN for writes (defaults to `1234` if omitted)
   - Click **"Deploy"**.
   - Your app is now live with real-time multi-device cloud sync!

---

## Local Development

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Run the local development server**:
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your mobile browser or desktop browser with mobile inspect mode.

3. **Build for production**:
   ```bash
   npm run build
   ```

---

## How to Install on Mobile (PWA)

- **iPhone (Safari)**:
  1. Open the deployed Vercel link in Safari.
  2. Tap the **Share** button (box with an upward arrow) at the bottom.
  3. Scroll down and tap **"Add to Home Screen"**.
  4. Tap **"Add"**. The Elemen 2 app icon will appear on your iPhone home screen with native full-screen launch.

- **Android (Chrome)**:
  1. Open the Vercel link in Chrome.
  2. Tap the three dots (**⋮**) in the top-right corner.
  3. Tap **"Install App"** or **"Add to Home screen"**.

---

## Default Credentials
- **Default Global Cohort Password**: `elemen2` (Gating all visitor access to the site; can be updated under **Settings** $\rightarrow$ **Global Cohort Access Password** or via `NEXT_PUBLIC_COHORT_PASSWORD`).
- **Default Maintainer PIN**: `1234` (Unlocks write access for logging/editing; can be updated under **Settings** $\rightarrow$ **Change Maintainer PIN** or via `NEXT_PUBLIC_MAINTAINER_PASSWORD`).
