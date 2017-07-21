/**
 * Created by sazack on 7/21/17.
 */

const econfig = require('../config/email.config');
const emailTemplate = require('template-notify')(econfig, econfig.template);
const util = require('util');
module.exports = {
    sendMail: (options,cb)=>{
        if(options){
            let emailOptions = {
                template: options.template,
                subject: options.subject,

            }
            if(options.url){
                emailOptions.url = options.url;
            }
            if(options.receiver) {
                emailOptions.receiver = options.receiver
            }
            switch (emailOptions.template){
                case 'etherrequest':
                    emailOptions.url = util.format(options.url);
                    break;
                default:
            }
            emailTemplate.email.send(emailOptions.receiver,emailOptions,(err,response)=>{
                if(err) cb(err);
                cb(null,response);
            })
        }

        else{
            cb("No emailing details provided");
        }

    }
}



