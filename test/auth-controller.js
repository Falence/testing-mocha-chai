const { expect } = require('chai')
const sinon = require('sinon')

const User = require('../models/user')
const authController = require('../controllers/auth')

describe('Auth Controller - Login', function() {
  it('it should throw an error with code 500 if accessing the DB fails', function(done) {
    sinon.stub(User, 'findOne')
    User.findOne.throws()

    const req = {
      body: {
        email: 'test@test.com',
        password: 'tester'
      }
    }

    authController.login(req, {}, () => {})
      .then(result => {
        expect(result).to.be.an('error')
        expect(result).to.have.property('statusCode', 400)
        done()
      })

    User.findOne.restore()
  })
})