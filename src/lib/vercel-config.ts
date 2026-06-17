// Production-ready server configuration for Vercel
// Handles errors, security headers, and optimization

import { createMiddleware } from "@tanstack/react-start";

export const createVercelSecurityMiddleware = () => {
  return createMiddleware().server(async ({ next }) => {
    const response = await next();

    // Clone headers to make it mutable
    const headers = new Headers(response.headers);

    // Security Headers
    headers.set("X-Content-Type-Options", "nosniff");
    headers.set("X-Frame-Options", "SAMEORIGIN");
    headers.set("X-XSS-Protection", "1; mode=block");
    headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
    headers.set("Permissions-Policy", "geolocation=(), microphone=(), camera=()");

    // Performance Headers
    headers.set("Accept-Encoding", "gzip, deflate, br");

    // Vercel-specific headers
    if (process.env.VERCEL === "1") {
      headers.set("X-Vercel-Deployment", "true");
    }

    return new Response(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers,
    });
  });
};

// Cache-busting strategy
export const getCacheControl = (pathname: string): string => {
  // Static assets - cache for 1 year
  if (/\.(js|css|woff2?|ttf|eot|svg|png|jpg|jpeg|gif|webp)$/.test(pathname)) {
    return "public, max-age=31536000, immutable";
  }

  // HTML - never cache, revalidate
  if (pathname.endsWith(".html") || !pathname.includes(".")) {
    return "public, max-age=0, must-revalidate";
  }

  // Default - revalidate daily
  return "public, max-age=86400, must-revalidate";
};
