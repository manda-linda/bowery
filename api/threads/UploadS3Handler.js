const aws = require('aws-sdk');
const fs = require('fs');
const { Throttle } = require('stream-throttle');
const config = require('../../configuration.json');

setup();

function setup() {
    aws.config.update(config.AWSConfig);
    const s3 = new aws.S3();

    process.on('message', (msg) => {
        const { image } = msg;
        if (image) {
            uploadImageToS3(s3, image, config.retries);
        }
    });
    notifyReadyForRequest();
}

function uploadImageToS3(s3, {filename, location}, retries) {
    const throttle = config.networkThrottle / config.parallelUploads;
    const throttler = new Throttle({rate: throttle * 125000}); // @conversion of mbps to Bps
    const params = {
        Bucket: config.AWSBucket,
        Key: filename,
        Body: fs.createReadStream(location).pipe(throttler)
    }
    s3.upload(params, (err) => {
        throttler.end();
        if (err && retries) {
            console.log(err)
            console.log(`Retrying ${filename} with ${retries} remaining retries`);
            uploadImageToS3(s3, {filename, location}, retries--);
            return;
        } else if (err) {
            console.log(err);
            console.log(`Error uploading ${filename}`);
        } else {
            // only deleting the local file if there was no upload error
            fs.unlink(location, (err) => {
                if (err) {
                    console.log(err);
                }
            });
        }
        notifyReadyForRequest();
    });
}
function notifyReadyForRequest() {
    process.send({
        dequeue: true
    });
}