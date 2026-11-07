# MOBI — Evergreen Future Campus
> **One Campus. One Community. A Better Tomorrow.**  
> *Made by Students. For Students.*  
> Authoritative Campus: **MEA Engineering College, Perinthalmanna (Kerala, India)**

---

## 🌿 Product Overview

**MOBI** is a full-stack, student-powered digital campus ecosystem combining interactive 3D navigation, verified waste stewardship, student event discounts, and safe peer communication into one unified platform.

---

## 🏛️ Six Core Integrated Modules

1. **MOBI MAP**
   - Interactive 3D campus navigation built with **Three.js**, **React Three Fiber**, and **Drei**.
   - Complete 2D vector fallback for low-power mobile devices.
   - Authoritative MEA Engineering College geography traced from official campus boundary surveys (Highway SH39, Perumbilavu-Nilambur Road, Main Block, Auditorium, Civil Dept, Men's Hostel, Mechanical FabLab).
   - Dijkstra shortest path solver providing turn-by-turn waypoints, walking distance in meters, and estimated walk duration.
   - 19 campus waste bins, restrooms, purified water stations, seating benches, and solar streetlights with clear `CONFIRMED` vs `PROPOSED — TO BE VERIFIED` badges.

2. **MOBI ECO**
   - Interactive Waste Segregation Simulator with instant feedback and college waste guidelines.
   - Live Directory of 19 campus bins categorized as General (Blue), Dry (Yellow), Wet (Green), Plastic (Orange), and E-waste (Red).
   - Student reporting system for overflowing or damaged facilities with photo attachment and Bin ID verification.
   - Automatic atomic crediting of **15 Mobi Coins** upon administrative review.

3. **MOBI EVENTS**
   - Engineering symposiums, hackathons, and tree plantation drives with seat tracking and ticketing.
   - **Mobi Coin Discount System**: 1 Mobi Coin = ₹1 discount (e.g. ₹60 ticket fee − 20 coins = ₹40 final payable).
   - Non-withdrawable and non-transferable atomic transactions.

4. **MOBI CONNECT**
   - Respectful random student matching across engineering departments with Guest Mode support.
   - **Civic Courtesy Gatekeeper**: 5-question civic sense quiz; 5/5 score awards 3 Chat Points.
   - 1 Chat Point unlocks 1 peer chat session.
   - Ephemeral messaging with real-time delivery and one-touch report/block safety controls.

5. **MOBI WALLET**
   - Strict currency segregation between **Mobi Coins** (eco rewards) and **Chat Points** (civic quiz tokens).
   - Immutable transaction ledger logging all earnings and redemptions.

6. **CAMPUS CONNECT & ADMIN GOVERNANCE**
   - Official circulars, bus schedules, and cleanliness campaigns.
   - Administrative review console for approving/rejecting student reports, broadcasting notices, and auditing coin distributions.

---

## 🛠️ Technology Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS & Nature-inspired design system (`#06251D`, `#0B3829`, `#20C878`, `#55D98A`, `#F7F8F6`)
- **3D Graphics**: Three.js, @react-three/fiber, @react-three/drei
- **Database**: Supabase PostgreSQL with Row Level Security (RLS) policies and migrations
- **Icons**: Lucide React
- **Testing**: Vitest unit testing suite

---

## 🚀 Getting Started

```bash
# Install dependencies
npm install

# Run TypeScript type check
npx tsc --noEmit

# Run unit tests
npm test

# Launch local development server
npm run dev
# Open http://localhost:3000
```
