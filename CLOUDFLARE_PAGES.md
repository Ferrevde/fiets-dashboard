# Fiets Dashboard - Cloudflare Pages Configuration

## Build Settings
- **Build command**: `npm run build`
- **Build output directory**: `dist`
- **Root directory**: `fiets-dashboard`

## Environment Variables
No environment variables required for this phase.

## Framework Preset
- **Framework**: Vite (React)

## Node.js Version
- **Node.js**: 20.x (or latest LTS)

## Deployment Notes
This is a static SPA (Single Page Application) that can be deployed to Cloudflare Pages.
The application uses client-side routing via React Router, so make sure to configure
a `_redirects` file or Cloudflare Pages SPA fallback for proper routing.