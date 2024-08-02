'use strict';

var path = require('path');
var fs = require('fs');
var rollup = require('rollup');
var typescript = require('@rollup/plugin-typescript');
var node_resolve = require('@rollup/plugin-node-resolve');
var commonjs = require('@rollup/plugin-commonjs');
var worker_threads = require('worker_threads');
var node_path = require('node:path');
var promises = require('node:fs/promises');
require('log4js');

function _interopNamespaceDefault(e) {
    var n = Object.create(null);
    if (e) {
        Object.keys(e).forEach(function (k) {
            if (k !== 'default') {
                var d = Object.getOwnPropertyDescriptor(e, k);
                Object.defineProperty(n, k, d.get ? d : {
                    enumerable: true,
                    get: function () { return e[k]; }
                });
            }
        });
    }
    n.default = e;
    return Object.freeze(n);
}

var fs__namespace = /*#__PURE__*/_interopNamespaceDefault(fs);

/*
 * @Author: xiangkun.sun xiangkun.sun@appshahe.com
 * @Date: 2023-03-21 09:31:11
 * @LastEditors: xiangkun.sun xiangkun.sun@appshahe.com
 * @LastEditTime: 2023-08-14 10:25:10
 * @FilePath: \MWScriptBuild-Rollup\src\genEntry.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
const ignorePaths = new Set([
    "node_modules",
    "typings",
    "dist",
    "Plugins",
]);
async function genEntry(projectDir, sourceList) {
    const imports = [];
    const exports = [];
    const fileMapping = [];
    for (let i = 0; i < sourceList.length; ++i) {
        const filePath = sourceList[i];
        const index = i;
        const path = filePath.substring(0, filePath.length - 3).replaceAll("\\", "/");
        imports.push(`import * as foreign${index} from './${path}';`);
        const metaFilePath = node_path.join(projectDir, filePath) + ".meta";
        if (!fs.existsSync(metaFilePath)) {
            continue;
        }
        const metaStr = await promises.readFile(metaFilePath, "utf8");
        const guid = metaStr.match(/"Guid":"(\w+?)"/);
        if (!guid) {
            continue;
        }
        exports.push(`     '${guid[1]}': foreign${index},`);
        fileMapping.push(`[foreign${index} || {}, "${node_path.basename(path)}"]`);
    }
    const virtualEntry = `${imports.join("\n")}\nexport const MWModuleMap = { \n${exports.join("\n")}\n}\nexport const MWFileMapping = new WeakMap([${fileMapping.join(",\n")}])`;
    // logger && logger.log(`virtualEntry: ${virtualEntry}`);
    return virtualEntry;
}
async function getSourceList(projectPath, dirPath = "") {
    const typeScripts = [];
    const dir = await promises.opendir(node_path.join(projectPath, dirPath));
    if (!dir) {
        console.error(`open dir[${dirPath}] fail`);
        return typeScripts;
    }
    for await (const dirent of dir) {
        const subPath = node_path.join(dirPath, dirent.name);
        const lowerFileName = dirent.name.toLowerCase();
        // logger.log(`lowerFileName: ${lowerFileName}`);
        if (!lowerFileName.startsWith(".")) {
            if (dirent.isFile() && lowerFileName.endsWith(".ts") && !lowerFileName.endsWith(".d.ts")) {
                typeScripts.push(subPath);
            }
            else if (dirent.isDirectory() && !ignorePaths.has(dirent.name)) {
                typeScripts.push(...await getSourceList(projectPath, subPath));
            }
            else ;
        }
    }
    return typeScripts;
}

const tsconfigName = "tsconfig.json";
function isDirectory(path) {
    try {
        const stats = fs__namespace.statSync(path);
        return stats.isDirectory();
    }
    catch (error) {
        // 处理错误，比如路径不存在
        console.error('Error:', error);
        return false;
    }
}
function getTsconfigPath(projectPath) {
    if (isDirectory(projectPath)) {
        const tsconfigPath = path.join(projectPath, tsconfigName);
        if (fs__namespace.existsSync(tsconfigPath)) {
            return tsconfigPath;
        }
    }
    return "";
    // return getTsconfigPath(path.dirname(projectPath));
}
const warningCodes = new Set([
    "CIRCULAR_DEPENDENCY"
]);
function renderWarning(warning) {
    const type = warning.code && warningCodes.has(warning.code) ? "Warn" : "Error";
    if (type == "Warn") {
        return "";
    }
    warning.message = warning.message.replaceAll("\u0000", "");
    let msg = warning.message.replace("@rollup/plugin-typescript ", "");
    if (msg.indexOf("MWPlugin") > -1) {
        return "";
    }
    const loc = warning.loc ? `${warning.loc.file}:${warning.loc.line}:${warning.loc.column}` : "";
    //logger && logger.log(`renderWarning: ${warning.code}, ${warning.message}, ${loc}`);
    if (loc && warning.frame) {
        // msg = `${msg} at ${loc}\n${warning.frame}`;
        msg = `${msg} at ${loc}`;
    }
    return `${msg}[${type}]\n`;
}
function mwbuild(sourceList) {
    return {
        name: "mwbuild",
        resolveId: function (source, importer) {
            if (source.endsWith(virtualEntry)) {
                return source;
            }
            if (importer?.endsWith(virtualEntry)) {
                const path$1 = path.resolve(projectPath, source);
                //logger && logger.log(`mwbuild path: ${path}`);
                for (const suffix of [".ts", ".TS"]) {
                    if (fs__namespace.existsSync(path$1 + suffix)) {
                        return path$1 + suffix;
                    }
                }
            }
            return null;
        },
        load(id) {
            if (id.endsWith(virtualEntry)) {
                return genEntry(projectPath, sourceList);
            }
            return null;
        }
    };
}
let virtualEntry = "mw-virtual-entry";
let projectPath = "";
let tslibPath = "";
function getTslibPath(inProjectPath) {
    tslibPath = inProjectPath.split("MetaWorldSaved")[0];
    tslibPath = path.join(tslibPath, "WindowsNoEditor/MW/Content/BuildTool/node_modules/tslib");
    // console.log(`tslibPath: ${tslibPath}`);
}
async function build(inProjectPath) {
    projectPath = inProjectPath;
    getTslibPath(inProjectPath);
    let tsconfigPath = getTsconfigPath(projectPath);
    if (!tsconfigPath) {
        console.error(`tsconfigPath not exists: ${projectPath}`);
        return "";
    }
    let sourceList = await getSourceList(projectPath);
    let errMsg = "";
    try {
        let rollupBuild = await rollup.rollup({
            input: virtualEntry,
            plugins: [
                sourceList.length > 0 && mwbuild(sourceList),
                node_resolve(),
                commonjs(),
                typescript({
                    compilerOptions: {
                        paths: {
                            tslib: [tslibPath],
                        }
                    },
                    tsconfig: tsconfigPath,
                    outputToFilesystem: true,
                }),
            ],
            cache: true,
            onwarn: function (warning) {
                errMsg += `${renderWarning(warning)}`;
            },
        });
        let output = {
            file: path.join(projectPath, "dist", "game.js"),
            format: "cjs",
            sourcemap: "inline",
        };
        await rollupBuild.write(output);
    }
    catch (e) {
        if (e.id && e.loc) {
            errMsg = `${e} at ${e.loc.file}:${e.loc.line}:${e.loc.column}`;
        }
        else {
            errMsg = `${e}`;
        }
    }
    // errMsg && console.error(`build msg: ${errMsg}`);
    return errMsg;
}
(async () => {
    // 接收主线程发送的消息
    worker_threads.parentPort && worker_threads.parentPort.on('message', async (message) => {
        let msg = await build(message);
        worker_threads.parentPort && worker_threads.parentPort.postMessage(msg);
    });
})();
