var service = require('../index')('maf-rest-service', {init: false});

service.di = {
    test: 100500
};

service.initApp();

service.app.use(function (req, res, next) {
    req.test = 100500;
    next();
});

const joi = service.joi;

service.addMethods({
    'GET /test1': {
        schema: {
            query: joi.object().required().keys({
                id: joi.string().required()
            })
        },

        middlewares: [
            function (req, res, next) {
                if (req.query.id > 1) {

                    return res.badRequest({
                        message: 'invalid id',
                        code: 'BAD_REQUEST'
                    });

                } else {

                    return next();
                }

            }
        ],

        handler: function (req, res) {
            res.result(req.di.test);
        }
    },
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
