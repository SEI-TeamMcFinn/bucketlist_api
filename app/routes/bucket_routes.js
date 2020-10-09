// Express docs: http://expressjs.com/en/api.html
const express = require('express')
// Passport docs: http://www.passportjs.org/docs/
const passport = require('passport')

// pull in Mongoose model for buckets
const Bucket = require('../models/bucket')

// this is a collection of methods that help us detect situations when we need
// to throw a custom error
const customErrors = require('../../lib/custom_errors')

// we'll use this function to send 404 when non-existant document is requested
const handle404 = customErrors.handle404
// we'll use this function to send 401 when a user tries to modify a resource
// that's owned by someone else
const requireOwnership = customErrors.requireOwnership

// this is middleware that will remove blank fields from `req.body`, e.g.
// { bucket: { title: '', text: 'foo' } } -> { bucket: { text: 'foo' } }
const removeBlanks = require('../../lib/remove_blank_fields')
// passing this as a second argument to `router.<verb>` will make it
// so that a token MUST be passed for that route to be available
// it will also set `req.user`
const requireToken = passport.authenticate('bearer', { session: false })

// instantiate a router (mini app that only handles routes)
const router = express.Router()

// INDEX
// GET /buckets
router.get('/buckets', requireToken, (req, res, next) => {
  Bucket.find({ owner: req.user.id })
    .then(buckets => {
      // `buckets` will be an array of Mongoose documents
      // we want to convert each one to a POJO, so we use `.map` to
      // apply `.toObject` to each one
      return buckets.map(bucket => bucket.toObject())
    })
    // respond with status 200 and JSON of the buckets
    .then(buckets => res.status(200).json({ buckets: buckets }))
    // if an error occurs, pass it to the handler
    .catch(next)
})

// INDEX PUBLIC
// GET /public
router.get('/buckets/public', requireToken, (req, res, next) => {
  Bucket.find({ privacy: false, owner: { $ne: req.user.id } })
    .populate('owner')
    .then(buckets => {
      // `buckets` will be an array of Mongoose documents
      // we want to convert each one to a POJO, so we use `.map` to
      // apply `.toObject` to each one
      return buckets.map(bucket => bucket.toObject())
    })
    // respond with status 200 and JSON of the buckets
    .then(buckets => res.status(200).json({ buckets: buckets }))
    // if an error occurs, pass it to the handler
    .catch(next)
})

// SHOW
// GET /buckets/5a7db6c74d55bc51bdf39793
router.get('/buckets/:id', requireToken, (req, res, next) => {
  // req.params.id will be set based on the `:id` in the route
  Bucket.findById(req.params.id)
    .then(handle404)
    // if `findById` is succesful, respond with 200 and "bucket" JSON
    .then(bucket => res.status(200).json({ bucket: bucket.toObject() }))
    // if an error occurs, pass it to the handler
    .catch(next)
})

// CREATE
// POST /buckets
router.post('/buckets', requireToken, (req, res, next) => {
  // set owner of new bucket to be current user
  req.body.bucket.owner = req.user.id

  Bucket.create(req.body.bucket)
    // respond to succesful `create` with status 201 and JSON of new "bucket"
    .then(bucket => {
      res.status(201).json({ bucket: bucket.toObject() })
    })
    // if an error occurs, pass it off to our error handler
    // the error handler needs the error message and the `res` object so that it
    // can send an error message back to the client
    .catch(next)
})

// UPDATE
// PATCH /buckets/5a7db6c74d55bc51bdf39793
router.patch('/buckets/:id', requireToken, removeBlanks, (req, res, next) => {
  // if the client attempts to change the `owner` property by including a new
  // owner, prevent that by deleting that key/value pair
  delete req.body.bucket.owner

  Bucket.findById(req.params.id)
    .then(handle404)
    .then(bucket => {
      // pass the `req` object and the Mongoose record to `requireOwnership`
      // it will throw an error if the current user isn't the owner
      requireOwnership(req, bucket)

      // pass the result of Mongoose's `.update` to the next `.then`
      return bucket.updateOne(req.body.bucket)
    })
    // if that succeeded, return 204 and no JSON
    .then(() => res.sendStatus(204))
    // if an error occurs, pass it to the handler
    .catch(next)
})

// DESTROY
// DELETE /buckets/5a7db6c74d55bc51bdf39793
router.delete('/buckets/:id', requireToken, (req, res, next) => {
  Bucket.findById(req.params.id)
    .then(handle404)
    .then(bucket => {
      // throw an error if current user doesn't own `bucket`
      requireOwnership(req, bucket)
      // delete the bucket ONLY IF the above didn't throw
      bucket.deleteOne()
    })
    // send back 204 and no content if the deletion succeeded
    .then(() => res.sendStatus(204))
    // if an error occurs, pass it to the handler
    .catch(next)
})

module.exports = router
