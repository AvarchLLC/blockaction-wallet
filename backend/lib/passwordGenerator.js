'use strict';

const bcrypt = require('bcrypt');
const crypto = require('crypto');

module.exports ={
    generateSalt:()=>{
        let date = new Date()
        date = JSON.stringify(Math.floor(date/1000));
        return new Promise((resolve,reject)=>{
            bcrypt.genSalt(12,(err,salt)=>{
                bcrypt.hash(date,salt,(err,hash)=>{
                    if(hash){
                        resolve(hash)
                    }
                })
            })
        }).catch((error)=>{
            console.log(error);
        })

        // req.userDetail.passwordSalt = passwordSalt

    },

    generatePassword: (passphrase,passwordSalt)=>{
        return new Promise((resolve,reject)=>{
          bcrypt.hash(passphrase,passwordSalt,(err,hash)=>{
              if(hash){
                  resolve(hash)
              }
          })
        }).catch((e)=>{
            console.log(e)
        })
    }
}
