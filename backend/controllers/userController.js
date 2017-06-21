/**
 * Created by sazack on 6/5/17.
 */

'use strict';
    const User = require('../models/userModel.js');
    const dataProvider = require('../helpers/mongo.provider.helper');
    const collect = require('../lib/collect')
    const passwordModule = require('../lib/passwordGenerator');
    const async = require('asyncawait/async');
    const await = require('asyncawait/await');


    module.exports = {
        collectToRegister: (req, res, next) => {
            let collectInstance = new collect();
            collectInstance.setBody([
                'firstName',
                'middleName',
                'lastName',
                'city',
                'state',
                'country',
                'email',
                'username',
                'password',
                'passwordSalt',
                'phone',
                'deleted',
                'userRole'

            ])

            collectInstance.setMandatoryFields({
                firstName: 'First Name not provided',
                lastName: 'Last Name not provided',
                email: 'Email not provided',
                username: 'Username not provided',
                password: 'Password not provided',
                city: 'City not provided',
                country: 'Country not provided',
                phone: 'Phone not provided'

            })

            collectInstance.collect(req).then((data) => {
                req.userData = data
                next();
            }).catch((err) => {
                err.status = 400
                next(err)
            })
        },

        register: async((req,res,next)=>{

            req.userData.passwordSalt = await(passwordModule.generateSalt());
            req.userData.password = await(passwordModule.generatePassword(req.userData.passwordSalt))

            let newUser = new User(req.userData)

            newUser.save((err,data)=>{
                if(err){
                    return next(err);
                }
                else{
                    req.cdata = {
                        success:1,
                        message:"User Registered Successfully",
                        data
                    }
                    next();
                }
            })

        })
    }