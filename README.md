# Grow Milkat - Fractional Investment SaaS Platform

Grow Milkat is a sophisticated fractional investment platform prototype designed to democratize access to high-yield institutional-grade assets such as luxury real estate, startups, and commercial property.

## 🚀 Tech Stack

*   **Frontend:** React 19, TypeScript, Vite
*   **Styling:** Tailwind CSS, Framer Motion
*   **Backend / Server:** Express.js (Node)
*   **Database & Auth:** Supabase (PostgreSQL)

---

## 🛠️ System Setup Instructions

### 1. Prerequisites
Ensure you have the following installed on your system:
*   [Node.js](https://nodejs.org/) (Latest LTS version recommended)
*   A [Supabase](https://supabase.com/) account for database and authentication
*   A [Gemini API](https://aistudio.google.com/) Key (optional, for AI features)

### 2. Database Setup (Supabase)
To make the application production-ready, all data (including investors, assets, testimonials, and blogs) must be persisted in Supabase.

1.  Log in to your Supabase dashboard and create a new project.
2.  Navigate to the **SQL Editor** in the left sidebar.
3.  Open the `supabase-setup.sql` file from the root of this repository.
4.  Copy the entire content of `supabase-setup.sql` and paste it into the Supabase SQL Editor.
5.  Click **Run** to execute the script. This will create all necessary tables (users, assets, investments, withdrawals, returns, testimonials, blogs, etc.) and configure Row Level Security (RLS) policies.

### 3. Environment Variables
1.  Duplicate the `.env.example` file (if available) or create a new `.env` file in the root directory.
2.  Add the required credentials:
```env
# Supabase Configuration
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

# Gemini AI (Optional)
GEMINI_API_KEY=your_gemini_api_key

# SMTP / Email Configuration (For Support & Notifications)
SMTP_USER=your_smtp_email
SMTP_PASS=your_smtp_password
```

### 4. Running Locally
1.  Install dependencies:
    ```bash
    npm install
    ```
2.  Start the development server:
    ```bash
    npm run dev
    ```
    *(The app runs via `tsx server.ts` which proxies to Vite)*
3.  Open `http://localhost:5173` in your browser.

---

## 📦 Production Deployment

### 1. Build the Application
```bash
npm run build
```

### 2. Preview the Production Build
```bash
npm run preview
```

### Deployment Providers
The application is configured to be easily deployed on standard cloud providers such as **Vercel**, **Netlify**, or **Render**. Ensure you configure all the environment variables from your `.env` file in your deployment provider's dashboard before deploying.

---

## 📝 Notes on Current Status
*   **Data Persistence:** Core models (Investors, Assets, Testimonials, Blogs) have been migrated to the database. Local storage mocking has been removed for these features.
*   **File Uploads:** Profile avatars and KYC documents are currently handled as URL strings. In a full production environment, these should be wired to Supabase Storage.
