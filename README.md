# FestIES

🌍 **Live Site:** [countdownnewyears.netlify.app](https://countdownnewyears.netlify.app)

FestIES is a successor to CNyIES - and a program which plays music, shows the new year
countdown and, overall, makes the atmosphere a tiny bit more festive.

## Local Development

Just clone, run `npm install` and `npm run dev`.

## GitHub Pages Deployment

**Note:** The app currently uses server-side features (cookies, server routes, SSE). For GitHub Pages deployment, you'll need to:

1. **Switch to static adapter:**
   ```bash
   npm install -D @sveltejs/adapter-static
   ```

2. **Update `svelte.config.js`** to use `adapter-static` instead of `adapter-cloudflare`

3. **Convert server-side cookies to localStorage** - Settings will need to be stored client-side

4. **Remove or stub server routes** (`/analytics`, `/count`, `/goodbye`) - These won't work on static hosting

5. **Enable GitHub Pages** in your repository settings:
   - Go to Settings → Pages
   - Source: GitHub Actions

The GitHub Actions workflow (`.github/workflows/deploy.yml`) is already set up. Once you make the adapter changes, it will automatically deploy on push to main/master.

**Current Limitations on GitHub Pages:**
- User count tracking won't work (requires server)
- Analytics won't work (requires server)
- Settings are stored in cookies (will need localStorage conversion)

The countdown and all visual features will work perfectly!

## Committing

Feel free to open a PR.

## Feedback

Write to martin.bykov.s@gyarab.cz or send a message on https://martinbykov.eu
