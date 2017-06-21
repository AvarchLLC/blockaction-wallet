/**
 * Created by sazack on 6/21/17.
 */

const util = require('util');

module.exports = {
    respond:(req,res,next)=>{
        res.json(req.cdata)
    },
    error:(err,req,res,next)=>{
        if(!err){
            err = new Error('An Error has occured');
        }
        let code = err.status || 500

        if(process.env.NODE_ENV !=='test'){
            console.log(util.format('Error [%s]:%s', req.url, err.message || err));
        }
        if(code !==404 && code !==403){
            if(err.stack){
                if(process.env.NODE_ENV !=='test'){
                    console.log(itil.inspect(err.stack));
                }
            }
        }
        if (err.code === 'ETIMEDOUT' || err.code === 'ENOTFOUND') {
            err.message = 'Error connecting upstream servers, please try again later.'
        }

        if(req.method ==='POST'){
            if(err.status ===403){
                err.message('Session Expired, Please login to continue')
            }
        }
        if (code === 401) {
            res.status(401).send()
        } else {
            res.status(code).json({
                result: 'failure',
                success: 0,
                error: 1,
                errorMsg: err.message || err,
                statusCode: code
            })

        }
    }
}