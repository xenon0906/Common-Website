import * as Sentry from '@sentry/nextjs'

export function captureApiError(
  error: unknown,
  context: {
    route: string
    method: string
    [key: string]: unknown
  }
) {
  Sentry.captureException(error, {
    tags: {
      route: context.route,
      method: context.method,
    },
    extra: context,
  })
}
