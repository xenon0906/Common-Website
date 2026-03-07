# Deploying Snapgo to Hostinger (hPanel)

## Prerequisites

- Hostinger Business plan or higher (must support Node.js)
- Node.js 18+ available in hPanel

## Option 1: Using the Pre-Built Zip

If you already have `snapgo-deploy.zip`, skip to "Hostinger hPanel Setup".

## Option 2: Build from Source

1. Make sure your `.env.local` has production Firebase credentials (NEXT_PUBLIC_* vars are baked in at build time)

2. Install dependencies:
   ```bash
   npm install
   ```

3. Build and create zip:
   ```bash
   bash scripts/build-hostinger.sh
   ```

   This creates `snapgo-deploy.zip` in the project root.

## Hostinger hPanel Setup

1. **Upload the zip:**
   - Go to hPanel > File Manager
   - Navigate to your domain's root directory (e.g., `public_html/snapgo/` or a subdirectory)
   - Upload `snapgo-deploy.zip`
   - Extract the zip in place

2. **Configure Node.js app:**
   - Go to hPanel > Advanced > Node.js
   - Click "Create Application"
   - Set Node.js version: 18 or higher
   - Set Application Root: path to the extracted directory
   - Set Application Startup File: `server.js`

3. **Set environment variables:**
   In the Node.js application settings, add these environment variables:

   **Required:**
   ```
   NODE_ENV=production
   PORT=3000
   FIREBASE_SERVICE_ACCOUNT_KEY={"type":"service_account",...}
   ADMIN_USERNAME=your_admin_username
   ADMIN_PASSWORD=your_admin_password
   ```

   **Optional:**
   ```
   NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXX
   SENTRY_DSN=https://xxx@sentry.io/xxx
   GOOGLE_SCRIPT_URL=https://script.google.com/...
   ```

   Note: `NEXT_PUBLIC_*` variables are already compiled into the JavaScript bundle at build time. Only server-side variables need to be set here.

4. **Start the application** via hPanel Node.js panel

5. **Test:** Visit your domain to verify the app loads correctly

## Custom Port

The server defaults to port 3000. To change, set the `PORT` environment variable:
```
PORT=8080
```

## Updating the App

1. Rebuild locally: `bash scripts/build-hostinger.sh`
2. Upload new `snapgo-deploy.zip` to Hostinger
3. Extract (overwrite existing files)
4. Restart the Node.js application in hPanel

## Troubleshooting

- **App won't start:** Ensure Node.js 18+ is selected in hPanel
- **Firebase errors:** Verify `FIREBASE_SERVICE_ACCOUNT_KEY` is valid minified JSON
- **Admin login fails:** Check `ADMIN_USERNAME` and `ADMIN_PASSWORD` are set correctly
- **Images not loading:** The app uses Firebase Storage for uploaded images; ensure Firebase credentials are correct
- **Blank pages:** Make sure `.next/static/` and `public/` directories exist alongside `server.js`
