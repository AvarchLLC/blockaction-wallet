
(function () {

    'use strict';
    var mongoose = require('mongoose'),
        regex = require('./regex.server.model'),
        Schema = mongoose.Schema;

    var userSchema = new Schema({
        firstName: {
            type: String,
            required: true,
            trim: true
        },
        middleName: {
            type: String,
            trim: true
        },
        lastName: {
            type: String, trim: true
        },
        city:{
          type: String,
            trim:true,
            required:true
        },
        state:{
            type:String,
            trim:true
        },
        country: {
            type: String,
            trim: true,
            required:true
        },
        email: {
            type: String,
            required: true,
            trim: true,
            lowercase: true,
            validate: {
                validator: function (email) {
                    if (email) {
                        return regex.emailRegex.test(email);
                    } else {
                        return true;
                    }
                },
                message: '{VALUE} is not a valid email address!'
            }
        },
        username: {
            type: String,
            required: true,
            trim: true,
            lowercase: true
        },
        password: {
            type: String,
            trim: true
        },
        passwordSalt: {
            type: String
        },
        phone: {
            type: String,
            trim: true
        },
       ative: {
            type: Boolean,
            default: true
        },
        userRole: {
            type: String,
            trim: true,
            required: true
        },
        twoFactorAuthEnabled: {
            type: Boolean,
            default: false,
        },
        twoFactorAuthSharedSecret: {
            type: String,
            trim: true,
            default:null
        },
        deleted: {
            type: Boolean,
            default: false
        },
        deletedBy: {
            type: String,
            trim: true
        },
        deletedOn: {
            type: Date
        },
        blocked: {
            type: Boolean,
            default: false
        },
        blockedOn: {
            type: Date
        }
    });

    module.exports = mongoose.model('User', userSchema, 'User');

})();