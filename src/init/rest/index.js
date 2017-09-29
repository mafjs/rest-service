const Rest = require('maf-rest');

module.exports = function restServiceInitRest(logger) {
    const rest = new Rest(logger.getLogger('rest'));

    return rest;
};
