# Deploy Fiets Dashboard Worker - Step by Step

## Prerequisites
- Cloudflare account (free at dash.cloudflare.com)
- Your KV namespace ID: `e90e3e364a7f499fb05332a8792bd78c` (name: `fiets-data`)

---

## Step 1: Go to Cloudflare Dashboard
1. Open https://dash.cloudflare.com
2. Log in

---

## Step 2: Create the Worker
1. In left sidebar, click **Workers & Pages**
2. Click **Create application** → **Create Worker**
3. Name it: `fiets-dashboard-api` (or whatever you like)
4. Click **Deploy** (it will show a default worker)
5. Click **Edit code** (top right)

---

## Step 3: Paste the Worker Code
1. **Delete everything** in the editor
2. Copy the ENTIRE contents of `worker.js` (from your project folder)
3. Paste it into the editor
4. Click **Save and deploy** (top right)

---

## Step 4: Bind the KV Namespace
1. In the Worker editor, click **Settings** tab (top)
2. Scroll to **Bindings** → click **Add** → **KV namespace**
3. Variable name: `KV` (must be exactly `KV`)
4. KV namespace: select `fiets-data` (your existing namespace)
5. Click **Deploy** (button appears after adding binding)

---

## Step 5: Get Your Worker URL
1. After deploy, go to **Settings** → **Domains & Routes**
2. You'll see a URL like: `https://fiets-dashboard-api.your-subdomain.workers.dev`
3. **Copy this URL** — you'll need it for the next steps

---

## Step 6: Set Frontend Environment Variable (Important!)
1. Go to **Workers & Pages** → **Pages** → your project (or create it in Step 7)
2. Click **Settings** → **Environment variables**
3. Add variable:
   - Name: `VITE_API_BASE_URL`
   - Value: **your worker URL from Step 5** (e.g., `https://fiets-dashboard-api.your-subdomain.workers.dev`)
4. Click **Save**

---

## Step 7: Deploy Frontend to Cloudflare Pages
1. In Cloudflare dashboard, go to **Workers & Pages** → **Pages**
2. Click **Create a project** → **Connect to Git**
3. Select your GitHub/GitLab repo (push your code first if needed)
4. Build settings:
   - Build command: `npm run build`
   - Build output directory: `dist`
   - Root directory: `fiets-dashboard` (if repo has multiple folders)
5. Click **Save and Deploy**

---

## Step 8: Test It
1. Open your Pages URL (e.g., `https://fiets-dashboard.pages.dev`)
2. Create an account
3. Add some commute data
4. Open on another device → log in → data should be there!

---

## Local Development (Optional)

To test locally with your deployed worker:

1. Copy `.env.example` to `.env.local`:
   ```bash
   cp .env.example .env.local
   ```
2. Edit `.env.local` and add your worker URL:
   ```
   VITE_WORKER_URL=https://fiets-dashboard-api.your-subdomain.workers.dev
   VITE_API_BASE_URL=https://fiets-dashboard-api.your-subdomain.workers.dev
   ```
3. Run `npm run dev` — API calls will proxy to your worker

---

## If You Push Code to GitHub First

```bash
cd "D:/Code/Fiets Dashboard/fiets-dashboard"
git add .
git commit -m "Add multi-user worker and fix frontend"
git push
```

Then in Cloudflare Pages, it will auto-deploy on push.

---

## Troubleshooting

| Problem | Fix |
|---------|-----|
| "KV binding not found" | Step 4: Make sure variable name is exactly `KV` |
| CORS errors | Worker already includes CORS headers |
| Data not saving | Check browser DevTools → Network tab for failed requests |
| "Account already exists" | That's correct - means account creation works! |
| "Failed to fetch" in local dev | Check `.env.local` has correct `VITE_WORKER_URL` |

---

## What This Worker Does

| Request | Key Pattern | Action |
|---------|-------------|--------|
| `GET /api/data?key=fiets-user-alice` | `fiets-user-{name}` | Get account |
| `POST /api/data?key=fiets-user-alice` | `fiets-user-{name}` | Create account |
| `GET /api/data?key=fiets-settings-alice` | `fiets-settings-{name}` | Get settings |
| `POST /api/data?key=fiets-settings-alice` | `fiets-settings-{name}` | Save settings |
| `GET /api/data?key=fiets-commute-alice-2026-1` | `fiets-commute-{name}-{year}-{month}` | Get month data |
| `POST /api/data?key=fiets-commute-alice-2026-1` | `fiets-commute-{name}-{year}-{month}` | Save month data |

Each user gets their own keys — no more overwriting!