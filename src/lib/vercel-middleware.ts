// Vercel-specific middleware for optimal performance
import { createMiddleware } from "@tanstack/react-start";

export const vercelMiddleware = createMiddleware()
  .middleware(async ({ next }) => {
    // Add Vercel deployment headers
    const response = await next();
    
    const headers = new Headers(response.headers);
    
    // Optimize for Vercel's caching
    headers.set("X-Content-Type-Options", "nosniff");
    headers.set("X-Frame-Options", "SAMEORIGIN");
    headers.set("X-XSS-Protection", "1; mode=block");
    headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
    
    // Enable compression
    headers.set("Accept-Encoding", "gzip, deflate, br");
    
    return new Response(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers,
    });
  });
