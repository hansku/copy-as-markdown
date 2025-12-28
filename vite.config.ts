import { defineConfig } from 'vite';
import { crx } from '@crxjs/vite-plugin';
import manifest from './source/manifest.json';

export default defineConfig({
    plugins: [
        crx({ manifest }),
    ],
    build: {
        outDir: 'distribution',
    },
});
