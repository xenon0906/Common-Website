// ============================================================================
// ADMIN DASHBOARD & DATABASE CONFIGURATION
// ============================================================================
//
// FIREBASE MODE: All data persists to Firestore.
// The admin dashboard uses Firebase for all CRUD operations.
//
// TO ENABLE FIREBASE:
// 1. Add Firebase config to environment variables:
//    - NEXT_PUBLIC_FIREBASE_API_KEY
//    - NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN
//    - NEXT_PUBLIC_FIREBASE_PROJECT_ID
//    - NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET
//    - NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID
//    - NEXT_PUBLIC_FIREBASE_APP_ID
//
// ============================================================================

export const USE_FIREBASE = !!(
  process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID &&
  process.env.NEXT_PUBLIC_FIREBASE_API_KEY
)
