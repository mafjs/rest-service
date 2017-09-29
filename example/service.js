const service = require('../index')('maf-rest-service', { init: false });

service.di = {
    test: 100500
};

service.initApp();

service.app.use((req, res, next) => {
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
            function testMiddleware(req, res, next) {
                if (req.query.id > 1) {
                    return res.badRequest({
                        message: 'invalid id',
                        code: 'BAD_REQUEST'
                    });
                }

                return next();
            }
        ],

        handler(req, res) {
            res.result(req.di.test);
        }
    },
    'GET /test': function testGet(req, res) {
        res.result(req.test);
    }
});

service.initRest()
    .then(() => service.listen())
    .then(() => {
        service.logger.info('ready');
    })
    .catch((error) => {
        service.logger.error(error);
    });
