

const root = require('app-root-path')

const email ={
    sender:'Block Action <your email address>',
    host:'smtp.gmail.com',
    port: 465,
    auth:{
        user:'',
        pass:''
    },
    template:{
        dir: root +'/resources/templates/',
        type:'ejs'
    }

}

module.exports = email;
