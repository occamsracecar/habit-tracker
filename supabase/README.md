# Supabase setup

Run `migrations/20260510150800_create_habit_tracker_tables.sql` in the Supabase SQL editor for the project connected to the app.

The migration creates:

- `public.habits`
- `public.completions`
- Prototype RLS policies that allow anonymous read/write access

For deployment, copy the same Supabase project's API values into Vercel:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`

This prototype does not have authentication yet, so the RLS policies are intentionally public. Replace them with user-scoped policies before storing real user data.
