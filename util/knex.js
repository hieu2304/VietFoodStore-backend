const knex = require('knex');

const knexClient = knex({
    client: 'pg',
    connection: {
    connectionString:process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
    }
});

knexClient.on('query', function (queryData) {
    console.log(`knex-mysql: ${queryData.sql}${queryData.bindings && queryData.bindings.length ? `\nparams: ${JSON.stringify(queryData.bindings)}` : ``}`);
});

module.exports = knexClient;


