import { defineConfig } from 'vite';
import copy from 'rollup-plugin-copy';
import fs from 'fs';
import path from 'path';

const wasmContentTypePlugin = {
  name: 'wasm-content-type-plugin',
  configureServer(server) {
    server.middlewares.use(async (req, res, next) => {
      if (req.url.endsWith('.wasm')) {
        res.setHeader('Content-Type', 'application/wasm');
        const newPath = req.url.replace('deps', 'dist');
        const targetPath = path.join(__dirname, newPath);
        const wasmContent = fs.readFileSync(targetPath);
        return res.end(wasmContent);
      }
      next();
    });
  },
};


export default defineConfig(({ command }) => {
  return {
    server: {
      // cors: {
      //   allowedHeaders: {
      //     "Cross-Origin-Embedder-Policy":"require-corp",
      //     "Cross-Origin-Opener-Policy": "same-origin"
      //   }
      // }
    },
    build: {
      target: 'esnext',
    },
    optimizeDeps: {
      esbuildOptions: {
        target: 'esnext'
      }
    },
    plugins: [
      copy({
        targets: [{ src: 'node_modules/**/*.wasm', dest: 'node_modules/.vite/dist' }],
        copySync: true,
        hook: 'buildStart',
      }),
      command === 'serve' ? wasmContentTypePlugin : [],

      //------ enables multi core proving :DDD
      {
        name: "configure-response-headers",
        configureServer: (server) => {
          server.middlewares.use((_req, res, next) => {
            res.setHeader("Cross-Origin-Embedder-Policy", "require-corp");
            res.setHeader("Cross-Origin-Opener-Policy", "same-origin");
            next();
          });
        },
      },
      //-----

    ],
  };
});