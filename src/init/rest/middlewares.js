module.exports = function (rest) {

    rest.setBeforeResponseMiddleware(function beforeResponseMiddleware (req, res) {

        if (!res.httpContext) {

            return res.status(404).json({
                error: {
                    message: 'resource not found',
                    code: 'RESOURCE_NOT_FOUND'
                }
            });

        }

        res.requestEnd();

        var context = res.httpContext;

        if (req.debug) {
            context.body.debug = {
                requestId: req.id,
                time: res.httpContext.time,
                // log: req.di.debug.get()
            };
        }

        res.json(context.body);

    });


    return rest;
};
