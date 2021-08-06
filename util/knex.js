const knex = require('knex');

const knexClient = knex({
    client: 'mysql',
    connection: {
        host: process.env.HOST_DB || '127.0.0.1',
        user: process.env.USER_DB || 'root',
        password: process.env.PASSWORD_DB || '123456',
        database: process.env.SCHEMA_DB ||'vietfoodstore'
    },
    pool: { min: 2, max: 50 }
});

knexClient.on('query', function (queryData) {
    console.log(`knex-mysql: ${queryData.sql}${queryData.bindings && queryData.bindings.length ? `\nparams: ${JSON.stringify(queryData.bindings)}` : ``}`);
});

module.exports = knexClient;


