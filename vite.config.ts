import angular from '@analogjs/vite-plugin-angular';
import { resolve } from 'node:path';
import { defineConfig, Plugin } from 'vite';

/**
 * Inline plugin: en modo dev redirige environment.ts → environment.dev.ts
 * (equivalente a los fileReplacements de angular.json)
 */
function fileReplacementsPlugin(): Plugin {
  return {
    enforce: 'pre',
    name: 'file-replacements',
    resolveId(source, importer): string | undefined {
      if (importer && source.includes('environment.ts') && !source.includes('environment.dev')) {
        return source.replace('environment.ts', 'environment.dev.ts');
      }
      return undefined;
    },
  };
}

export default defineConfig(({ mode }) => ({
  envDir: resolve(__dirname),
  publicDir: resolve(__dirname, 'public'),
  root: 'src',

  plugins: [
    angular({
      tsconfig: resolve(__dirname, 'tsconfig.app.json'),
    }),
    ...(mode === 'dev' ? [fileReplacementsPlugin()] : []),
  ],

  envPrefix: 'NG_APP_',

  server: {
    hmr: true,
    open: true,
    port: 4200,
    ...(mode === 'dev' && {
      proxy: {
        '/api': {
          changeOrigin: true,
          target: 'http://localhost:3000',
        },
      },
    }),
  },

  resolve: {
    alias: {
      '@assets': resolve(__dirname, 'src/assets'),
      '@components': resolve(__dirname, 'src/app/components'),
      '@core': resolve(__dirname, 'src/app/core'),
      '@environments': resolve(__dirname, 'src/environments'),
      '@features': resolve(__dirname, 'src/app/features'),
      '@i18n': resolve(__dirname, 'src/i18n'),
      '@pages': resolve(__dirname, 'src/app/pages'),
      '@shared': resolve(__dirname, 'src/app/shared'),
      '@styles': resolve(__dirname, 'src/styles'),
    },
  },

  css: {
    preprocessorOptions: {
      scss: {
        loadPaths: [resolve(__dirname, 'src/styles')],
      },
    },
  },

  build: {
    emptyOutDir: true,
    outDir: resolve(__dirname, 'www'),
    rollupOptions: {
      output: {
        manualChunks: {
          angular: ['@angular/core', '@angular/common', '@angular/router', '@angular/forms'],
          firebase: ['@angular/fire', 'firebase'],
          rxjs: ['rxjs'],
        },
      },
    },
  },
}));
