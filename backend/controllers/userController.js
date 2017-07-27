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
    const tokenModule = require('../lib/tokenGenerator');
    const email = require('../lib/mailer');


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
            req.userData.password = await(passwordModule.generatePassword(req.userData.password,req.userData.passwordSalt))

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

        }),

        collectToAuthenticate: (req,res,next)=>{
            let collectInstance = new collect();
            collectInstance.setBody([
                'username',
                'password'])

            collectInstance.setMandatoryFields({
                username: 'Username is not provided',
                password: 'password is not provided'
            })

            collectInstance.collect(req).then((data)=>{
                    req.userCredential = data
                    next();
            }).
                catch((err)=>{
                err.status =400
                next(err)
            })
        },

        authenticate: (req,res,next)=>{
            if(req.userCredential.username && req.userCredential.password){
                    User.findOne({
                        username: req.userCredential.username
                    }).then((data)=>{
                        if(data){
                            passwordModule.generatePassword(req.userCredential.password,data.passwordSalt).then((response)=>{
                                const token = tokenModule.generateJWT(data);
                                if(response == data.password && (token && token.length)){
                                    req.cdata = {
                                        success:1,
                                        message:"User Authenticated Successfully",
                                        token:token,
                                    }
                                    next();
                                }
                                else{
                                    req.cdata ={
                                        success:0,
                                        error:1,
                                        message:"Username/Password Invalid",
                                    }
                                    next();
                                }
                            })
                        }
                        else{
                            req.cdata ={
                                success:0,
                                error:1,
                                message:"Username/Password Invalid",
                            }
                            next();
                        }
                    })

            }
        },
        subscribe:(req,res,next)=>{
            let options = {};
            console.log(req.body)
            options.template = 'subscribe';
            options.receiver = req.body.receiver;
            options.subject = req.body.subject;

            email.sendMail(options,(error,response)=>{
                if(error){
                    next(error);
                }
                else{
                    req.cdata = response;
                    next();
                }
            });

        },

        requestEther: (req, res, next) => {
            let options = {};
            console.log(req.body)
            options.template = 'requestether';
            options.receiver = req.body.receiver;
            options.subject = req.body.subject;

            try {
                options.content = JSON.parse(req.body.content);
            } catch (err) {
                return next(err);
            }

            email.sendMail(options,(error,response)=>{
                if(error){
                    next(error);
                }
                else{
                    req.cdata = response;
                    next();
                }
            });

        },

    }