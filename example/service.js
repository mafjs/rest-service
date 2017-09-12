var service = require('../index')('maf-rest-service');


service.initApp();

service.app.use(function (req, res, next) {
    req.test = 100500;
    next();
});

service.addMethods({
    'GET /test': function (req, res) {
        res.result(req.test);
    }
});

service.initRest()
    .then(() => {
        return service.listen();
    })
    .then(() => {
        service.logger.info('ready');
    })
    .catch((error) => {
        service.logger.error(error);
    });
