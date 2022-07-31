const express = require('express'),
      router = express.Router(),
      Controllers = require( '../Controllers/index' ),
      loginlimiter = require( '../middleware/auth' ).loginlimiter;

router.post('/', loginlimiter, (req, res) => {
  try {
    Controllers.AuthController.login( req.body )
    .then( result => {
      return res.status( result.code ).send( result.message );
    })
    .catch( err => {
      console.log( err )
      return res.status( err.code ).send( err.message );
    })
  } catch (error) {
    console.log( error );
    res.status( 400 ).send( 'Unexpected error.' )
  }
})

module.exports = router;