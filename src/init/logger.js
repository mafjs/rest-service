const Logger = require('maf-logger');

/**
 * @private
 * @param {String} name
 * @param {String} configLogLevel
 * @return {Logger}
 */
module.exports = function restServiceInitLogger(name, configLogLevel) {
    const logger = Logger.create(name);

    let logLevel = 'INFO';

    if (typeof process.env.LOG_LEVEL === 'string') {
        logLevel = process.env.LOG_LEVEL;
    } else if (typeof configLogLevel === 'string') {
        logLevel = configLogLevel;
    } else if (process.env.NODE_ENV === 'production') {
        logLevel = 'INFO';
    } else {
        logLevel = 'DEBUG';
    }

    logger.info(`logLevel = ${logLevel}`);

    logger.level(logLevel);

    return logger;
};
