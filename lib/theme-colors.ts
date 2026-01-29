export const THEME_COLORS = {
  teal: {
    bg: 'bg-teal-100',
    hover: 'hover:bg-teal-200',
    text: 'text-teal-600',
    gradient: 'from-teal-50 to-primary-50',
    shadow: 'hover:shadow-teal-500/20',
  },
  primary: {
    bg: 'bg-primary-100',
    hover: 'hover:bg-primary-200',
    text: 'text-primary',
    gradient: 'from-primary-50 to-purple-50',
    shadow: 'hover:shadow-primary/20',
  },
  purple: {
    bg: 'bg-purple-100',
    hover: 'hover:bg-purple-200',
    text: 'text-purple-600',
    gradient: 'from-purple-50 to-teal-50',
    shadow: 'hover:shadow-purple-500/20',
  },
  emerald: {
    bg: 'bg-emerald-100',
    hover: 'hover:bg-emerald-200',
    text: 'text-emerald-600',
    gradient: 'from-emerald-50 to-teal-50',
    shadow: 'hover:shadow-emerald-500/20',
  },
} as const

export type ThemeColorKey = keyof typeof THEME_COLORS

export function getThemeColor(key: ThemeColorKey) {
  return THEME_COLORS[key]
}
