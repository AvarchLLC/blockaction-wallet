
'use strict';
let dotenv = require('dotenv');

dotenv.config();

module.exports = {
    port: process.env.PORT || 1234,
    jwt:{
        jwtSecret:'YouShallNotPass',
        expiresIn: 60*60
    }
}