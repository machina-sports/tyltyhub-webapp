/**
 * 🚨 MAINTENANCE CONFIGURATION
 * 
 * This file controls when the site enters offline/maintenance mode.
 * 
 * HOW TO USE:
 * 1. To activate: SITE_OFFLINE_MODE = true
 * 2. To deactivate: SITE_OFFLINE_MODE = false
 * 3. Or use the environment variable: NEXT_PUBLIC_SITE_OFFLINE=true
 */

// Check environment variable first, then default value
const SITE_OFFLINE_MODE = process.env.NEXT_PUBLIC_SITE_OFFLINE === 'true' || false

// Routes that should be accessible even in offline mode
export const ALLOWED_PATHS = [
  '/site-offline',      // The maintenance page itself
  '/api',              // APIs (if needed for analytics, etc.)
  '/_next',            // Next.js assets
  '/favicon.ico',      // Favicon
  '/outline.png',      // Site logo
  '/robots.txt',       // SEO
  '/sitemap.xml',      // SEO
  // Add more routes if needed
]

// Main configuration
export const MAINTENANCE_CONFIG = {
  isEnabled: SITE_OFFLINE_MODE,
  redirectTo: '/site-offline',
  allowedPaths: ALLOWED_PATHS,
}

export default MAINTENANCE_CONFIG 