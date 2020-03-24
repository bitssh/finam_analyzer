const knex = require('knex')({
    client: 'sqlite3',
    connection: {
        filename: './reports.sdb',
    },
});

exports.knex = knex;
