# ClaimGuard Clinical

ClaimGuard Clinical is a Vite and React single-page application for healthcare
claims review. The current application uses local mock data and does not require
environment variables to run or deploy.

## Run locally

**Prerequisite:** Node.js

```bash
npm install
npm run dev
```

## Deploy to Vercel

1. Push this project to a Git provider supported by Vercel.
2. In Vercel, choose **Add New Project** and import the repository.
3. Keep the detected Vite framework settings, or use:
   - Build command: `npm run build`
   - Output directory: `dist`
4. Deploy. No environment variables are required for the current mock-data app.

The included `vercel.json` configures the production build and routes application
URLs back to the SPA entry point.

## Environment variables

The app does not currently read `GEMINI_API_KEY` or `APP_URL`; adding them to
Vercel will not enable Gemini features. Do not expose a private API key through a
`VITE_`-prefixed variable, since Vite embeds those values in browser code. If
Gemini integration is added later, call Gemini from a server-side endpoint and
store the key as a server-only Vercel environment variable.
