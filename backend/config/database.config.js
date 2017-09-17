'use strict';

    module.exports = {
        development: {
            username: 'ebrwallet',
            password: 'ebrwallet',
            host: 'localhost',
            port: '27017',
            dbName: 'prj_ebrwallet'
        },
        production: {
            username: 'wallet',
            password: 'wallet',
            host: 'localhost',
            port: '27017',
            dbName: 'ebrwallet'
        },
        test: {
            username: 'ebrwalletuser',
            password: 'ebrwalletuser#NP',
            host: 'localhost',
            port: '27017',
            dbName: 'test_prj_ebrwallet'

        }
    };



