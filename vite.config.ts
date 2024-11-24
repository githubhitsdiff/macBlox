import { svelte } from '@sveltejs/vite-plugin-svelte';
import * as path from 'node:path';
import { defineConfig } from 'vite';
import checker from 'vite-plugin-checker';
import neutralino from './scripts/package/vite-plugin';

// Vite configuration
export default defineConfig({
  root: 'frontend', // Root directory for the frontend
  plugins: [
    svelte(),
    checker({ typescript: true }),  // Ensure TypeScript is checked and errors are displayed
    neutralino(), // Neutralino plugin for building desktop apps with web technologies
  ],
  build: {
    outDir: path.resolve('frontend/dist'), // Ensure proper path resolution for output directory
    rollupOptions: {
      external: ['/__neutralino_globals.js'], // Externalize global scripts for better performance
    },
    sourcemap: true,  // Enable sourcemaps for easier debugging
    // Additional optimizations
    minify: 'esbuild', // Use esbuild for faster minification (can be switched to 'terser' if needed)
    target: 'esnext', // Target the latest JavaScript features for modern browsers or Node.js
  },
  resolve: {
    alias: {
      $lib: path.resolve('frontend/src/lib'),
      '@': path.resolve('frontend/src'),
      '@root': path.resolve('./'),
    },
  },
  server: {
    host: 'localhost', // Run on localhost (can be replaced with dynamic value in production)
    port: 3000, // Default port, can be customized
    open: true, // Automatically open the app in the browser on start
    hmr: {
      clientPort: 3000, // Ensure hot module reloading works correctly on custom ports
    },
  },
  assetsInclude: ['**/*.icns'], // Include .icns files as assets
});
