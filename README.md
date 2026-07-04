# Wishly — Birthday Wish Creator

A React and Vite website for making personal, animated birthday wishes. Vercel Blob stores each finished wish behind a private eight-character ID, so the complete page can be opened from a short public link.

## Run the project

1. Open a terminal in this folder.
2. Install the packages:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```
4. Open the local URL shown in the terminal (usually `http://localhost:5173`).

Copying a link from either localhost or the deployed app saves the wish to Vercel Blob and returns a `birthday-wish-website-pi.vercel.app` URL, so anyone with the link can open the complete page.

## Production build

```bash
npm run build
```

Vite writes the deployable site to the `dist` folder.

Preview the production build locally with:

```bash
npm run preview
```

The deployment requires a connected **public Vercel Blob store**, which automatically supplies `BLOB_READ_WRITE_TOKEN` to the API functions. Set `VITE_PUBLIC_SITE_URL` only if the production domain changes.

## Component guide

- `App.jsx` — controls the current page and wish data
- `Home.jsx` — landing page
- `BirthdayForm.jsx` — recipient name, age, birthday date, sender, ordered photos, message, theme, and music form
- `BirthdayWish.jsx` — generated celebration page, featured first photo, remaining-photo gallery, music, and animated effects
- `ConfettiAnimation.jsx` — CSS confetti pieces
- `SurprisePopup.jsx` — funny birthday surprise modal

Photos and custom music stay in the browser until the creator presses **Copy link** or **Share wish**. The first selected photo is featured on the wish and later photos retain their order in the gallery. The completed wish is then saved to the connected Vercel Blob store so the recipient can open it.
