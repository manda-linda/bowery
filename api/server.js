
const express = require('express'),
  app = express(),
  port = process.env.PORT || 3000;
const bodyParser = require('body-parser')
const config = require('../configuration.json');
const { UploadRequestHandler } = require('./services/UploadRequestHandler');

const apiRequestHandler = new UploadRequestHandler(config);

app.listen(port);
// Could maybe change the api away from accepting JSON or find more performant alternative to this middleware
app.use(bodyParser.json({limit: '10mb', extended: true}))

app.route('/upload')
    .put(apiRequestHandler.handleImageUploadRequest);
    