# NatureLens

A real-time nature photography gallery and community platform built with **React 18**, **TypeScript**, **Vite**, **Tailwind CSS**, **Zustand**, and **Supabase**.

## Features

- **Real-Time Database & Presence (Supabase)**:
  - Live synchronization of photographs, comments, likes, saves, follows, and challenge entries via `postgres_changes`.
  - Real-time active visitor count powered by **Supabase Realtime Presence**.
  - Photo uploads stored in **Supabase Storage** (`naturelens-photos` bucket).
- **Authentication**:
  - **Email & Password** sign-in/sign-up and password reset.
  - **Continue with Google** OAuth integration with automatic profile syncing.
- **Interactive Showcases**:
  - Multi-layer 3D **Wilderness Parallax Hero** with live photo slides.
  - **Photo of the Day** with interactive **Macro Lens** zoom.
  - **3D Animal Gallery** (`CircularGallery`) and **Light Across the Seasons** WebGL dissolve (`MorphGallery`).
  - **RAW vs Master** image comparison slider and fullscreen Lightbox.
  - Global `⌘K` / `Ctrl+K` Command Palette search.
- **Responsive Dual Theme**:
  - Light Gallery & Dark Studio theme toggle, fully responsive across mobile, tablet, and desktop.

## Tech Stack

- **Frontend**: React 18, TypeScript, Vite, Tailwind CSS, Motion, OGL, Lucide Icons
- **State & Data**: Zustand, TanStack React Query, React Router v7
- **Backend / Realtime**: Supabase (Auth, Postgres, Storage, Realtime)
- **Testing**: Vitest, Testing Library

## Getting Started

1. **Clone the repository**:
   ```bash
   git clone https://github.com/rahulkrvermaa/NatureLend.git
   cd NatureLend
   npm install
   ```

2. **Configure environment variables**:
   Copy `.env.example` to `.env` and add your Supabase credentials:
   ```env
   VITE_SUPABASE_URL=https://your-project.supabase.co
   VITE_SUPABASE_ANON_KEY=your-publishable-or-anon-key
   ```

3. **Set up Supabase**:
   - Run [supabase/schema.sql](supabase/schema.sql) in your **Supabase Dashboard → SQL Editor** to create tables, RLS policies, storage bucket, and Realtime publications.
   - Optionally enable **Google** under **Authentication → Providers** and set your redirect URLs.

4. **Run locally**:
   ```bash
   npm run dev
   ```

## Scripts

```bash
npm run dev        # Start development server
npm run typecheck  # Run TypeScript type checking
npm run lint       # Run ESLint
npm run test       # Run Vitest unit tests
npm run build      # Typecheck and build for production
```

## Author

**Rahul Verma** — [Portfolio](https://my-portfolio01432.vercel.app/)
