'use strict';

var path = require('path');
var fs = require('fs');
var worker_threads = require('worker_threads');

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

const args = process.argv.slice(2);
const projectPath = args[0] || "";
const buildPath = args[1] || "";
(async () => {
    let files = fs__namespace.readdirSync(projectPath);
    let compilePrijectNum = 0;
    console.log(`开始编译`);
    files.forEach(file => {
        const dirPath = path.join(projectPath, file);
        const filePath = path.join(dirPath, ".project");
        if (fs__namespace.existsSync(filePath)) {
            // console.log(`开始编译: ${dirPath}`);
            compilePrijectNum++;
            let worker = new worker_threads.Worker(buildPath);
            // 接收 Worker 发送的消息
            worker.on("message", (message) => {
                if (message) {
                    console.error(`编译失败: ${dirPath} ${message}`);
                }
                compilePrijectNum--;
                if (compilePrijectNum == 0) {
                    console.log(`编译完成!!!`);
                }
            });
            // 向 Worker 发送消息
            worker.postMessage(dirPath);
        }
    });
})();
