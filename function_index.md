# Function index

## `hooks/useHabitTracker.ts`

| Symbol | Role |
|--------|------|
| `useHabitTracker` | Client hook: Supabase habits/completions, coins, loading/error state. |
| `fetchHabits` (internal) | Loads `habits` and month-scoped `completions`; try/catch/finally so UI loading state always clears. |

## `lib/supabase.ts`

| Symbol | Role |
|--------|------|
| `getSupabaseCredentials` | Reads `NEXT_PUBLIC_SUPABASE_URL` and key (`NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` or `NEXT_PUBLIC_SUPABASE_ANON_KEY`). |
| `createClient` | Browser Supabase client (`createBrowserClient`) using those env vars. |
