const mongoose = require('mongoose')
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
        expect(result).to.have.property('statusCode', 500)
        done()
      })

    User.findOne.restore()
  })

  it('should send a response with a valid user status for an existing user', function(done) {
    mongoose
      .connect(
        'mongodb://localhost:27017/mochas-test-db'
      )
      .then(result => {
        const user = new User({
          email: 'tester@tester.com',
          password: 'tester',
          name: 'test',
          post: [],
          _id: '5c0f66b979af55031b34728a'
        })
        return user.save()
      })
      .then(() => {
        const req = { userId: '5c0f66b979af55031b34728a' }
        const res = {
          statusCode: 500,
          userStatus: null,
          status: function(code) {
            this.statusCode = code
            return this
          },
          json: function(data) {
            this.userStatus = data.status
          }
        }

        authController.getUserStatus(req, res, () => {})
          .then(() => {
            expect(res.statusCode).to.be.equal(200)
            expect(res.userStatus).to.be.equal('I am new!')
            done()
          })
      })
      .catch(err => console.log(err));
  })
})