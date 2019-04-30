const { fork } = require('child_process');

/**
 * This class handles spinning up and tearing down UploadHandlers and passing them images to upload.
 * In this approach, the UploadHandlers are forked child processes because we don't want them to block the main thread.
 * A drawback of this is that is each UploadHandler is its own process and handles its own throttling independently.
 * I may try a second version where only this DequeueHandler is a separate process and the UploadHandlers share a GroupThrottler
 * to maximize bandwidth usage.
 */
class DequeueHandler {
    constructor(storageHandler, configuration) {
        this.storageHandler = storageHandler;
        this.configuration = configuration;
        this.queue = this.storageHandler.getFilesForUpload();
        this.queue.forEach((storageInfo) => {
            this.enqueue(storageInfo);
        });
        this.children = 0;
    }

    enqueue(storageInfo) {
        this.queue.push(storageInfo);
        this.checkChildrenForUpload();
    }

    checkChildrenForUpload() {
        // If parallelUploads not reached, add additional child processes
        if (this.children < this.configuration.parallelUploads) {
            const child = fork('./api/threads/UploadS3Handler.js');
            this.children++;
            child.on('message', (msg) => {
                if (msg.dequeue) {
                    this.sendChildImage(child);
                }
            });
        }
    }

    sendChildImage(child) {
        if (this.queue.length) {
            child.send({
                image: this.queue.pop()
            });
        } else {
            child.disconnect();
            this.children--;
        }
    }
}

exports.DequeueHandler = DequeueHandler;