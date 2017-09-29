const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const rfs = require('rotating-file-stream');

/**
 * @param {Logger} logger
 * @param {Object} config
 * @return {Stream}
 */
function initRotateStream(logger, config) {
    const stream = rfs(config.filename, {
        interval: config.rotateInterval,
        path: config.path
    });

    stream.on('error', (error) => {
        logger.error(error);
    });

    return stream;
}

module.exports = function restServiceInitServer(logger, config, di) {
    const app = express();

    app.disable('x-powered-by');
    app.disable('etag');
    app.set('trust proxy', 'loopback, uniquelocal');

    const accessLog = config.get('accessLog');

    let accessLogFormat = accessLog.format;

    if (Array.isArray(accessLogFormat)) {
        accessLogFormat = accessLogFormat.join('\t');
    }

    app.use(morgan(accessLogFormat, {
        stream: initRotateStream(logger.getLogger('access-log'), accessLog)
    }));

    app.use(cors(config.get('cors')));

    app.use((req, res, next) => {
        req.di = di;
        next();
    });

    return app;
};
