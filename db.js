const knex = require('knex')({
    client: 'sqlite3',
    connection: {
        filename: './reports.sdb',
    },
    useNullAsDefault: true,
});

exports.knex = knex;
