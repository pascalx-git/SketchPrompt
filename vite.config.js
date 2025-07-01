"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const vite_1 = require("vite");
const plugin_react_1 = __importDefault(require("@vitejs/plugin-react"));
const path_1 = require("path");
exports.default = (0, vite_1.defineConfig)({
    root: './media',
    build: {
        outDir: './media',
        emptyOutDir: false,
        rollupOptions: {
            input: {
                sketching: (0, path_1.resolve)(__dirname, 'media/sketching-app.tsx'),
            },
            output: {
                entryFileNames: 'sketching.js',
                assetFileNames: '[name][extname]',
            },
        },
        sourcemap: false,
        minify: true,
        manifest: false,
        target: 'esnext',
    },
    plugins: [(0, plugin_react_1.default)()],
});
//# sourceMappingURL=vite.config.js.map