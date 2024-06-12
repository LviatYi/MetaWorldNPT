import typescriptRollupPlugin from "rollup-plugin-ts";
import ts from "typescript";
import flatDtsPlugin from "rollup-plugin-flat-dts";
import path from "node:path";
import fs from "node:fs";

const labeledBlockRemover = labels => {
    return (context) => {
        const visitor = node => {
            if (ts.isLabeledStatement(node) && labels.includes(node.label.escapedText)) {
                return undefined;
            }
            return ts.visitEachChild(node, visitor, context);
        };

        return (sourceFile) => {
            ts.visitNode(sourceFile, visitor);
            return sourceFile;
        };
    };
};

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
            const updatedReadme = readmeContent.replace(/^[vV]\d+\.\d+\.\d+ */gm, `${version}  `);

            fs.writeFileSync(readmePath, updatedReadme, {encoding: 'utf8'});
            console.log(`README.md version updated to ${version}`);
        }
    };
}

export default [{
    input: "./Log4Ts.ts",
    output: [{
        file: "./dist/index.js",
        format: "esm",
        sourcemap: true,
        assetFileNames: "[name][extname]",
        plugins: [flatDtsPlugin({
            exclude: ["**/pic/**", "*.png"],
            lib: false,
        })]
    }],
    plugins: [
        typescriptRollupPlugin({transformers: {before: [labeledBlockRemover(["LEGACY"])]}}),
        updateReadmeVersion(),
        // terser(),
    ],
}];