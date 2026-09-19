# Elemen 2 — Mobile-First Cohort Weight & Health Tracker

A dedicated, mobile-first weight and biometric tracking web app and PWA built specifically for the close-knit group **"Elemen 2"**. Designed to be deployed for **100% free on Vercel** and hosted on **GitHub**.

![Elemen 2 App](https://img.shields.io/badge/Cohort-Elemen%202-amber.svg)
![Next.js 14](https://img.shields.io/badge/Next.js-14%20(App%20Router)-black)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS-06B6D4)
![TypeScript](https://img.shields.io/badge/TypeScript-5.6-blue)
![PWA Ready](https://img.shields.io/badge/PWA-Installable-emerald)
![Free Deployment](https://img.shields.io/badge/Vercel-Free%20Tier-success)

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

### 3. Frictionless Viewing + Maintainer PIN Protection
- **No Member Login Required**: Any member of Elemen 2 can open the site on their phone to check the live dashboard, view graphs, and browse the leaderboard without creating an account or logging in.
- **Maintainer PIN Gate**: Entering or modifying data (logging weigh-ins, editing heights/targets, adding members, deleting logs) is protected by a **Maintainer PIN/Password** (Default PIN: `1234`).
- Once unlocked on the maintainer's device, the session persists seamlessly in local storage.

### 4. Mobile-First PWA & Double-Bezel Design
- **High-End Hardware Aesthetic**: Concentric double-bezel card structure, OLED midnight background, and precision `@phosphor-icons/react` iconography.
- **Tabular Numerals**: Numbers never jitter or trigger layout shifts during weight adjustments.
- **Floating Island Navigation**: Ergonomic bottom tab bar with iOS safe-area support (`safe-bottom`) and a spring "+ Log" action.
- **Installable**: "Add to Home Screen" on iOS Safari and Android Chrome for a native app feel.

### 5. Zero-Cost Offline-First Storage & Cloud Backup
- Works immediately in any browser with reactive LocalStorage and rich pre-seeded Elemen 2 history.
- **1-Click JSON Backup & Restore**: Export all members and logs into a timestamped `.json` file anytime.

---

## Tech Stack

- **Framework**: [Next.js 14](https://nextjs.org/) (App Router, React 18)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Icons**: [@phosphor-icons/react](https://phosphoricons.com/)
- **Celebration Effects**: [canvas-confetti](https://www.npmjs.com/package/canvas-confetti)
- **Charts**: Custom lightweight, touch-responsive SVG engine with 7-day moving average trendlines

---

## Free Deployment on Vercel (Step-by-Step)

### Option A: Via GitHub & Vercel Dashboard (Recommended)

1. **Push to your GitHub repository**:
   ```bash
   git add .
   git commit -m "feat: complete Elemen 2 cohort weight tracker"
   git branch -M main
   # Add your remote repository:
   git remote add origin https://github.com/YOUR_USERNAME/elemen2-tracker.git
   git push -u origin main
   ```

2. **Deploy on Vercel (Free)**:
   - Go to [vercel.com](https://vercel.com/) and log in with your GitHub account.
   - Click **"Add New..."** $\rightarrow$ **"Project"**.
   - Select your `elemen2-tracker` repository.
   - *(Optional)* In **Environment Variables**, add:
     - `NEXT_PUBLIC_MAINTAINER_PASSWORD`: Your custom secret PIN (e.g., `8899` or any passphrase). If not set, it defaults to `1234`.
   - Click **"Deploy"**.
   - Your app will be live on a free `*.vercel.app` domain in less than 1 minute!

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

## Default Maintainer Credentials
- **Default PIN**: `1234`
- You can change the PIN anytime under **Settings** $\rightarrow$ **Change Maintainer PIN**, or by defining `NEXT_PUBLIC_MAINTAINER_PASSWORD` in your Vercel Environment Variables.
