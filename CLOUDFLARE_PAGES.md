# Fiets Dashboard - Cloudflare Pages Configuration

## Project Settings in Cloudflare Dashboard

### Build Configuration
- **Project name**: fiets-dashboard (or your choice)
- **Production branch**: main (or your default branch)
- **Build command**: `cd fiets-dashboard && npm run build`
- **Build output directory**: `fiets-dashboard/dist`
- **Root directory**: (leave empty - this is the repository root)

### Environment Variables
No environment variables required.

### Node.js Version
- **Node.js version**: 20 (or latest LTS)

## Important Notes

1. **Root Directory**: Since your project is in a subdirectory (`fiets-dashboard/`), you MUST set:
   - Build command: `cd fiets-dashboard && npm run build`
   - Build output directory: `fiets-dashboard/dist`

2. **SPA Routing**: The `_redirects` file is already in `public/_redirects` and gets copied to `dist/_redirects` during build. This handles client-side routing.

3. **Asset Paths**: The `vite.config.ts` has `base: './'` which makes all asset paths relative, so they work regardless of deployment subdirectory.

## Alternative: Wrangler Configuration

If you prefer using Wrangler CLI, create a `wrangler.toml` in the repository root:

```toml
name = "fiets-dashboard"
pages_build_output_dir = "fiets-dashboard/dist"

[build]
command = "cd fiets-dashboard && npm run build"
```

## Troubleshooting White Page

If you still see a white page:

1. **Check browser console** for JavaScript errors
2. **Verify the build logs** in Cloudflare Pages dashboard show successful build
3. **Check Network tab** - ensure JS/CSS files load with 200 status
4. **Confirm `_redirects`** is deployed - visit `your-domain.com/_redirects` should show `/* /index.html 200`

## Common Fixes

- If assets 404: Ensure `base: './'` in vite.config.ts (already done)
- If routing breaks: Ensure `_redirects` file exists in dist folder (already done)
- If build fails: Check Node.js version is 18+ in Cloudflare settings