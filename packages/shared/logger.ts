// packages/shared/logger.ts

export function info(message: string, ...meta: unknown[]) {
    console.info(`[INFO]  ${new Date().toISOString()}  ${message}`, ...meta);
  }
  
  export function warn(message: string, ...meta: unknown[]) {
    console.warn(`[WARN]  ${new Date().toISOString()}  ${message}`, ...meta);
  }
  
  export function error(message: string, ...meta: unknown[]) {
    console.error(`[ERROR] ${new Date().toISOString()}  ${message}`, ...meta);
  }
  