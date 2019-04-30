const { LocalImageStorageHandler } = require('./LocalImageStorageHandler');
const { DequeueHandler } = require('./DequeueHandler');

class UploadRequestHandler {
    constructor(config) {
        this.storageHandler = new LocalImageStorageHandler(config.localStoragePath);
        this.dequeueHandler = new DequeueHandler(this.storageHandler, config);
        this.handleImageUploadRequest = this.handleImageUploadRequest.bind(this);
    }

    handleImageUploadRequest(req, res) {
        const body = req.body;
        if (body && body.filename && body.image) {
            this.storageHandler.store(body.filename, body.image, (storageInfo) => {
                this.dequeueHandler.enqueue(storageInfo);
            });
        } else {
            res.status(422);
            res.send('Error: malformed upload request.');
        }
        res.end();
    }
}

exports.UploadRequestHandler = UploadRequestHandler;