const mongoose = require('mongoose')
const { expect } = require('chai')
const sinon = require('sinon')

const User = require('../models/user')
const Post = require('../models/post')
const FeedController = require('../controllers/feed')

describe('Feed Controller', function() {
  before(function(done) {
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
          _id: '5c0f66b979af55031b34728b'
        })
        return user.save()
      })
      .then(() => {
        done()
      })
      // .catch(err => {
      //   console.log(err)
      // })
  })

  it('it should add a created post to the posts of the creator', function(done) {
    const req = {
      body: {
        title: 'Test Post',
        content: 'Some content',
      },
      file: {
        path: 'adsddad'
      },
      userId: '5c0f66b979af55031b34728b'
    }

    const res = {
      status: function() {
        return this
      },
      json: function() {}
    }

    FeedController.createPost(req, res, () => {})
      .then(savedUser => {
        expect(savedUser).to.have.property('posts')
        expect(savedUser.posts).to.have.length(1)
        done()
      })
  })

  after(function(done) {
    User.deleteMany({})
      .then(() => {
        return mongoose.disconnect()
      })
      .then(() => {
        done()
      })
  })
})