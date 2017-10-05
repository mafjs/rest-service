const Rest = require('maf-rest');

/**
 * @private
 * @param {Logger} logger
 * @return {Rest}
 */
module.exports = function restServiceInitRest(logger) {
    return new Rest(logger.getLogger('rest'));
};
