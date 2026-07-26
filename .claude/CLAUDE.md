# Project Overrides

## After completing changes

Always finish with: commit → push the current branch → deploy to Cloudflare.

Deploy process:
1. `npm run build`
2. `npx wrangler deploy --config dist/server/wrangler.json --name basf-forecasting-showcase`
3. Live URL: https://basf-forecasting-showcase.marc-forecasting.workers.dev

Run `npm test` before committing.
