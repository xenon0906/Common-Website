import { Variants } from 'framer-motion'

// Ultra snappy entrance animations
export const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.2, ease: [0.34, 1.56, 0.64, 1] }
  }
}

export const fadeInDown: Variants = {
  hidden: { opacity: 0, y: -30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.2, ease: [0.34, 1.56, 0.64, 1] }
  }
}

export const fadeInLeft: Variants = {
  hidden: { opacity: 0, x: -30 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.2, ease: [0.34, 1.56, 0.64, 1] }
  }
}

export const fadeInRight: Variants = {
  hidden: { opacity: 0, x: 30 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.2, ease: [0.34, 1.56, 0.64, 1] }
  }
}

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.15, ease: 'easeOut' }
  }
}

export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.2, ease: [0.34, 1.56, 0.64, 1] }
  }
}

export const scaleInBounce: Variants = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.15, type: 'spring', stiffness: 250, damping: 12 }
  }
}

// Container variants for staggered children - rapid fire
export const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.03,
      delayChildren: 0.02
    }
  }
}

export const staggerContainerFast: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.02,
      delayChildren: 0.01
    }
  }
}

export const staggerContainerSlow: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
      delayChildren: 0.05
    }
  }
}

// Child variants for stagger containers - snappy
export const staggerItem: Variants = {
  hidden: { opacity: 0, y: 15 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.15, ease: [0.34, 1.56, 0.64, 1] }
  }
}

export const staggerItemScale: Variants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.15, ease: [0.34, 1.56, 0.64, 1] }
  }
}

// Hover animations - instant
export const hoverScale = {
  scale: 1.02,
  transition: { duration: 0.1, ease: 'easeOut' }
}

export const hoverLift = {
  y: -4,
  transition: { duration: 0.1, ease: 'easeOut' }
}

export const tapScale = {
  scale: 0.98,
  transition: { duration: 0.05 }
}

// Floating animation for decorative elements
export const float: Variants = {
  initial: { y: 0 },
  animate: {
    y: [-8, 8, -8],
    transition: {
      duration: 3,
      repeat: Infinity,
      ease: 'easeInOut'
    }
  }
}

export const floatSlow: Variants = {
  initial: { y: 0 },
  animate: {
    y: [-12, 12, -12],
    transition: {
      duration: 4,
      repeat: Infinity,
      ease: 'easeInOut'
    }
  }
}

// Pulse glow animation
export const pulseGlow: Variants = {
  initial: { opacity: 0.5 },
  animate: {
    opacity: [0.5, 0.8, 0.5],
    scale: [1, 1.03, 1],
    transition: {
      duration: 1.5,
      repeat: Infinity,
      ease: 'easeInOut'
    }
  }
}

// Slide animations for page transitions - snappy
export const slideInFromLeft: Variants = {
  hidden: { x: -50, opacity: 0 },
  visible: {
    x: 0,
    opacity: 1,
    transition: { duration: 0.2, ease: [0.34, 1.56, 0.64, 1] }
  },
  exit: {
    x: -50,
    opacity: 0,
    transition: { duration: 0.15, ease: 'easeIn' }
  }
}

export const slideInFromRight: Variants = {
  hidden: { x: 50, opacity: 0 },
  visible: {
    x: 0,
    opacity: 1,
    transition: { duration: 0.2, ease: [0.34, 1.56, 0.64, 1] }
  },
  exit: {
    x: 50,
    opacity: 0,
    transition: { duration: 0.15, ease: 'easeIn' }
  }
}

// Reveal animation (for text or sections) - snappy
export const revealUp: Variants = {
  hidden: {
    opacity: 0,
    y: 30,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.2, ease: [0.34, 1.56, 0.64, 1] }
  }
}

// Icon animations - bouncy
export const iconPop: Variants = {
  hidden: { scale: 0, rotate: -90 },
  visible: {
    scale: 1,
    rotate: 0,
    transition: { type: 'spring', stiffness: 300, damping: 12 }
  }
}

export const iconFloat: Variants = {
  initial: { y: 0, rotate: 0 },
  animate: {
    y: [-2, 2, -2],
    rotate: [-1, 1, -1],
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: 'easeInOut'
    }
  }
}
