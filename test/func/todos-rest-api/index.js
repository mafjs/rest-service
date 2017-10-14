// create: curl -s -XPOST -d '{"title": "test"}' http://localhost:3000/api/todos
// list: curl -s http://localhost:3000/api/todos
// one: curl -s http://localhost:3000/api/todos/1
// remove: curl -s -XDELETE http://localhost:3000/api/todos/1

module.exports = () => {
    const service = require(`${__dirname}/../../../index.js`)('myservice', {logLevel: 'error'});

    service.logger.level('error');

    service.setEndpoint('/api');

    const todosApi = require(`${__dirname}/todosApi`);

    service.di = {
        api: {
            todos: todosApi
        }
    };

    const joi = service.joi;

    service.addMethods({
        // create todo
        'POST /todos': {
            schema: {
                body: joi.object()
                        .required()
                        .keys({title: joi.string().required()})
            },

            handler(req, res) {
                const data = req.di.api.todos.create(req.body);
                res.result(data);
            }
        },

        // search todos
        'GET /todos': {
            schema: {
                query: joi.object().keys({
                    limit: joi.number().integer().positive().min(1).max(100)
                              .default(5),
                    skip: joi.number().integer().positive().min(0).max(100)
                             .default(0)
                })
            },

            handler(req, res) {
                const limit = req.query.limit;
                const skip = req.query.skip;

                req.logger.debug({limit, skip}, 'searching todos');

                const data = req.di.api.todos.find(limit, skip);

                res.result(data);
            }
        },

        // get todo by id
        'GET /todos/:id': {
            schema: {
                path: joi.object().required()
                            .keys({id: joi.number().required()})
            },

            handler(req, res) {
                const todo = req.di.api.todos.getOne(req.params.id);

                if (!todo) {
                    return res.notFound({
                        message: 'todo not found',
                        code: 'NOT_FOUND'
                    });
                }

                return res.result(todo);
            }
        },

        'DELETE /todos/:id': {
            schema: {
                path: joi.object().required()
                         .keys({id: joi.number().required()})
            },

            handler(req, res) {
                const todo = req.di.api.todos.remove(req.params.id);

                if (!todo) {
                    return res.notFound({
                        message: 'todo not found',
                        code: 'NOT_FOUND'
                    });
                }

                return res.result(true);
            }
        }
    });

    service.init();
    service.initRestMethods();

    // service.start();

    return service;
};
