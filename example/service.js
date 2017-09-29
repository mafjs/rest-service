var service = require('../index')('maf-rest-service');


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

        // middlewares: [
        //     function (req, res) {
        //         res.badRequest({message: 'test'});
        //     }
        // ],

        handler: function (req, res) {
            res.json('test1');
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
