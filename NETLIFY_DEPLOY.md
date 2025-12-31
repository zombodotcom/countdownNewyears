# Deploying to Netlify Pages

This project is configured to deploy to Netlify Pages using SvelteKit.

## Quick Deploy

### Option 1: Deploy via Netlify UI

1. Push your code to GitHub/GitLab/Bitbucket
2. Go to [Netlify](https://app.netlify.com)
3. Click "Add new site" → "Import an existing project"
4. Connect your repository
5. Netlify will auto-detect the settings:
   - **Build command:** `npm run build`
   - **Publish directory:** `.svelte-kit/netlify`
6. Click "Deploy site"

### Option 2: Deploy via Netlify CLI

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Login to Netlify
netlify login

# Deploy
netlify deploy --prod
```

## Build Settings

- **Build command:** `npm run build`
- **Publish directory:** `.svelte-kit/netlify`
- **Node version:** 20 (set in `netlify.toml`)

## Environment Variables

If you need any environment variables, add them in:
- Netlify Dashboard → Site settings → Environment variables

## Notes

- The project uses `@sveltejs/adapter-netlify` which automatically handles:
  - Serverless functions for server-side routes
  - Redirects and rewrites
  - Static asset optimization

- Server-side routes (like `+page.server.ts`) will be deployed as Netlify Functions

