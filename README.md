# Harbor Room

Classroom site for attendance, scores, monthly events, extracurricular activities, and class discussion. Teachers edit records. Students see their own records and the discussion. Parents see only their child’s performance and events.

The interface is English, Traditional Chinese, and Hindi. The language switch sits beside the sign-in icon.

## Run

Copy `.env.example` to `.env.local` and set the Supabase URL and publishable key. The hosted project is `classroom` in Tokyo, ref `pxdkwpxybwsdrmdjurme`. Then:

```bash
npm install
npm run dev
```

Sample sign-ins are listed on the login page. Schema lives in `supabase/migrations`, and `supabase/seed.sql` reloads the sample class.
