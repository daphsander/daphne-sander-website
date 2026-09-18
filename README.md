# Daphne Sander — Website

Static site built with Eleventy (11ty). No database, no server — plain files that
get built into HTML and served for free via Cloudflare Pages.

## What's in here
- `de/` — German pages (site root, e.g. `/`, `/zeitecht/`, `/arbeiten/`, `/sparks/`, `/ueber-mich/`, `/kontakt/`, `/impressum/`, `/datenschutz/`)
- `en/` — reserved for the English versions (not yet built out — add when ready)
- `_includes/base.njk` — the shared header/footer/page shell used by every page
- `_data/nav.json` — the navigation menu. Edit this to add, rename, reorder, or hide (`published: false`) nav items — every page updates automatically.
- `_data/sparks.json` — the SPARKS prompts. One line per prompt.
- `css/style.css` — all styling for every page and breakpoint
- `js/main.js` — accordion, filter, carousel, lightbox, and SPARKS logic
- `admin/` — Decap CMS (the simple content editor) — see setup step 4 below

## What's still a placeholder
Anything in square brackets like `[Platzhalter — ...]` needs your real content:
your address for the Impressum, the Datenschutz text, your bio, the Formspree
form endpoint, real photos in place of the gray placeholder boxes, real Arbeiten
entries (the two currently in there are clearly-marked examples), and the
Inszenierungsschlüssel key-sketch image once you have it.

The ZEITECHT section already has real content for **Eurasia** and a lighter
placeholder for **Der Schimmelreiter**, based on what's been discussed — check
it over and adjust anything that doesn't match your intent.

## Setup steps

### 1. Push this to GitHub
On the empty repository page you created, use **"uploading an existing file"**
(the link on that page) and drag this entire folder in — GitHub's web uploader
preserves the folder structure. Commit directly to `main`.

### 2. Connect Cloudflare Pages
1. Sign up at cloudflare.com (free) → **Workers & Pages** → **Create** → **Pages** → **Connect to Git**
2. Select this repository
3. Build settings: **Build command** `npm run build`, **Build output directory** `_site`
4. Deploy — you'll get a `*.pages.dev` URL immediately; the custom domain (from netcup) gets attached afterward in the same project's settings

### 3. Formspree (Kontakt form)
1. Sign up at formspree.io (free), create a form, copy the endpoint URL
2. Replace `https://formspree.io/f/PLATZHALTER` in `de/kontakt.njk` with it

### 4. Sveltia CMS (the editor at yoursite.com/admin)
This site uses Sveltia CMS — a modern, actively-maintained, drop-in-compatible
successor to Decap CMS. Since you're the only person who'll ever log in, no
OAuth relay or Cloudflare Worker is needed at all — just a personal access token.

1. Update `admin/config.yml`'s `repo:` line with your actual `github-username/repo-name`
2. On GitHub: **Settings → Developer settings → Personal access tokens → Fine-grained tokens → Generate new token**
3. Under **Repository access**, select **Only select repositories** → choose this one repo
4. Under **Permissions → Repository permissions**, set **Contents** to **Read and write**
5. Generate, and copy the token immediately (GitHub only shows it once)
6. Visit `yoursite.com/admin`, choose the personal-access-token sign-in option, paste it in

That's the whole setup — no Worker, no OAuth App, no extra account.

### 5. Domain
Point the domain from netcup at Cloudflare Pages by adding the DNS records
Cloudflare's dashboard shows you once the domain is added there (Cloudflare
Pages → your project → Custom domains).

## A known simplification, worth knowing about
The Sveltia CMS config currently edits a few key files directly (SPARKS prompts,
the two legal pages, Arbeiten entries). Editing the ZEITECHT and landing page
prose through the CMS interface isn't fully wired yet — for now, those are
easiest to edit by asking me to make the change, or by editing the `.njk` files
directly on GitHub (click the file, click the pencil icon, edit, commit). Expanding
CMS coverage to every editable block is a reasonable next follow-up once the
site is live and you've seen how the current setup feels day to day.
