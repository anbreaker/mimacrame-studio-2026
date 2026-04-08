import angular from '@analogjs/vite-plugin-angular';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  plugins: [
    angular({
      tsconfig: 'tsconfig.json',
    }),
  ],
  resolve: {
    alias: {
      '@assets': '/src/assets',
      '@components': '/src/app/components',
      '@core': '/src/app/core',
      '@environments': '/src/environments',
      '@features': '/src/app/features',
      '@i18n': '/src/i18n',
      '@pages': '/src/app/pages',
      '@shared': '/src/app/shared',
      '@styles': '/src/styles',
    },
  },
  test: {
    coverage: {
      exclude: [
        'node_modules/',
        'src/test-setup.ts',
        '**/*.spec.ts',
        '**/*.config.ts',
        '**/main.ts',
      ],
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
    },
    environment: 'jsdom',
    exclude: ['node_modules/**', 'dist/**'],
    globals: true,
    include: ['**/*.spec.ts'],
    server: {
      deps: {
        inline: ['rxfire', '@angular/fire'],
      },
    },
    setupFiles: ['src/test-setup.ts'],
  },
});
