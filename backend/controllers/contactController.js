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
            message     : 'Message is required'

        })
        collectInsance.collect(req).then((data)=>{
            req.contactData = data
            next();
        }).catch((e)=>{
            e.status = 400;
            next(e);
        })
    },

    contact:(req,res,next)=>{
        let options            = { content : {} };
        options.template       = 'contact';
        options.content.title  = req.contactData.firstName +" "+ req.contactData.lastName;
        options.content.header = req.contactData.email;
        options.content.body   = req.contactData.message;
        options.receiver       = 'contact@blockaction.io';
        
        // sending the contact information to contact@blockaction.io
        email.sendMail(options,(error,response)=>{
            if(error){
                next(error);
            }
            else{
                req.cdata = response;
                next();
            }
        });

        // sending the response message to the sender

        options.template       = 'thankyoucontact';
        options.receiver       = req.contactData.email;

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
