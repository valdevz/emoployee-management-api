const express = require( 'express' ),
      router = express.Router(),
      Controllers = require( '../Controllers/index' ),
      auth        = require( '../middleware/auth').verifyToken;

router.get( '/', ( req, res ) => {
  res.send( 'regiter endpoint' )
} )

router.post( '/', auth, ( req, res ) => {
  try {
    Controllers.UserController.Register( req.body )
    .then( user => {
      return res.status( user.code ).send( user.message );
    } ).catch( ( err ) => {
      console.log( err )
      return res.status( err.code ).send( err.message );
    } )

  } catch ( error ) {
    console.log( error );
    res.status( 400 ).send( 'Unexpected error.' )
  }
})

module.exports = router;