// Animation configuration for consistent animations across the site
// Phase 2: Snappier, faster animations for better UX

export const ANIMATION_CONFIG = {
  // Entrance animations - Ultra snappy
  entrance: {
    duration: 0.15,  // Was 0.25 - now instant feel
    ease: [0.34, 1.56, 0.64, 1] as const,  // easeOutBack for snappy feel
  },

  // Stagger delays - Rapid sequential reveals
  stagger: {
    fast: 0.02,    // Was 0.03
    normal: 0.03,  // Was 0.05
    slow: 0.05,    // Was 0.08
  },

  // Spring physics - Very snappy with bounce
  spring: {
    stiffness: 250,  // Was 180
    damping: 12,     // Was 18 - more bounce
  },

  // Connection line animations
  connectionLine: {
    duration: 0.4,   // Was 0.7
    ease: 'easeOut' as const,
  },

  // Glow effects - Instant transitions
  glow: {
    duration: 0.1,       // Was 0.2
    pulseInterval: 1.5,  // Was 2.0
  },

  // Counter animations - Fast counting
  counter: {
    duration: 0.25,  // Was 0.4
    spring: { stiffness: 250, damping: 12 },
  },

  // Sequential highlight
  highlight: {
    autoAdvanceDelay: 2500,  // Was 3000 - faster cycling
    transitionDuration: 0.15, // Was 0.2
  },

  // Decorative animations - Faster cycles
  decorative: {
    float: 3,      // Was 4s
    blob: 4,       // Was 6s
    gradient: 3,   // Was 5s
  },

  // Hover effects - Instant response
  hover: {
    duration: 0.1,  // Was 0.15 - instant hover
    scale: 1.02,
  },
}

// Common animation variants - Updated for snappier feel
export const fadeInUp = {
  initial: { opacity: 0, y: 20 },  // Reduced from 30
  animate: { opacity: 1, y: 0 },
  transition: {
    duration: ANIMATION_CONFIG.entrance.duration,
    ease: ANIMATION_CONFIG.entrance.ease,
  },
}

export const fadeInLeft = {
  initial: { opacity: 0, x: -20 },  // Reduced from 30
  animate: { opacity: 1, x: 0 },
  transition: {
    duration: ANIMATION_CONFIG.entrance.duration,
    ease: ANIMATION_CONFIG.entrance.ease,
  },
}

export const fadeInRight = {
  initial: { opacity: 0, x: 20 },  // Reduced from 30
  animate: { opacity: 1, x: 0 },
  transition: {
    duration: ANIMATION_CONFIG.entrance.duration,
    ease: ANIMATION_CONFIG.entrance.ease,
  },
}

export const scaleIn = {
  initial: { opacity: 0, scale: 0.95 },  // Reduced from 0.9
  animate: { opacity: 1, scale: 1 },
  transition: {
    duration: ANIMATION_CONFIG.entrance.duration,
    type: 'spring',
    stiffness: ANIMATION_CONFIG.spring.stiffness,
    damping: ANIMATION_CONFIG.spring.damping,
  },
}

// Quick snap animation for buttons/interactive elements
export const snapIn = {
  initial: { opacity: 0, scale: 0.9 },
  animate: { opacity: 1, scale: 1 },
  transition: {
    duration: 0.15,
    ease: [0.34, 1.56, 0.64, 1],
  },
}

// Stagger container variant - Faster
export const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: ANIMATION_CONFIG.stagger.normal,
    },
  },
}

// Fast stagger container
export const fastStaggerContainer = {
  animate: {
    transition: {
      staggerChildren: ANIMATION_CONFIG.stagger.fast,
    },
  },
}

// Stagger item variant - Snappier
export const staggerItem = {
  initial: { opacity: 0, y: 15 },  // Reduced from 20
  animate: { opacity: 1, y: 0 },
  transition: {
    duration: ANIMATION_CONFIG.entrance.duration,
    ease: ANIMATION_CONFIG.entrance.ease,
  },
}

// Glow colors - Updated to Snapgo blue theme
export const GLOW_COLORS = {
  teal: {
    base: 'rgba(13, 148, 136, 0.35)',
    bright: 'rgba(13, 148, 136, 0.5)',
    subtle: 'rgba(13, 148, 136, 0.15)',
  },
  primary: {
    base: 'rgba(0, 102, 179, 0.35)',
    bright: 'rgba(0, 102, 179, 0.5)',
    subtle: 'rgba(0, 102, 179, 0.15)',
  },
  purple: {
    base: 'rgba(124, 58, 237, 0.35)',
    bright: 'rgba(124, 58, 237, 0.5)',
    subtle: 'rgba(124, 58, 237, 0.15)',
  },
}
