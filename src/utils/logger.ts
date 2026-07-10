/**
 * Logger utility for application-wide logging
 * 
 * Purpose: Centralized logging that respects environment (dev vs production)
 * In production, errors can be sent to monitoring services like Sentry
 */

/**
 * Logs error messages with optional error object
 * 
 * Purpose: Consistent error logging across the application
 * 
 * @param {string} iMessage - Error message to log
 * @param {unknown} iError - Optional error object or additional data
 * @returns {void}
 */
export const logError = (iMessage: string, iError?: unknown): void => {
  if (import.meta.env.DEV) {
    console.error(`[ERROR] ${iMessage}`, iError || '')
  }
  // TODO: In production, send to error tracking service (Sentry, LogRocket, etc.)
}

/**
 * Logs warning messages
 * 
 * Purpose: Log warnings that don't break functionality but need attention
 * 
 * @param {string} iMessage - Warning message to log
 * @param {unknown} iData - Optional additional data
 * @returns {void}
 */
export const logWarning = (iMessage: string, iData?: unknown): void => {
  if (import.meta.env.DEV) {
    console.warn(`[WARN] ${iMessage}`, iData || '')
  }
}

/**
 * Logs informational messages
 * 
 * Purpose: Log helpful information during development
 * 
 * @param {string} iMessage - Info message to log
 * @param {unknown} iData - Optional additional data
 * @returns {void}
 */
export const logInfo = (iMessage: string, iData?: unknown): void => {
  if (import.meta.env.DEV) {
    console.info(`[INFO] ${iMessage}`, iData || '')
  }
}

/**
 * Logs debug messages (only in development)
 * 
 * Purpose: Detailed debugging information
 * 
 * @param {string} iMessage - Debug message to log
 * @param {unknown} iData - Optional additional data
 * @returns {void}
 */
export const logDebug = (iMessage: string, iData?: unknown): void => {
  if (import.meta.env.DEV) {
    console.log(`[DEBUG] ${iMessage}`, iData || '')
  }
}

export const logger = {
  error: logError,
  warn: logWarning,
  info: logInfo,
  debug: logDebug,
}
