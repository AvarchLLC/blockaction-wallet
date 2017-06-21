/**
 * Created by sazack on 6/19/17.
 */

'use strict';
const sanitize = require('google-caja').sanitize;

module.exports = class collectClass {

    constructor(){
        this.body =[];
        this.query =[];
        this.params =[];
        this.mandatoryFields = [];
        this.files = [];
        this.providedFields=[];
        this.checkStatus= true;
    }
    setBody(body){
        this.body = body;
    }

    setQuery(query){
        this.query = query;
    }

    setParams(params){
        this.params = params;
    }

    setMandatoryFields(mandatoryFields){
        this.mandatoryFields = mandatoryFields;
    }

    setFiles(files){
        this.files = files;
    }

    setProvidedFields(providedFields){
        this.providedFields = providedFields;
    }

    setCheckStatus(status){
        this.status = status
    }

    group(req){
        return new Promise((resolve,reject)=>{
            try{
                var data ={};
                this.body.forEach((body)=>{
                    if(typeof(req.body[body] != 'undefined')){
                            data[body] = sanitize(req.body[body ])
                        }
                })

                this.query.forEach((query)=>{
                    if(typeof(req.query[query] != 'undefined')){
                            data[query] = sanitize(req.query[query])
                    }
                })

                this.params.forEach((params)=>{
                    if(typeof(req.params[params] != 'undefined')){
                        data[params] = sanitize(req.param[params])
                    }
                })

                this.files.forEach((files)=>{
                    if(typeof(req.files) !== 'undefined'){
                        if(typeof(req.files[files]) !== 'undefined'){
                            data[files] = sanitize(req.files[files]);
                        }
                    }
                })

                this.providedFields = data;
                resolve();
            }
            catch(e){
                reject(e)
            }
        })
    }


    check(){
        return new Promise((resolve,reject)=>{
            let errorArray=[];
            for (var entry in this.mandatoryFields){
                if(!this.providedFields[entry]){
                    errorArray.push(this.mandatoryFields[entry]);
                }
            }
            if(errorArray.length >0){
                reject(errorArray)
            }
            else{
                resolve();
            }
        })
    }

    collect(req){
      return new Promise((resolve,reject)=>{
          this.group(req).then(()=>{
              this.check().then(()=>{
                  resolve(this.providedFields)
              }).catch((err)=>{
                  reject(err)
              })
          })
      }).catch((err)=>{

      })
    }


}

