/**
 * Created by sazack on 6/4/17.
 */
'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const http = require('http');

let config = require('./config/config');
let routes = require('./routes');



let app = express();

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:false}));

app.use('/',routes)

let server = http.createServer(app);

server.listen(config.port);

server.on('error',(error)=>{
    if(error.syscall !== 'listen'){
        throw error
}

let bind = typeof config.port ==='string'
    ? 'Pipe' + config.port
    : 'port' + config.port


    switch(error.code){
        case 'EACCES':
            console.log(bind+ 'requires elevated privilege', {});
            process.exit(1)
            break;

        case 'EADDRINUSE':
            console.log(bind + 'is already in use', {});
            process.exit(1)
            break;

        default:
            throw error;
    }
})


server.on('listening', ()=>{
    let addr = server.address()
    let bind = typeof addr === 'string'
    ? 'pipe' + addr
        : 'port' + addr.port

    if(process.env.Node_ENV !== 'test') {
        console.log('Wallet Server listening on ' + bind, {})
    }

})

module.exports = app;
