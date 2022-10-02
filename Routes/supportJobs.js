const express    = require( 'express' ),
      router     = express.Router(),
      Controller = require( '../Controllers' ),
      authEdit   = require( '../middleware/auth' ).verifyTokenToEdit,
      authGet    = require( '../middleware/auth' ).verifyToken,
      APP_CONSTANTS = require( '../Utils/appConstants' );

router.post( '/', authEdit, ( req, res ) => {
  try {
    Controller.SupportJobs.createJob( req.body )
      .then( result => {
        res.status( result.code ).type( 'json' ).send( result )
      } )
      .catch( result => {
        res.status( result.code ).send( result.message ) 
      } )
  } catch ( e ) {
    console.log( e )
    res.status( 500 ).send( APP_CONSTANTS.ERRORS.UNKNOWN.UNKNOWN_ERROR )
    throw e;
  }
} )

router.put('/', authEdit, ( req, res ) => {
  try {
    Controller.SupportJobs.editJob( req.body )
    .then( result => {
        res.status( 200 ).type( 'json' ).send( result )
      })
      .catch( err => res.status( 400 ).type( 'json' ).send( err ))
  } catch ( error ) {
    console.log( error )
    res.status( 500 ).send( APP_CONSTANTS.ERRORS.UNKNOWN.UNKNOWN_ERROR )
    throw e;
  }
})

router.delete('/', authEdit, ( req, res ) => {
  try {
    Controller.SupportJobs.deleteJob( req.body )
      .then( result => {
        res.status( 200 ).type( 'json' ).send( result )
      })
      .catch( err => res.status( 400 ).type( 'json' ).send( err ))
  } catch (  error ) {
    console.log( error )
    res.status( 500 ).send( APP_CONSTANTS.ERRORS.UNKNOWN.UNKNOWN_ERROR )
    throw e;
  }
})

router.get( '/', authGet, ( req, res ) => {
  try {
    let skip = req.query.skip;
    let limit = req.query.limit;
    Controller.SupportJobs.getAllJobs( skip, limit )
      .then( result => {
        res.status( 200 ).type( 'json' ).send( result )
      } )
      .catch( reason => reason )
  } catch ( e ) {
    console.log( e )
    res.status( 500 ).send( APP_CONSTANTS.ERRORS.UNKNOWN.UNKNOWN_ERROR )
    throw e;
  }
} )


module.exports = router;