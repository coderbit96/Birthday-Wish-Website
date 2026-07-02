# Wishly — Birthday Wish Creator

A frontend-only React website for making personal, animated birthday wishes. It uses React state, plain JavaScript, and CSS animations—no backend or database.

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

## Production build

```bash
npm run build
```

Vite writes the deployable site to the `dist` folder.

## Component guide

- `App.jsx` — controls the current page and wish data
- `Home.jsx` — landing page
- `BirthdayForm.jsx` — name, relationship, image, message, color, and music form
- `BirthdayWish.jsx` — generated celebration page and typewriter effect
- `ConfettiAnimation.jsx` — CSS confetti pieces
- `BalloonAnimation.jsx` — floating CSS balloons
- `SurprisePopup.jsx` — funny birthday surprise modal

Photo uploads stay in browser memory and are never sent anywhere.
