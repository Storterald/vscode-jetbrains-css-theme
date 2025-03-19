const esbuild = require("esbuild");
const glob = require("glob");

const production = process.argv.includes('--production');

esbuild.build({
        entryPoints: ["src/extension.ts"],
        bundle: true,
        outdir: "build",
        format: "cjs",
        minify: production,
        sourcemap: !production,
        sourcesContent: false,
        platform: 'node',
        target: "es2018",
        external: ["vscode", "vscode-cmake-tools", "path", "fs"],
        sourcemap: true
}).catch(() => process.exit(1));

const files = glob.sync("ts/**/*.ts")
        .filter(file => !file.includes("common.ts"));
esbuild.build({
        entryPoints: files,
        bundle: true,
        outdir: "js",
        format: "cjs",
        target: "es2018",
        sourcemap: true,
        outExtension: { ".js": ".js" }
}).catch(() => process.exit(1));
