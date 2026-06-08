# Deploy ResponseNet Online - First Steps

This first deployment is a static online demo. It is good for showing the interface, but it is not secure for real emergency operations yet.

## Step 1 - Create a GitHub repository

1. Go to GitHub and create a new repository named `responsenet` or `weather-exe-responsenet`.
2. Keep it public for a portfolio demo, or private if you prefer.
3. Upload these files:
   - `index.html`
   - `styles.css`
   - `app.js`
   - `README.md`
   - `vercel.json`
   - `.gitignore`

## Step 2 - Deploy with Vercel

1. Go to Vercel.
2. Choose **Add New Project**.
3. Import your GitHub repository.
4. Framework preset: **Other**.
5. Build command: leave blank.
6. Output directory: leave blank.
7. Click **Deploy**.

Your site will be live at a Vercel URL.

## Step 3 - Test the demo

Open the live URL and log in with:

- Access code: `EOC2026`

Try roles like:

- State EOC Director
- Emergency Operations
- LEO
- Fire
- Medic
- State Patrol
- Local Agency

## Step 4 - Next upgrade

After the static demo is online, the next step is adding a backend:

- Supabase Auth for real accounts
- Supabase Realtime for live channels
- PostgreSQL for message storage
- Role-based access control for agency permissions
- Audit logs for admin review

## Safety note

Do not use this version for real emergency dispatch, law enforcement information, medical information, or official agency operations. It is a prototype only.
