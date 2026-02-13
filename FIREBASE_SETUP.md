# Firebase Management from Codebase - Snapgo

Everything you need to manage Firebase without opening the Console.

## One-Time Initial Setup

### 1. Install Firebase CLI Globally
```bash
npm install -g firebase-tools
```

### 2. Login to Firebase
```bash
firebase login
# Opens browser for Google auth
```

### 3. Initialize Firebase Project (First Time Only)
```bash
firebase init

# Select with spacebar:
# [x] Firestore
# [x] Storage

# Select: Use an existing project
# Choose: snapgo-admin

# Firestore rules file: firestore.rules (already exists)
# Firestore indexes file: firestore.indexes.json (already exists)
# Storage rules file: storage.rules (will create)
```

### 4. Deploy Security Rules
```bash
npm run setup:firebase
```

**Done!** You never need to open Firebase Console again.

---

## Daily Operations (No Console)

### Content Management
All via admin panel at `/admin/*`:
- **Blogs**: `/admin/blogs` - Create, edit, delete
- **Team**: `/admin/team` - Add team members
- **Content**: `/admin/content/*` - Hero, features, testimonials, etc.
- **Media**: `/admin/media` - View all uploaded files
- **SEO**: `/admin/seo` - Manage meta tags, sitemaps
- **Settings**: `/admin/settings` - Site configuration

### Database Operations
```bash
# Populate with default data
npm run seed:firestore

# Delete all blogs
npm run delete:blogs

# Fix blog URL slugs
npm run fix:blog-slugs
```

### Security Rules Updates
1. Edit `firestore.rules` or `storage.rules` in your code editor
2. Deploy changes:
```bash
npm run deploy:rules
```

### Image Uploads
- Use admin panel: `/admin/blogs/create` → Upload featured image
- Uses Firebase Storage automatically
- Images persist forever (no Vercel ephemeral storage)

---

## Troubleshooting

### "Permission denied" on upload
**Cause:** Storage rules not deployed

**Fix:**
```bash
firebase deploy --only storage:rules
```

**Verify:** Firebase Console > Storage > Rules tab shows rules

### "Firebase CLI not found"
**Fix:**
```bash
npm install -g firebase-tools
```

### "Not logged in"
**Fix:**
```bash
firebase login
```

### Images not displaying
**Cause:** Next.js trying to optimize Firebase URLs

**Fix:** Already implemented in BlogList.tsx and BlogPost.tsx
- Check `unoptimized` prop is `true` for Firebase URLs

### Need to check what's in Firebase
**Rarely needed**, but if you must:
- Go to [Firebase Console](https://console.firebase.google.com/)
- Select: snapgo-admin project
- Check: Storage > Files (view uploaded images)
- Check: Firestore Database > Data (view blog data)

---

## File Structure

```
snapgo/
├── firestore.rules          ← Firestore security rules
├── firestore.indexes.json   ← Firestore composite indexes
├── storage.rules            ← Storage security rules (NEW)
├── firebase.json            ← Firebase CLI config
├── .firebaserc              ← Project selection
├── scripts/
│   ├── setup-firebase.ts    ← One-command setup (NEW)
│   ├── seed-firestore.ts    ← Database seeding
│   ├── delete-all-blogs.ts  ← Clear blogs
│   └── fix-blog-slugs.ts    ← Fix URLs
└── FIREBASE_SETUP.md        ← This guide (NEW)
```

---

## Architecture

### Data Storage
- **Firestore path:** `artifacts/default/public/data/{collection}`
- **Storage path:** `{category}/{filename}`
- **Categories:** blog, team, achievements, logo, general, media

### Authentication
- Admin panel uses Firebase Auth
- Public content readable by all
- Uploads require authentication

### Image Flow
1. User uploads via `/admin/blogs/create`
2. File sent to `/api/upload`
3. Upload to Firebase Storage (`lib/firebase-storage.ts`)
4. Get signed download URL
5. Save URL in Firestore `imageUrl` field
6. Display via Next.js Image component

---

## Command Reference

```bash
# Setup (run once)
npm run setup:firebase          # Deploy all rules

# Database operations
npm run seed:firestore          # Populate default data
npm run delete:blogs            # Clear all blogs
npm run fix:blog-slugs          # Fix blog URLs

# Firebase rules (when you edit firestore.rules or storage.rules)
npm run deploy:rules            # Deploy both rule files
firebase deploy --only storage  # Deploy storage only
firebase deploy --only firestore # Deploy Firestore only

# Development
npm run dev                     # Start dev server
npm run build                   # Build for production

# Firebase CLI (if needed)
firebase login                  # Login to Firebase
firebase projects:list          # List your projects
firebase serve                  # Test rules locally
```

---

## Environment Variables

Already configured in `.env.local`:
```env
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyDxEsO8N_in3gbmQBR191xg980gDiebWM8
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=snapgo-admin.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=snapgo-admin
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=snapgo-admin.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=644115168029
NEXT_PUBLIC_FIREBASE_APP_ID=1:644115168029:web:bcabd25fae825990473ff4
NEXT_PUBLIC_APP_ID=default
```

**Never commit `.env.local` to Git!**

---

## Success! ✅

You now manage Firebase entirely from your codebase:
- ✅ Rules version-controlled in Git
- ✅ One command deploys everything
- ✅ Admin panel for all content
- ✅ Database seeding automated
- ✅ No Console access needed

**Enjoy your autonomous Firebase setup!** 🎉
