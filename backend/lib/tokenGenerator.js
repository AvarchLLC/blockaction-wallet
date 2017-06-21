/**
 * Created by sazack on 6/21/17.
 */

const jwt = require('jsonwebtoken');
const jwtConfig = require('../config/config').jwt
module.exports = {
    generateJWT: (credentials)=>{
        let token = jwt.sign({data:credentials},jwtConfig.jwtSecret,{expiresIn:jwtConfig.expiresIn});
        if(token){
            return token
        }
        else{
            new Error("Unexpected Error occurred while generating token")
        }
    }
}

