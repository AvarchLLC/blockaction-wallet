/**
 * Created by sazack on 7/23/17.
 */

const email = require('../lib/mailer');
const Collect = require('../lib/collect')


module.exports = {
    collectToEmail: (req,res,next)=>{
        let collectInsance = new Collect();
        collectInsance.setBody([
            'firstName',
            'lastName',
            'email',
            'message'
        ])

        collectInsance.setMandatoryFields({
            firstName   : 'First Name required',
            lastName    : 'Last Name required',
            email       : 'Email of sender is required',
            message     : 'Message is reaquired'
        })
        collectInsance.collect(req).then((data)=>{
            req.feedbackData = data
            next();
        }).catch((e)=>{
            e.status = 400;
            next(e);
        })
    },

    feedback:(req,res,next)=>{
        let options            = { content : {} };
        options.template       = 'feedback';
        options.content.title  = req.feedbackData.firstName +" "+ req.feedbackData.lastName;
        options.content.header = req.feedbackData.email;
        options.content.body   = req.feedbackData.message;
        options.receiver       = 'support@blockaction.io';
        email.sendMail(options,(error,response)=>{
            if(error){
                next(error);
            }
            else{
                req.cdata = response;
                next();
            }
        });

    }

}
