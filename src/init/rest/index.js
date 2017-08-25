var Rest = require('maf-rest');

var middlewares = require('./middlewares');

module.exports = function (logger, config) {
    var rest = new Rest(logger.getLogger('rest'));

    middlewares(rest);

    return rest;
};
