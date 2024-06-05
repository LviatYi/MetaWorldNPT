import typescriptRollupPlugin from "rollup-plugin-ts";
import ts from "typescript";
import copy from "rollup-plugin-copy";
import flatDtsPlugin from "rollup-plugin-flat-dts";

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

export default [{
    input: "./GToolkit.ts",
    output: [{
        file: "./dist/index.js",
        format: "esm",
        sourcemap: true,
        assetFileNames: "[name][extname]",
        plugins: [flatDtsPlugin({
            lib: false,
        })]
    },],
    external: ["util"],
    plugins: [
        typescriptRollupPlugin({transformers: {before: [labeledBlockRemover(["LEGACY"])]}}),
        copy({
            targets: [
                {src: './JavaScripts/util/README.md', dest: './dist'},
            ]
        })
        // terser(),
    ],
}];