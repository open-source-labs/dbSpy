"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const vite_1 = require("vite");
const dns_1 = __importDefault(require("dns"));
const plugin_react_1 = __importDefault(require("@vitejs/plugin-react"));
const fs = require('fs');
const path_1 = require("path");
dns_1.default.setDefaultResultOrder('verbatim');
exports.default = (0, vite_1.defineConfig)({
    server: {
        port: 8080,
        host: true,
        proxy: {
            '/api/': {
                target: 'http://localhost:3000/',
                changeOrigin: true,
                secure: false,
            }
        },
    },
    build: {
        outDir: 'dist',
        rollupOptions: {
            input: (0, path_1.resolve)(__dirname, 'index.html'),
        },
        commonjsOptions: {
            esmExternals: true,
        },
    },
    plugins: [
        (0, plugin_react_1.default)({
            include: '**/*.{jsx,tsx}',
        }),
    ],
});
//# sourceMappingURL=vite.config.js.map