/**
 * Log levels for the Logger class
 * - debug: Detailed debug information
 * - info: General application flow information
 * - warn: Warnings that might indicate potential issues
 * - error: Error events that might still allow the application to continue running
 */
type LogLevel = 'debug' | 'info' | 'warn' | 'error';

/**
 * A simple logging utility for React Native applications
 *
 * @example
 * // Basic usage
 * const logger = new Logger('AuthService');
 * logger.info('User logged in', { userId: 123 });
 *
 * // With error handling
 * try {
 *   // some code
 * } catch (error) {
 *   logger.error('Login failed', { error });
 * }
 */
export class Logger {
  /** Context to identify the source of the log messages */
  private context: string;

  /**
   * Creates a new Logger instance
   * @param context - A string to identify the source of the logs (e.g., 'AuthService', 'API')
   */
  constructor(context: string) {
    this.context = context;
  }

  /**
   * Internal method to handle the actual logging
   * @param level - The log level
   * @param message - The main log message
   * @param args - Additional data to log (objects, errors, etc.)
   */
  private log(level: LogLevel, message: string, ...args: any[]) {
    const timestamp = new Date().toISOString(); // follows ISO Standards
    const logMessage = `[${timestamp}] [${level.toUpperCase()}] [${this.context}] ${message}`; // example: [2025-12-02T06:16:52.123Z] [INFO] [Brandfetch] Brandfetch initialized

    switch (level) {
      case 'error':
        console.error(logMessage, ...args);
        break;
      case 'warn':
        console.warn(logMessage, ...args);
        break;
      case 'info':
      case 'debug':
      default:
        console.log(logMessage, ...args);
    }
  }

  /**
   * Log a debug message
   * @param message - The debug message
   * @param args - Additional debug data
   */
  debug(message: string, ...args: any[]) {
    this.log('debug', message, ...args);
  }

  /**
   * Log an informational message
   * @param message - The info message
   * @param args - Additional context data
   */
  info(message: string, ...args: any[]) {
    this.log('info', message, ...args);
  }

  /**
   * Log a warning message
   * @param message - The warning message
   * @param args - Additional context data
   */
  warn(message: string, ...args: any[]) {
    this.log('warn', message, ...args);
  }

  /**
   * Log an error message
   * @param message - The error message
   * @param args - Additional error data or Error objects
   */
  error(message: string, ...args: any[]) {
    this.log('error', message, ...args);
  }
}
