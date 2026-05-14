import { defineConfig } from 'vite';
import ViteRestart from 'vite-plugin-restart';
import tailwindcss from '@tailwindcss/vite';
import path from 'path';


export default defineConfig(({ command, mode }) => ({
    base: command === "serve" ? "" : "/dist/",
    build: {
        emptyOutDir: true,
        manifest: true,
        outDir: path.resolve(__dirname, "web/dist/"),
        rollupOptions: {
            input: {
                app: path.resolve(__dirname, "src/index.js"),
            },
        },
        sourcemap: mode === 'development',
        minify: 'terser',
        terserOptions: mode === 'production' ? {
            compress: {
                drop_console: true,
                drop_debugger: true,
            },
        } : {},
    },
    publicDir: "./src/public",
    resolve: {
        alias: {
            "@": path.resolve(__dirname, "src"),
            "@css": path.resolve(__dirname, "src/css"),
            "@js": path.resolve(__dirname, "src/js"),
        },
    },
    plugins: [
        tailwindcss(),
        ViteRestart({
            reload: ['./templates/**/*'],
        }),
    ],
    server: {
        // Allow cross-origin requests -- https://github.com/vitejs/vite/security/advisories/GHSA-vg6x-rcgg-rjx6
        allowedHosts: true,
        cors: {
            origin: /(\.local|\.site|localhost)/
        },
        fs: {
			strict: false,
		},
        headers: {
            "Access-Control-Allow-Private-Network": "true",
        },
        host: "0.0.0.0",
        origin: "http://localhost:3000",
        port: 3000,
        strictPort: true,
    },
}));