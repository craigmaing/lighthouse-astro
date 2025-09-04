// @ts-check
import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import sitemap from '@astrojs/sitemap';
import compress from 'astro-compress';
import partytown from '@astrojs/partytown';
import db from '@astrojs/db';

// https://astro.build/config
export default defineConfig({
  site: 'https://lighthousementoring.co.uk',
  integrations: [
    db(),
    tailwind({
      applyBaseStyles: false,
    }),
    sitemap({
      changefreq: 'weekly',
      priority: 0.7,
      lastmod: new Date(),
      customPages: []
    }),
    partytown({
      config: {
        forward: ["dataLayer.push"],
      },
    }),
    compress({
      CSS: true,
      HTML: {
        caseSensitive: true,
        collapseBooleanAttributes: true,
        collapseWhitespace: true,
        conservativeCollapse: false,
        decodeEntities: true,
        minifyCSS: true,
        minifyJS: true,
        minifyURLs: false,
        removeAttributeQuotes: true,
        removeComments: true,
        removeEmptyAttributes: true,
        removeOptionalTags: true,
        removeRedundantAttributes: true,
        removeScriptTypeAttributes: true,
        removeStyleLinkTypeAttributes: true,
        sortAttributes: true,
        sortClassName: true,
      },
      Image: false,
      JavaScript: true,
      SVG: true,
    })
  ],
  output: 'static',
  build: {
    inlineStylesheets: 'always', // Inline all CSS for better performance
    format: 'directory',
    assets: '_assets'
  },
  vite: {
    build: {
      cssCodeSplit: false, // Bundle all CSS together for better compression
      rollupOptions: {
        output: {
          assetFileNames: '_assets/[name].[hash][extname]',
          manualChunks: undefined // Disable code splitting for smaller sites
        }
      }
    },
    ssr: {
      noExternal: ['@fontsource/*'] // Bundle fonts for faster loading
    }
  },
  prefetch: {
    prefetchAll: true,
    defaultStrategy: 'viewport'
  },
  image: {
    service: {
      entrypoint: 'astro/assets/services/sharp',
      config: {
        limitInputPixels: false // Allow processing of large images
      }
    },
    remotePatterns: []
  }
});
