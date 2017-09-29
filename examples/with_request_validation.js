const service = require('../')('myservice');

const joi = service.joi;

service.addMethods({
    'GET /todos': {
        schema: {
            query: joi.object().keys({
                limit: joi.number().integer()
                    .min(1)
                    .max(5)
                    .default(5)
            })
        },

        handler: (req, res) => {
            const todos = [1, 2, 3, 4, 5];

            res.result(todos.slice(0, req.query.limit));
        }
    }
});

service.start();

// curl -v http://localhost:3000/todos
// curl -v http://localhost:3000/todos?limit=3
// curl -v http://localhost:3000/todos?limit=10
