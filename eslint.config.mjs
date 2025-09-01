import { dirname } from 'path';
import { fileURLToPath } from 'url';
import { FlatCompat } from '@eslint/eslintrc';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends('next/core-web-vitals', 'next/typescript'),
  {
    rules: {
      // Reglas específicas para PWA
      '@next/next/no-img-element': 'off', // Permitir img para PWA
      'jsx-a11y/alt-text': 'warn', // Advertencia para imágenes sin alt
    },
    ignores: [
      '.next/**/*',
      'out/**/*',
      'dist/**/*',
      'node_modules/**/*',
      'public/sw.js', // Ignorar service worker
    ],
  },
];

export default eslintConfig;
