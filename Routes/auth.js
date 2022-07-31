const express    = require( 'express' ),
      router     = express.Router(),
      Controller = require( '../Controllers' ),
      APP_CONSTANTS = require( '../Utils/appConstants' );

router.get( '/refreshToken', ( req, res ) => {
  try {
    Controller.AuthController.refreshToken( req.headers )
      .then( result => {
        res.status( result.code ).send( result.message )
      } )
      .catch( err => {
        console.log( err )
        res.status( err.code ).send( err.message ) 
      } )
  } catch ( e ) {
    res.status( 500 ).send( APP_CONSTANTS.ERRORS.UNKNOWN.UNKNOWN_ERROR )
    throw e;
  }
} )

module.exports = router;