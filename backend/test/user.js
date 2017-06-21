const expect = require('chai').expect;
const supertest = require('supertest');
let server = require('../server');

describe('user API tests ', function () {
    describe('for register',function () {
        it('should return an array of errors when mandatory fields are not provided', function (done) {
            supertest(app).
                post('/register').
                expect(400).
                end(function (err, response) {
                    if(err){
                        done(err)
                    }
                    else if(response){
                        let res = JSON.parse(JSON.parse(JSON.stringify(response)).text);
                        expect(res).to.be.an('object')
                        expect(res).to.have.propert('success',0)
                        expect(res).to.have.property('error',1)
                        done();
                    }
                    else{
                        done('Error in Registration Test')
                    }
            })

        })
    })
})