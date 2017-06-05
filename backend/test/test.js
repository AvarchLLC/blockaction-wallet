/**
 * Created by sazack on 6/5/17.
 */

const expect = require('chai').expect

describe('Testing Mocha and Chai', function () {
    it('Should verify mocha and grunt works properly', function (done) {

        var a=1;
        var b=2

        expect(a+b).to.equal(3);
        done()
        
    })
})