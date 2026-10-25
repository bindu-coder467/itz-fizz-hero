# Put it online (free) — pick one

Assignment asks for a hosted link. GitHub Pages is the preferred option.

## Option A — GitHub Pages (≈ 5 minutes)
1. Create a new **public** repo on GitHub, e.g. `itz-fizz-hero`.
2. In this folder, run:
   ```bash
   git init
   git add .
   git commit -m "Scroll-driven hero"
   git branch -M main
   git remote add origin https://github.com/<your-username>/itz-fizz-hero.git
   git push -u origin main
   ```
3. On GitHub: **Settings → Pages → Build and deployment → Source: GitHub Actions**.
4. Open the **Actions** tab. When "Deploy to GitHub Pages" turns green (about 1–2 min) your site is live at
   `https://<your-username>.github.io/itz-fizz-hero/`

The workflow sets the base path from the repo name automatically, so any repo name works.
(Tested: a clean `npm ci` + build with a sub-path loads the car, font and scripts with no 404s.)

## Option B — No Git, no Node: drag and drop
`static-build/` is the finished website. Drag that folder onto **https://app.netlify.com/drop** (free) and you get a live link in seconds.
This build is for a site served from the **root** of a domain (Netlify, Vercel, Cloudflare Pages), not for a GitHub Pages `/repo-name/` path; use Option A for that.

## Option C — your own WordPress
Upload `wordpress-theme/itz-fizz-hero-wordpress-theme-installable.zip` via **Appearance → Themes → Add New → Upload Theme**, then Activate.
