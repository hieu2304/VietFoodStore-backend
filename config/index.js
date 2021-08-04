let config = {};

config.development = {
    mysql: {
        connectionLimit: 500,
        host: '127.0.0.1',
        port: 3306,
        user: 'root',
        password: '123456',
        database: 'vietfoodstore',

    },
    auth:{
        tokenSecretKey:'!@#$%^&*()',
        refreshTokenSecretKey:'K5HASDCBK',
    }
};

config.environment = 'development';
module.exports = config;