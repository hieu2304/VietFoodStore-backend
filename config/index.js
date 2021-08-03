'use strict';
export default {
    environment: 'test',
    http: {
        host: 'localhost',
        port: 4001,
    },
    https: {
        host: 'localhost',
        port: 8001,
    },
    mysql: {
        connectionLimit: 500,
        host: "172.27.219.10",
        user: "dev",
        password: "12345",
        database: "VietFood"
    },
    jwt: {
        token_secret: 'OTS-.HB|evPcIHZ9IDu=',
        token_life: '7D',
        refresh_token_life: '30D',
        refresh_token_secret: 'OTS-~>0H*6d9Km9Ny#s1R',
        algorithms: 'HS256',
    }
};