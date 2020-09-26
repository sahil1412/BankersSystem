const knex = require('./knex');

module.exports = {
    users: {
        All: function () {
            return knex('users');
        },
        One: function (id) {
            return knex('users').where('id', id);
        }
    }
}