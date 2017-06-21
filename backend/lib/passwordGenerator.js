'use strict';

const bcrypt = require('bcrypt');
const crypto = require('crypto');

module.exports ={
    generateSalt:()=>{
        let date = new Date()
        date = JSON.stringify(Math.floor(date/1000));

            var sha = crypto.createHash('sha1');
            var preHash = sha.update(date)
            var passwordSalt = preHash.digest('hex')


        console.log("here",passwordSalt)
        return passwordSalt
        // req.userDetail.passwordSalt = passwordSalt

    },

    generatePassword: (passwordSalt)=>{
        // console.log("________",passwordSalt)
        return new Promise((resolve,reject)=>{
            bcrypt.hash(passwordSalt,10,(err,hash)=>{
                if(hash){
                    console.log("&&&&",hash)
                    // return hash
                    resolve(hash)
                }
                else if(err){
                    reject(err)
                }
                else{
                    reject("Password Module: Unexpected Error at Password Generator")
                }
            })
        })
    }
}
