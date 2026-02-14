#!/usr/bin/env tsx
/**
 * Guide for setting up Firebase Service Account Key
 * This key is required for server-side uploads using Firebase Admin SDK
 */

console.log(`
🔥 Firebase Service Account Setup Guide

To enable server-side uploads, you need a service account key:

Step 1: Get the Key
───────────────────
1. Open: https://console.firebase.google.com/
2. Select project: snapgo-admin
3. Click gear icon (⚙️) → Project Settings
4. Go to "Service Accounts" tab
5. Click "Generate New Private Key" button
6. Click "Generate Key" in the confirmation dialog
7. Save the downloaded JSON file securely

Step 2: Add to .env.local
─────────────────────────
1. Open the downloaded JSON file in a text editor
2. Minify it (remove all newlines/spaces): https://jsonformatter.org/json-minify
   OR use this one-liner to minify:

   cat snapgo-admin-*.json | jq -c . | pbcopy  (Mac)
   cat snapgo-admin-*.json | jq -c . | clip    (Windows)

3. Add to .env.local:

   FIREBASE_SERVICE_ACCOUNT_KEY='<paste-minified-json-here>'

   Example:
   FIREBASE_SERVICE_ACCOUNT_KEY='{"type":"service_account","project_id":"snapgo-admin","private_key_id":"...","private_key":"-----BEGIN PRIVATE KEY-----\\n...\\n-----END PRIVATE KEY-----\\n","client_email":"firebase-adminsdk-...@snapgo-admin.iam.gserviceaccount.com","client_id":"...","auth_uri":"https://accounts.google.com/o/oauth2/auth","token_uri":"https://oauth2.googleapis.com/token","auth_provider_x509_cert_url":"https://www.googleapis.com/oauth2/v1/certs","client_x509_cert_url":"https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-...%40snapgo-admin.iam.gserviceaccount.com"}'

Step 3: Verify
──────────────
Run: npm run dev
Check console for: "[firebase-admin] Initialized successfully"

If you see this message, setup is complete! ✅

⚠️  SECURITY WARNING:
━━━━━━━━━━━━━━━━━━━━
- Never commit this key to Git
- .env.local is already in .gitignore (protected)
- This key has FULL admin access to your Firebase project
- Keep it secure like a password
- Never share it publicly or in screenshots

✅ Done! Server-side uploads will now work without authentication errors.
`)

process.exit(0)
