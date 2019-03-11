// @ts-check
const { readFileSync, appendFileSync, closeSync, openSync } = require('fs');
const { join } = require('path');

const attachPaths = (fileName) => {
    return join(process.cwd(), 'build', 'injected-dev', fileName);
}

const readFileData = (filePath) => {
    return readFileSync(filePath, { encoding: 'utf8' });
}

const createFile = (filePath) => {
    closeSync(openSync(filePath, 'w'));
}

const concatFiles = (files, destination) => {
    return new Promise((res, rej) => {
        const filePaths = files.map((filename) => attachPaths(filename));
        const destinationPath = attachPaths(destination);
        createFile(destinationPath);
        for (const filePath of filePaths) {
            const fileData = readFileData(filePath)
            appendFileSync(destinationPath, fileData);
        }
        res();
    })
}

class LetzNavConcatPlugin {
    constructor(config) {
        this.files = config.files;
        this.output = config.output;
    }

    apply(compiler) {
        compiler.hooks.done.tapPromise('LetzNavConcatPluginDone', compilation => {
            return new Promise((resolve, reject) => {
                concatFiles(this.files, this.output).then(() => {
                    resolve();
                })
            });
        });
    }
}

module.exports = LetzNavConcatPlugin;