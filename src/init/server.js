const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const rfs = require('rotating-file-stream');

/**
 * @private
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

/**
 * @private
 * @param {Logger} logger
 * @param {Config} config
 * @param {Object} di
 * @return {Express}
 */
module.exports = function restServiceInitServer(logger, config, di) {
    const app = express();

    app.disable('x-powered-by');
    app.disable('etag');
    app.set('trust proxy', 'loopback, uniquelocal');

    const accessLog = config.get('accessLog');

    if (typeof accessLog.path === 'string') {
        logger.info(`accessLog path = ${accessLog.path}`);

        let accessLogFormat = accessLog.format;

        if (Array.isArray(accessLogFormat)) {
            accessLogFormat = accessLogFormat.join('\t');
        }

        app.use(morgan(accessLogFormat, {
            stream: initRotateStream(logger.getLogger('access-log'), accessLog)
        }));
    } else {
        logger.info('accessLog off, set accessLog.path in config');
    }

    app.use(cors(config.get('cors')));

    app.use((req, res, next) => {
        req.di = di;
        next();
    });

    return app;
};
