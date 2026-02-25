// Glass Design System Tokens
// Aligned with Snapgo Blue (#0e4493) primary color

export const glassEffects = {
  // Card styles (light-only)
  card: 'bg-white/80 backdrop-blur-xl border border-white/20 rounded-2xl shadow-xl',
  cardHover: 'hover:bg-white/90 hover:shadow-2xl',

  // Navbar styles
  navbar: 'bg-white/95 backdrop-blur-md border-b border-gray-100',

  // Button styles
  button: 'bg-white/60 backdrop-blur-md border border-white/20 hover:bg-white/80',

  // Input styles
  input: 'bg-white/50 backdrop-blur-lg border border-white/20 focus:border-primary/50',

  // Overlay styles
  overlay: 'bg-black/20 backdrop-blur-sm',

  // Modal styles
  modal: 'bg-white/95 backdrop-blur-2xl border border-white/20',
} as const

export const animations = {
  // Hover effects
  hover: 'transition-all duration-200 hover:scale-[1.02]',
  hoverSubtle: 'transition-all duration-200 hover:scale-[1.01]',

  // Smooth transitions
  smooth: 'transition-colors duration-150',
  smoothAll: 'transition-all duration-200',

  // Micro-interactions
  micro: 'transition-transform duration-200',
  microFast: 'transition-transform duration-150',

  // Loading states
  pulse: 'animate-pulse',
  spin: 'animate-spin',

  // Fade effects
  fadeIn: 'animate-in fade-in duration-200',
  fadeOut: 'animate-out fade-out duration-150',

  // Slide effects
  slideIn: 'animate-in slide-in-from-bottom-4 duration-200',
  slideOut: 'animate-out slide-out-to-bottom-4 duration-150',
} as const

export const colors = {
  // Primary (Snapgo Blue - matches tailwind config)
  primary: {
    50: '#e8eef7',
    100: '#d1ddef',
    200: '#a3bbdf',
    300: '#7599cf',
    400: '#4777bf',
    500: '#0e4493', // Main brand color
    600: '#0b3676',
    700: '#082959',
    800: '#061b3c',
    900: '#030e1f',
  },

  // Glass overlay colors (light-only)
  glass: {
    card: 'rgba(255, 255, 255, 0.8)',
    navbar: 'rgba(255, 255, 255, 0.95)',
    border: 'rgba(255, 255, 255, 0.2)',
  },
} as const

export const spacing = {
  // Floating navbar spacing
  navbarHeight: '4rem', // 64px
  navbarSpacing: '1rem', // 16px from top/sides

  // Content spacing (accounting for floating navbar)
  contentTop: 'calc(4rem + 2rem)', // navbar height + extra spacing

  // Card spacing
  cardPadding: '1.5rem', // 24px
  cardGap: '1.5rem', // 24px between cards
} as const

export const shadows = {
  glass: '0 8px 32px 0 rgba(31, 38, 135, 0.15)',
  glassHover: '0 12px 48px 0 rgba(31, 38, 135, 0.25)',
  glow: '0 0 20px rgba(14, 68, 147, 0.3)', // Snapgo Blue glow
  glowHover: '0 0 30px rgba(14, 68, 147, 0.5)',
} as const

export const blur = {
  xs: 'blur(4px)',
  sm: 'blur(8px)',
  md: 'blur(12px)',
  lg: 'blur(16px)',
  xl: 'blur(24px)',
  '2xl': 'blur(40px)',
} as const

// Helper function to combine glass classes
export function glassCard(hover = true) {
  return `${glassEffects.card} ${hover ? glassEffects.cardHover + ' ' + animations.hover : ''}`
}

// Helper function for glass buttons
export function glassButton() {
  return `${glassEffects.button} ${animations.smooth}`
}

// Helper function for glass inputs
export function glassInput() {
  return `${glassEffects.input} ${animations.smooth}`
}
