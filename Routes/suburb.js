const express    = require( 'express' ),
      router     = express.Router(),
      Controller = require( '../Controllers' ),
      authEdit   = require( '../middleware/auth' ).verifyTokenToEdit,
      authGet    = require( '../middleware/auth' ).verifyToken,
      APP_CONSTANTS = require( '../Utils/appConstants' );

router.post( '/', authEdit, ( req, res ) => {
  try {
    Controller.SuburbController.createSuburb( req.body )
      .then( result => {
        res.status( result.code ).send( result.message )
      } )
      .catch( result => {
        console.log(result)
        res.status( result.code ).send( result.message ) 
      } )
  } catch ( e ) {
    res.status( 500 ).send( APP_CONSTANTS.ERRORS.UNKNOWN.UNKNOWN_ERROR )
    throw e;
  }
} )

router.get( '/', authGet, ( req, res ) => {
  try {
    let skip = req.query.skip;
    let limit = req.query.limit;
    Controller.SuburbController.getAllSuburbs( skip, limit )
      .then( result => {
        res.status( 200 ).type( 'json' ).send( result )
      } )
      .catch( reason => reason )
  } catch ( e ) {
    res.status( 500 ).send( APP_CONSTANTS.ERRORS.UNKNOWN.UNKNOWN_ERROR )
    throw e;
  }
} )


module.exports = router;