const Logger = require('maf-logger');

/**
 * @private
 * @param {String} name
 * @param {?Object} loggerConfig
 * @return {Logger}
 */
module.exports = function restServiceInitLogger(name, loggerConfig) {
    let logLevel = 'INFO';

    if (typeof process.env.LOG_LEVEL === 'string') {
        logLevel = process.env.LOG_LEVEL;
    } else if (typeof loggerConfig.level === 'string') {
        logLevel = loggerConfig.level;
    } else if (process.env.NODE_ENV === 'production') {
        logLevel = 'INFO';
    } else {
        logLevel = 'DEBUG';
    }

    const src = loggerConfig.src ? loggerConfig.src : false;

    const logger = Logger.create(name, {src});

    logger.level(logLevel);

    logger.info(`logLevel = ${logLevel}`);

    return logger;
};
