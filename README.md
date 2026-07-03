# Wishly — Birthday Wish Creator

A React website for making personal, animated birthday wishes. Its tiny Node server stores each finished wish behind a private eight-character ID, so the complete page (including uploaded photos and music) can be opened from a short link.

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

The copied link uses the current website address. On Vercel, wishes are saved to Vercel Blob so anyone with the public link can open the complete page. A `localhost` link remains available only on your own computer.

## Production build

```bash
npm run build
```

Vite writes the deployable site to the `dist` folder.

Run the production server with:

```bash
npm start
```

Local development stores wishes in `.wish-data`. The Vercel deployment requires a connected **public Vercel Blob store**, which automatically supplies `BLOB_READ_WRITE_TOKEN` to the API functions.

## Component guide

- `App.jsx` — controls the current page and wish data
- `Home.jsx` — landing page
- `BirthdayForm.jsx` — name, relationship, image, message, color, and music form
- `BirthdayWish.jsx` — generated celebration page and typewriter effect
- `ConfettiAnimation.jsx` — CSS confetti pieces
- `SurprisePopup.jsx` — funny birthday surprise modal

Photos and custom music stay in the browser until the creator presses **Copy link** or **Share wish**. At that point, the completed wish is saved on the same Wishly server so the recipient can open it.
