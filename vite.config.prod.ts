// Production-optimized config for Vercel deployment
import { defineConfig } from "@lovable.dev/vite-tanstack-config";

export default defineConfig({
  tanstackStart: {
    server: { entry: "server" },
  },
  vite: {
    build: {
      minify: "terser",
      terserOptions: {
        compress: {
          passes: 2,
        },
        mangle: true,
        output: {
          comments: false,
        },
      },
      rollupOptions: {
        output: {
          manualChunks: {
            vendor: ["react", "react-dom"],
            ui: [
              "@radix-ui/react-accordion",
              "@radix-ui/react-alert-dialog",
              "@radix-ui/react-aspect-ratio",
            ],
          },
        },
      },
      sourcemap: false,
      reportCompressedSize: false,
    },
  },
});
