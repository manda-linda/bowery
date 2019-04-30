const fs = require('fs');
const path = require('path');
const zlib = require('zlib');

class LocalImageStorageHandler {
    constructor(storagePath) {
        this.storagePath = this.initializeStoragePath(storagePath);
    }

    // gzips and stores files assuming base64 encoding
    // could move these operations to a forked process to free up the request handling thread
    store(name, imageBinary, cb) {
        const filename = name + '.gz';
        const location = path.resolve(this.storagePath + '/' + filename);
        const imageBuffer = new Buffer(imageBinary, 'base64');
        zlib.gzip(imageBuffer, (err, data) => {
            fs.writeFile(location, data, (err) => {
                if (!err) {
                    cb && cb({
                        location,
                        filename,
                        encoding: 'gzip'
                    });
                }
            });
        });
    }

    initializeStoragePath(path) {
        if (!fs.existsSync(path)) fs.mkdirSync(path); 
        return path;
    }

    // @TODO - on startup should check for files in the storagePath. This is used by the DequeueHandler to re-enqueue files that
    // may have been missed or lost if the service crashes. 
    // Will return type = {
    //     location,
    //     filename,
    //     encoding: 'gzip'
    // }[]
    getFilesForUpload() {
        return [];
    }
}
exports.LocalImageStorageHandler = LocalImageStorageHandler;