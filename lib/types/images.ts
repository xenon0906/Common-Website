// Image configuration types for site-wide image management

export interface SiteImagesConfig {
  logos: {
    white: string      // Logo for dark backgrounds "/images/logo/Snapgo Logo White.png"
    blue: string       // Logo for light backgrounds "/images/logo/Snapgo Logo Blue.png"
    favicon: string    // Browser favicon "/favicon.ico"
  }
  qrCodes: {
    android: string    // Play Store QR code "/images/qr code/playstore-qr.png"
    ios: string        // App Store QR code "/images/qr code/appstore-qr.png"
  }
  mockups: {
    homeScreen: string
    tripDetails: string
    tripChat: string
    inAppCalling: string
    profileVerified: string
    createTrip: string
    emergencySos: string
    splashScreen: string
  }
  appStoreBadges: {
    apple: string      // Apple App Store badge
    google: string     // Google Play Store badge
  }
  seo: {
    ogImage: string    // Open Graph image for social sharing
  }
  hero: {
    appMockup: string  // Main hero section app mockup
    background: string // Optional hero background image
  }
}

export const DEFAULT_IMAGES: SiteImagesConfig = {
  logos: {
    white: '/images/logo/Snapgo Logo White.png',
    blue: '/images/logo/Snapgo Logo Blue.png',
    favicon: '/favicon.png',
  },
  qrCodes: {
    android: '/images/qr code/playstore-qr.png',
    ios: '/images/qr code/appstore-qr.png',
  },
  mockups: {
    homeScreen: '/images/mockups/iphone15/home-screen.png',
    tripDetails: '/images/mockups/iphone15/trip-details.png',
    tripChat: '/images/mockups/iphone15/trip-chat.png',
    inAppCalling: '/images/mockups/iphone15/in-app-calling.png',
    profileVerified: '/images/mockups/iphone15/profile-verified.png',
    createTrip: '/images/mockups/iphone15/create-trip.png',
    emergencySos: '/images/mockups/iphone15/emergency-sos.png',
    splashScreen: '/images/mockups/iphone15/home-screen.png',
  },
  appStoreBadges: {
    apple: '/images/badges/apple-store-badge.svg',
    google: '/images/badges/google-play-badge.svg',
  },
  seo: {
    ogImage: '/images/og-image.png',
  },
  hero: {
    appMockup: '/images/mockups/iphone15/home-screen.png',
    background: '',
  },
}
