import path from "node:path";
import fs from "node:fs";
import typescriptRollupPlugin from "rollup-plugin-ts";
import flatDtsPlugin from "rollup-plugin-flat-dts";

function updateReadmeVersion() {
    return {
        name: 'update-readme-version',
        buildStart() {
            const packageJsonPath = path.resolve('package.json');
            const readmePath = path.resolve('README.md');

            if (!fs.existsSync(packageJsonPath) || !fs.existsSync(readmePath)) {
                return;
            }

            const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, {encoding: 'utf8'}));
            const readmeContent = fs.readFileSync(readmePath, {encoding: 'utf8'});

            const version = `v${packageJson.version}`;
            const updatedReadme = readmeContent.replace(/^[vV]\d+\.\d+\.\d+(?<= *)/gm, `${version}  `);

            fs.writeFileSync(readmePath, updatedReadme, {encoding: 'utf8'});
            console.log(`README.md version updated to ${version}`);
        }
    };
}

export default [{
    input: ["./GodModService.ts"],
    output: {
        dir: "./dist",
        format: "esm",
        sourcemap: true,
        preserveModules: true,
        preserveModulesRoot: "./",
        assetFileNames: "[name][extname]",
    },
    plugins: [
        typescriptRollupPlugin(),
        flatDtsPlugin({
            lib: false,
        }),
        updateReadmeVersion(),
    ],
    external: [
        fileName => /\.meta$/.test(fileName),
    ],
}];
