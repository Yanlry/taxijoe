import react from '@vitejs/plugin-react';
import { defineConfig, type Plugin } from 'vite';
import { business, services } from './src/config/business.ts';
import { buildHeadTags } from './src/config/seo.ts';

const HEAD_MARKER = '<!-- business-head -->';

/**
 * Injecte dans index.html le <title>, la meta description, les balises Open Graph
 * et les données structurées JSON-LD, générés depuis src/config/business.ts.
 * Les infos restent ainsi à un seul endroit et sont présentes dans le HTML statique
 * (lisible par Google et par les aperçus de liens, sans JavaScript).
 */
function businessHead(): Plugin {
  return {
    name: 'taxi-joe:business-head',
    transformIndexHtml(html) {
      if (!html.includes(HEAD_MARKER)) {
        throw new Error(`Marqueur ${HEAD_MARKER} introuvable dans index.html`);
      }
      return html.replace(HEAD_MARKER, buildHeadTags(business, services));
    },
  };
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), businessHead()],
});
