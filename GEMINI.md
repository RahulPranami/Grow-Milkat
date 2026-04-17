# Grow Milkat - Investment Platform

## Project Overview
Grow Milkat is a sophisticated fractional investment platform prototype designed to democratize access to high-yield institutional-grade assets such as luxury real estate, startups, and commercial property. The platform features a comprehensive dashboard for investors and a robust administrative panel for managing assets, KYC verification, and financial transactions.

### Core Technologies
- **Frontend**: React 19 (using `App.tsx` as the main entry), Vite for build tooling.
- **Styling**: Tailwind CSS (integrated via `@tailwindcss/vite`).
- **Backend/Development Server**: Express.js (handled in `server.ts`), using `tsx` for execution.
- **State Management**: React Hooks (useState, useEffect) for global and component-level state.
- **Database/Auth**: **Supabase (PostgreSQL)**.
- **Animations**: Framer Motion for smooth UI transitions and modal effects.
- **Data Visualization**: Recharts for investment tracking and portfolio analysis.
- **Utilities**: 
  - `Nodemailer`: For support email functionality.
  - `html2canvas` & `jspdf`: For generating investment and withdrawal certificates.
  - `Lucide React`: For consistent iconography.

## Architecture
- **Root Entry**: `server.ts` acts as the entry point for development, serving the Vite application and handling API requests (e.g., `/api/support`).
- **Routing**: Handled internally in `App.tsx` using a custom `View` state management system rather than a dedicated router library.
- **Business Logic**: Core domain logic, specifically for asset withdrawals, is isolated in `src/lib/withdrawalLogic.ts`.
- **Components**: UI components are modularized within the `components/` directory, categorized by their primary function (e.g., `UserDashboard`, `AdminPanel`, `LandingPage`).
- **Internationalization**: Supported via `translations.ts` and managed through global state in `App.tsx`.

## Building and Running

### Prerequisites
- Node.js (Latest LTS recommended)
- Supabase Project (URL and Anon Key)
- Gemini API Key (for specific AI features)

### Key Commands
- **Install Dependencies**: `npm install`
- **Start Development Server**: `npm run dev` (runs `tsx server.ts` which proxies to Vite)
- **Build for Production**: `npm run build`
- **Lint/Type Check**: `npm run lint` (executes `tsc --noEmit`)
- **Preview Production Build**: `npm run preview`

## Database Setup (Supabase)
To set up your database, use the provided `supabase-setup.sql` file in the Supabase SQL Editor. This will create the necessary tables (`assets`, `users`, `investments`, `withdrawals`, `returns`) and enable basic Row Level Security (RLS) policies.

## Development Conventions

### Coding Style
- **TypeScript**: Mandatory type definitions for all entities (defined in `types.ts`).
- **Functional Components**: Use functional components with hooks for state and side effects.
- **Styling**: Use utility-first CSS via Tailwind. Custom styles should be kept to a minimum in `index.css`.
- **Database Services**: All database interactions should go through `services/databaseService.ts`.
- **Authentication**: All authentication logic should go through `services/authService.ts`.

### Withdrawal Logic (Crucial)
The platform follows specific business rules for asset withdrawals:
1. **Approval Rule**: If a withdrawal for a particular asset is approved, no further withdrawal requests are allowed for that specific asset.
2. **Rejection Rule**: If a withdrawal request is rejected by an administrator, the investor is permitted to re-submit the request.
3. **Pending Rule**: Only one pending withdrawal request is allowed per asset at any given time.
4. **Validation**: Use helper functions in `src/lib/withdrawalLogic.ts` (`canWithdrawFromInvestment`, `canWithdrawReturn`) to enforce these rules across the UI.

### KYC Workflow
- Investors must go through a verification process.
- Admins can approve, reject, or request additional documents.
- KYC status (`Verified`, `Pending`, `Rejected`) strictly controls investment capabilities.

### Support System
- Support requests are handled via the `/api/support` endpoint in `server.ts`.
- Requires `SMTP_USER` and `SMTP_PASS` in the environment for actual email delivery; falls back to console logging in demo mode.
