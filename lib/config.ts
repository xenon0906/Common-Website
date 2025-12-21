// Configuration for static vs database mode
// Set to true when DATABASE_URL is available and you want to use the database
// Currently disabled for frontend-only deployment

export const USE_DATABASE = false

// When you're ready to enable the database backend:
// 1. Set DATABASE_URL in your environment variables
// 2. Change USE_DATABASE to: process.env.DATABASE_URL ? true : false
// 3. Uncomment the Prisma imports and database calls in lib/content.ts
