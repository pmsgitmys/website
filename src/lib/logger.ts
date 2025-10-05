type LogLevel = 'info' | 'warn' | 'error' | 'debug'

interface LogEntry {
  timestamp: string
  level: LogLevel
  message: string
  context?: any
  userId?: string
  sessionId?: string
  userAgent?: string
  url?: string
}

class Logger {
  private isDevelopment = process.env.NODE_ENV === 'development'

  private createLogEntry(
    level: LogLevel,
    message: string,
    context?: any,
    metadata?: Partial<LogEntry>
  ): LogEntry {
    return {
      timestamp: new Date().toISOString(),
      level,
      message,
      context,
      ...metadata,
    }
  }

  private async sendToExternalService(logEntry: LogEntry) {
    // In production, you would send to services like:
    // - Sentry
    // - LogRocket
    // - Datadog
    // - CloudWatch
    // For now, we'll just log to console in development
    if (this.isDevelopment) {
      console.log(`[${logEntry.level.toUpperCase()}]`, logEntry)
    } else {
      // In production, send to external service
      try {
        // Example: await fetch('/api/logs', { method: 'POST', body: JSON.stringify(logEntry) })
      } catch (error) {
        console.error('Failed to send log to external service:', error)
      }
    }
  }

  info(message: string, context?: any, metadata?: Partial<LogEntry>) {
    const logEntry = this.createLogEntry('info', message, context, metadata)
    this.sendToExternalService(logEntry)
  }

  warn(message: string, context?: any, metadata?: Partial<LogEntry>) {
    const logEntry = this.createLogEntry('warn', message, context, metadata)
    this.sendToExternalService(logEntry)
  }

  error(message: string, error?: Error | any, metadata?: Partial<LogEntry>) {
    const context = error instanceof Error
      ? {
          name: error.name,
          message: error.message,
          stack: error.stack,
        }
      : error

    const logEntry = this.createLogEntry('error', message, context, metadata)
    this.sendToExternalService(logEntry)
  }

  debug(message: string, context?: any, metadata?: Partial<LogEntry>) {
    if (this.isDevelopment) {
      const logEntry = this.createLogEntry('debug', message, context, metadata)
      this.sendToExternalService(logEntry)
    }
  }

  // User action logging
  logUserAction(action: string, userId?: string, details?: any) {
    this.info(`User action: ${action}`, details, { userId })
  }

  // Performance logging
  logPerformance(operation: string, duration: number, metadata?: any) {
    this.info(`Performance: ${operation}`, { duration, ...metadata })
  }

  // Business event logging
  logBusinessEvent(event: string, data?: any, userId?: string) {
    this.info(`Business event: ${event}`, data, { userId })
  }
}

// Create singleton instance
export const logger = new Logger()

// Error boundary helper
export function withErrorLogging<T extends (...args: any[]) => any>(
  fn: T,
  operationName: string
): T {
  return ((...args: any[]) => {
    try {
      const result = fn(...args)

      // Handle async functions
      if (result && typeof result.catch === 'function') {
        return result.catch((error: Error) => {
          logger.error(`Error in ${operationName}`, error)
          throw error
        })
      }

      return result
    } catch (error) {
      logger.error(`Error in ${operationName}`, error as Error)
      throw error
    }
  }) as T
}

// Performance measurement helper
export function measurePerformance<T>(
  operation: string,
  fn: () => T | Promise<T>
): T | Promise<T> {
  const start = performance.now()

  try {
    const result = fn()

    if (result && typeof (result as any).then === 'function') {
      return (result as Promise<T>).finally(() => {
        const duration = performance.now() - start
        logger.logPerformance(operation, duration)
      })
    } else {
      const duration = performance.now() - start
      logger.logPerformance(operation, duration)
      return result
    }
  } catch (error) {
    const duration = performance.now() - start
    logger.logPerformance(operation, duration, { error: true })
    throw error
  }
}

// Client-side error handler
export function setupClientErrorHandling() {
  if (typeof window !== 'undefined') {
    // Handle unhandled promise rejections
    window.addEventListener('unhandledrejection', (event) => {
      logger.error('Unhandled promise rejection', event.reason, {
        url: window.location.href,
        userAgent: navigator.userAgent
      })
    })

    // Handle JavaScript errors
    window.addEventListener('error', (event) => {
      logger.error('JavaScript error', {
        message: event.message,
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno,
        error: event.error
      }, {
        url: window.location.href,
        userAgent: navigator.userAgent
      })
    })

    // Handle network errors (fetch failures)
    const originalFetch = window.fetch
    window.fetch = async (...args) => {
      try {
        const response = await originalFetch(...args)

        if (!response.ok) {
          logger.warn('HTTP error', {
            url: args[0],
            status: response.status,
            statusText: response.statusText
          })
        }

        return response
      } catch (error) {
        logger.error('Network error', error, {
          url: args[0]?.toString(),
          userAgent: navigator.userAgent
        })
        throw error
      }
    }
  }
}