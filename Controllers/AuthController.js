const DAOManager     = require( '../DAOManager' ).queries,
      Models         = require( '../Models' ),
      bcrypt         = require( 'bcryptjs' ),
      APP_CONSTANTS  = require( '../Utils/appConstants' ),
      jwt            = require( 'jsonwebtoken' ),
      auth           = require( '../middleware/auth' );
      require( "dotenv" ).config();

class AuthController {
  static refreshToken( headers ) {
    return new Promise( async ( resolve, reject ) => {
      try {
        if ( !headers['authorization'] ) {
          return reject({ status: true, code: 400, message: APP_CONSTANTS.ERRORS.UNAUTHORIZED.BAD_TOKEN } )
        } else {
          let token = headers['authorization'].split( ' ' )[1]

          let decode = jwt.verify(token, process.env.TOKEN_KEY, ( err, code ) => {
            return {...code,...err}
          } );


          if( decode.message !=  'jwt expired' ) return reject( { status: true, code: 401, message: decode.message } )
          else decode = jwt.decode( token )

          let findUser = await auth.searchToken( decode )
          if ( findUser == null ) return reject( { status: true, code: 401, message: APP_CONSTANTS.ERRORS.UNAUTHORIZED.UNAUTHORIZED_TOKEN } )
  
          let newToken = auth.createToken( findUser )
  
          return resolve( { status: true, code: 200, message: { token: newToken } } );
        }
      } catch ( error ) {
        console.log( error )
        return reject( { status: true, code: 401, message: APP_CONSTANTS.ERRORS.UNKNOWN.UNKNOWN_ERROR } )
      }
    } )
  }
  static login( payload ) {
    return new Promise( async( resolve, reject ) => {
      let user = payload.user.trim().toString().toLowerCase();
      let pass = payload.pass;
      if( !user ) return reject( { status: true, code: 400, message: APP_CONSTANTS.ERRORS.LOGIN.FIELDS_REQUIRED } )
      if( !pass ) return reject( { status: true, code: 400, message: APP_CONSTANTS.ERRORS.LOGIN.FIELDS_REQUIRED } )

      let condition = { $or: [ { userId: user }, { emailId: user } ] };

      let userData = await DAOManager.findOne(Models.User, condition, {}, {})
      console.log(userData)
      if ( userData == null ) return reject( { status: true, code: 400, message: APP_CONSTANTS.ERRORS.LOGIN.INVALID_CREDENTIALS } )

      const comparePass = await bcrypt.compare( pass, userData.password );

      if ( !comparePass ) return reject( { status: true, code: 400, message: APP_CONSTANTS.ERRORS.LOGIN.INVALID_CREDENTIALS } )
      console.log(userData)
      userData.password = undefined;
      userData.updatedDate = undefined;
      
      userData.token = await auth.createToken( userData );

      return resolve( { status: true, code: 200, message: userData} );

    } )
  }
}

module.exports = AuthController;