# Throttled Image Uploads in Node

Before running, update configuration.json with the AWS credentials, S3 Bucket, and desired network throttle in mbps

To run this app on http://localhost:3000 run:

`npm install`

`npm start`

## Test

`curl -X PUT \
  http://localhost:3000/upload \
  -H 'Accept: */*' \
  -H 'Cache-Control: no-cache' \
  -H 'Connection: keep-alive' \
  -H 'Content-Type: application/json' \
  -H 'Host: localhost:3000' \
  -H 'Postman-Token: 05c83907-df28-47be-b5d7-9add6524b018,2c293caf-fdf6-40f4-9891-642fb95a13e9' \
  -H 'User-Agent: PostmanRuntime/7.11.0' \
  -H 'accept-encoding: gzip, deflate' \
  -H 'cache-control: no-cache' \
  -H 'content-length: 94945' \
  -d '{
    "image": "YOU_BASE64_ENCODED_IMAGE",
    "filename": "1556597314-763-plantId.jpg"
}'`

or

Link to a simple Postman collection for load testing: https://www.getpostman.com/collections/f9bbb9a5e5a2a607954a 
