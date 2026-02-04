export async function register() {
  try {
    if (process.env.NEXT_RUNTIME === 'nodejs') {
      await import('./sentry.server.config')
    }

    if (process.env.NEXT_RUNTIME === 'edge') {
      await import('./sentry.edge.config')
    }
  } catch (e) {
    console.warn('Sentry instrumentation failed to load:', e)
  }
}

export const onRequestError = async (...args: unknown[]) => {
  try {
    const Sentry = await import('@sentry/nextjs')
    if (typeof Sentry.captureRequestError === 'function') {
      return Sentry.captureRequestError(...(args as Parameters<typeof Sentry.captureRequestError>))
    }
  } catch {
    // Sentry unavailable — silently ignore
  }
}
