

const email = require('../lib/mailer');
const Collect = require('../lib/collect')

module.exports = {
    collectToEmail: (req,res,next)=>{
        let collectInsance = new Collect();
        collectInsance.setBody([
            'email',
            'message'
        ])

        collectInsance.setMandatoryFields({
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

    report:(req,res,next)=>{
        let options            = { content : {} };
        options.template       = 'report-feedback';
        options.content.header = req.feedbackData.email;
        options.content.body   = req.feedbackData.message;
        options.receiver       = 'support@blockaction.io';
        
        // sending meail to support@blockaction.io
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
