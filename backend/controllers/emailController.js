/**
 * Created by sazack on 7/23/17.
 */

const email = require('../lib/mailer');
const Collect = require('../lib/collect')


module.exports = {
    collectToEmail: (req,res,next)=>{
        let collectInsance = new Collect();
        collectInsance.setBody([
            'subject',
            'receiver',
            'content'
        ])

        collectInsance.setMandatoryFields({
            receiver: 'Email receiver is required'
        })
        collectInsance.collect(req).then((data)=>{
            req.emailData = data
            next();
        }).catch((e)=>{
            e.status = 400;
            next(e);
        })
    },
    subscribe:(req,res,next)=>{
        let options = req.emailData;
        options.template = 'subscribe'
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
    let options = req.emailData;
    options.template = 'requestether';

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

    }
}
