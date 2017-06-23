const expect = require('chai').expect;
const supertest = require('supertest');
let server = require('../server')


describe('user API tests ', function () {
    describe('for register',function () {
        it('should return an array of errors when mandatory fields are not provided', function (done) {
            supertest(server).
                post('/register').
                expect(400).
                end(function (err, response) {
                    if(err){
                        done(err)
                    }
                    else if(response){
                        let res = JSON.parse(JSON.parse(JSON.stringify(response)).text);
                        expect(res).to.be.an('object')
                        expect(res).to.have.property('success',0)
                        expect(res).to.have.property('error',1)
                        done();
                    }
                    else{
                        done('Error in Registration Test')
                    }
            })

        })

        it('should add user to the collection if mandatory fields are provided',function (done) {
            supertest(server).
                post('/register').
                send({
                firstName:'John',
                lastName: 'Doe',
                email:'johndoe@mailinator.com',
                city:'London',
                country:'England',
                username:'johndoe',
                password:'johndoe123',
                phone:'1234567890'
            }).
                expect(200).
                end(function (err,response) {
                    if(err) done(err);
                    else{
                        response = JSON.parse(response.text)
                        expect(response).to.be.an('object')
                        expect(response).to.have.property('success',1)
                        expect(response.message).to.deep.equal('User Registered Successfully')
                        done();
                    }
            })
        })
    })

    describe('for user authentication ', function (done) {
        it('should return error if username or password is invalid',function (done) {
            supertest(server).
                post('/login').
                send({
                username:'johndoe',
                password:'johnnyboy'
            }).
                expect(200).
                end(function (err,response) {
                    if(err) done(err);
                    else{
                        response = JSON.parse(response.text);
                        expect(response).to.be.an('object')
                        expect(response).to.have.property('success',0)
                        expect(response).to.have.property('error',1)
                        expect(response.message).to.deep.equal('Username/Password Invalid')
                        done();
                    }
            })
        })

        it('should authenticate user if username and password is correct', function (done) {
            supertest(server).
                post('/login').
                    send({
                username:'johndoe',
                password:'johndoe123'
            }).
                expect(200).
                end(function (err,response) {
                        if(err) done(err)
                        else{
                            response = JSON.parse(response.text)
                            expect(response).to.be.an('object')
                            expect(response).to.have.property('success',1)
                            expect(response.message).to.deep.equal('User Authenticated Successfully')
                            expect(response).to.have.property('token')
                            expect(response.token).to.be.a('string')
                            done();
                        }
            })
        })


    })
})