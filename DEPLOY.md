# How to Deploy the NBA Lottery Simulator to Vercel
### Complete guide — no prior experience needed

---

## What you'll end up with

A live URL like `https://nba-lottery.vercel.app` that anyone can visit.
The app fetches fresh NBA standings automatically every time someone loads it.
Free. No credit card needed.

---

## Step 1 — Create a free GitHub account (if you don't have one)

GitHub is where your code lives. Vercel connects to it.

1. Go to **github.com**
2. Click **Sign up**
3. Enter your email, create a password, pick a username
4. Verify your email when prompted

---

## Step 2 — Create a new repository on GitHub

A "repository" (repo) is just a folder for your project on GitHub.

1. After signing in, click the **+** icon in the top-right corner
2. Click **New repository**
3. Name it: `nba-lottery` (or anything you like)
4. Leave it set to **Public**
5. Do NOT check "Add a README file"
6. Click **Create repository**

You'll land on an empty repo page. Keep this tab open.

---

## Step 3 — Upload your files to GitHub

You'll upload the files directly through the GitHub website — no command line needed.

1. On your empty repo page, click **uploading an existing file** (it's a link in the middle of the page)
2. On the upload page, you can drag and drop files **or** click "choose your files"
3. Upload these files/folders:

   ```
   index.html
   vercel.json
   package.json
   ```

4. For the `api/` folder: GitHub's web uploader doesn't support folders directly.
   - Click "choose your files" again
   - Navigate into the `api` folder on your computer and select both files:
     - `standings.js`
     - `h2h.js`
   - GitHub will ask for the folder path — type `api/` before each filename when prompted,
     OR use the GitHub Desktop method below if this gets confusing.

### Easier option: GitHub Desktop

If the folder upload is tricky, use GitHub Desktop (free app):

1. Download **GitHub Desktop** from desktop.github.com
2. Sign in with your GitHub account
3. Click **File → Clone Repository**
4. Find your `nba-lottery` repo and clone it to a folder on your computer
5. Copy ALL your project files into that folder, maintaining the structure:
   ```
   nba-lottery/
   ├── index.html
   ├── vercel.json
   ├── package.json
   └── api/
       ├── standings.js
       └── h2h.js
   ```
6. In GitHub Desktop, you'll see the files listed as changes
7. Type a message in the "Summary" box (e.g. `Initial upload`)
8. Click **Commit to main**
9. Click **Push origin** (button in the top bar)

Your files are now on GitHub. ✓

---

## Step 4 — Create a free Vercel account

1. Go to **vercel.com**
2. Click **Sign Up**
3. Choose **Continue with GitHub** — this links your accounts automatically
4. Authorize Vercel to access your GitHub when prompted

---

## Step 5 — Deploy your project

1. Once logged into Vercel, you'll see your dashboard
2. Click **Add New…** → **Project**
3. Under "Import Git Repository", you'll see your GitHub repos listed
4. Find **nba-lottery** and click **Import**
5. On the configuration page:
   - **Framework Preset**: Leave as "Other"
   - **Root Directory**: Leave as `./`
   - **Build & Output Settings**: Leave everything blank/default
6. Click **Deploy**

Vercel will show a build log. It takes about 30–60 seconds.

When it says **"Congratulations!"** — you're live! 🎉

---

## Step 6 — Visit your app

Vercel gives you a URL that looks like:
```
https://nba-lottery-abc123.vercel.app
```

Click **Visit** or copy the URL. You'll see the lottery simulator with live NBA standings.

You can also add a custom domain later in **Settings → Domains** if you have one.

---

## Sharing the app

Just share the Vercel URL with anyone. It works on phone and desktop.
No login needed to use it.

---

## How to update the app later

Whenever you want to make changes:

1. Edit the files on your computer
2. Open GitHub Desktop
3. It shows what changed — write a short commit message
4. Click **Commit to main**
5. Click **Push origin**

Vercel detects the change automatically and redeploys in ~30 seconds.

---

## Troubleshooting

| Problem | What to do |
|---|---|
| Red dot + "Standings unavailable" | Click the **Functions** tab in your Vercel project dashboard and check the logs for errors |
| App loads but shows no teams | The NBA API may be temporarily down — try refreshing in a few minutes |
| Vercel says "Build Failed" | Make sure all 5 files are uploaded correctly, especially that `api/standings.js` and `api/h2h.js` are inside an `api/` folder |
| "404" when you visit the URL | Make sure `index.html` is in the root folder, not inside a subfolder |
| Standings seem old | The app caches standings for 1 hour. Hard refresh (Ctrl+Shift+R or Cmd+Shift+R) to bust the cache |

---

## File structure reminder

Make sure your repo looks exactly like this:

```
nba-lottery/          ← your repo root
├── index.html        ← the app frontend
├── vercel.json       ← tells Vercel how to route requests
├── package.json      ← tells Vercel what Node version to use
└── api/              ← this folder name must be exactly "api"
    ├── standings.js  ← fetches live NBA standings
    └── h2h.js        ← fetches head-to-head records for tiebreakers
```

If `api/` is named anything else or the files are in the wrong place, the live standings won't work.

---

That's it. Total time: about 10 minutes.
