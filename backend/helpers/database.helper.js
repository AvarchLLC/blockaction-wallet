(function (databaseHelper) {

    'use strict';

    var Promise = require("bluebird"),
        dbConfig = require('../config/database.config'),
        HTTPStatus = require('http-status'),
        errorHelper = require('./error.helper'),
        messageConfig = require('../config/api.message.config'),
        path = require('path'),
        mongoose = Promise.promisifyAll(require('mongoose'));

    databaseHelper.init = function (app) {

        var dbUrl = '';
          //  defaultUserStatusController = require('../controllers/app.default.user.server.controller');

        if (app.get('env') === "development") {
            dbUrl = "mongodb://" + dbConfig.development.username + ":" + dbConfig.development.password + "@" + dbConfig.development.host + ":" + dbConfig.development.port + "/" + dbConfig.development.dbName;
        }
        else if (app.get('env') === "production") {
            dbUrl = "mongodb://" + dbConfig.production.username + ":" + dbConfig.production.password + "@" + dbConfig.production.host + ":" + dbConfig.production.port + "/" + dbConfig.production.dbName;
        } else if (app.get('env') === "test") {
            dbUrl = "mongodb://" + dbConfig.test.username + ":" + dbConfig.test.password + "@" + dbConfig.test.host + ":" + dbConfig.test.port + "/" + dbConfig.test.dbName;
        }
        var options = {promiseLibrary: require('bluebird')};
        mongoose.Promise = require('bluebird');
        mongoose.connect(dbUrl, options);

        var db = mongoose.connection;

        // CONNECTION EVENTS
        // When successfully connected

        db.on('connected', function () {
            console.log('Mongoose default connection open to ' + dbUrl);
        });

        // When the connection is disconnected
        db.on('disconnected', function () {
            console.log('Mongoose default connection disconnected');
        });

        // If the connection throws an error
        db.on('error', function (err) {
            console.log('Mongoose default connection error: ' + err);
        });

        // If the Node process ends, close the Mongoose connection
        process.on('SIGINT', function () {
            mongoose.connection.close(function () {
                console.log('Mongoose default connection disconnected through app termination');
                process.exit(0);
            });
        });
    };

})(module.exports);