var express = require('express');
var cors = require('cors');
var morgan = require('morgan');
var rfs = require('rotating-file-stream');

module.exports = function (logger, config, di) {
    var app = express();

    app.disable('x-powered-by');
    app.disable('etag');
    app.set('trust proxy', 'loopback, uniquelocal');

    var accessLog = config.get('accessLog');

    var accessLogFormat = accessLog.format;

    if (Array.isArray(accessLogFormat)) {
        accessLogFormat = accessLogFormat.join('\t');
    }

    app.use(morgan(accessLogFormat, {
        stream: initRotateStream(logger.getLogger('access-log'), accessLog)
    }));

    app.use(cors(config.get('cors')));

    app.use(function (req, res, next) {
        req.di = di;
        next();
    });

    return app;
};


/**
 * @param {Logger} logger
 * @param {Object} config
 * @return {Stream}
 */
function initRotateStream (logger, config) {

    var stream = rfs(config.filename, {
        interval: config.rotateInterval,
        path: config.path
    });

    stream.on('error', (error) => {
        logger.error(error);
    });

    return stream;
}
