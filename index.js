// @ts-check
const { readFileSync, appendFileSync, closeSync, openSync } = require('fs');
const { join } = require('path');

const attachPaths = (fileName, buildPath) => {
    return join(process.cwd(), buildPath, fileName);
}

const readFileData = (filePath) => {
    return readFileSync(filePath, { encoding: 'utf8' });
}

const createFile = (filePath) => {
    closeSync(openSync(filePath, 'w'));
}

const concatFiles = (files, destination, buildPath) => {
    return new Promise((res, rej) => {
        const filePaths = files.map((filename) => attachPaths(filename, buildPath));
        const destinationPath = attachPaths(destination, buildPath);
        createFile(destinationPath);
        for (const filePath of filePaths) {
            const fileData = readFileData(filePath)
            appendFileSync(destinationPath, fileData);
        }
        res();
    })
}

class WebPackConcatPlugin {
    constructor(config) {
        this.files = config.files;
        this.output = config.output;
        this.buildPath = config.buildPath.join().replace(",", "/")
    }

    apply(compiler) {
        compiler.hooks.done.tapPromise('LetzNavConcatPluginDone', compilation => {
            return new Promise((resolve, reject) => {
                concatFiles(this.files, this.output, this.buildPath).then(() => {
                    resolve();
                })
            });
        });
    }
}

module.exports = WebPackConcatPlugin;