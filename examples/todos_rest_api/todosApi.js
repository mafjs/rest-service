// TODOS API
let inc = 0;
const todos = {};

const todosApi = {
    create(raw) {
        inc += 1;

        const todo = raw;
        todo.id = inc;
        todos[inc] = todo;

        return todo;
    },

    getOne(id) {
        if (!todos[id]) {
            return null;
        }

        return todos[id];
    },

    find(limit, skip) {
        const keys = Object.keys(todos).slice(skip, limit);

        const result = [];

        keys.forEach((key) => {
            result.push(todos[key]);
        });

        return result;
    },

    remove(id) {
        if (!todos[id]) {
            return false;
        }

        delete todos[id];

        return true;
    },
};

module.exports = todosApi;
