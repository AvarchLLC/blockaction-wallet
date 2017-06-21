/**
 * Created by sazack on 6/4/17.
 */

'use strict';
let dotenv = require('dotenv');

dotenv.config();

module.exports = {
    port: process.env.PORT || 1234,
    jwt:{
        jwtSecret:'YouShallNotPass'
    }
}
