const DAOManager     = require( '../DAOManager' ).queries,
Models         = require( '../Models' ),
jwt            = require( 'jsonwebtoken' ),
bcrypt         = require( 'bcryptjs' ),
rateLimit = require( 'express-rate-limit' ),
APP_CONSTANTS  = require( '../Utils/appConstants' );


const loginlimiter = rateLimit( { 
  windowMs: 10 * 60 * 1000, max: 5, 
  standardHeaders: true, 
  legacyHeaders: false, 
  message: APP_CONSTANTS.ERRORS.BRUTE_FORCE_ATTACK } );

async function searchToken( decoded ) {
  let criteria = {
    userId  : decoded.userId,
    emailId : decoded.emailId,
    rol     : decoded.rol
  }
  return await DAOManager.findOne(Models.User, criteria, {}, {})  
}

function decodeToken ( token ) {
  return jwt.decode( token );
} 

function createToken( payload, userId = payload.userId ) {
  return jwt.sign(
    { userId: userId, emailId: payload.emailId, rol: payload.rol },
    process.env.TOKEN_KEY,
    {
      expiresIn: "6h",
    }
  );
}

const verifyTokenToEdit = (req, res, next) => {
  try {
    let valid = tokenValidation( req, res );
    if( !valid.status ) return res.status( valid.code ).send( valid.message );
    else bearerToken = valid.bearerToken

    const decode = jwt.verify(bearerToken, process.env.TOKEN_KEY, ( err, code ) => {
      return {...code,...err}
    } );

    if ( decode.expiredAt ) return res.status( 401 ).send( APP_CONSTANTS.ERRORS.UNAUTHORIZED.EXPIRED );

    if ( decode.rol === APP_CONSTANTS.ROLS.VIEWER ) return res.status( 401 ).send( APP_CONSTANTS.ERRORS.UNAUTHORIZED.PERMISSIONS );
    req.token = bearerToken;
    next(); 
  } catch (err) {
    console.log(err)
    res.status(403).send(APP_CONSTANTS.ERRORS.UNKNOWN.UNKNOWN_ERROR);
  }
}

const verifyToken = (req, res, next) => {
  try {
    let valid = tokenValidation( req )
    if( !valid.status ) return res.status( valid.code ).send( valid.message );
    else bearerToken = valid.bearerToken

    const decode = jwt.verify(bearerToken, process.env.TOKEN_KEY, ( err, code ) => {
      return {...code,...err}
    } );
    if ( decode.expiredAt ) return res.status( 401 ).send( APP_CONSTANTS.ERRORS.UNAUTHORIZED.EXPIRED );
    return next(); 
  } catch ( err ) {
    console.log( err )
    res.status( 403 ).send( APP_CONSTANTS.ERRORS.UNKNOWN.UNKNOWN_ERROR );
  }
};

 function tokenValidation( req ) {
  try {
    let headers = req.headers['authorization'];
    let bearerToken;
    if( !headers ) return { status: false, code: 403, message: APP_CONSTANTS.ERRORS.UNAUTHORIZED.PERMISSIONS }
    
    let token = req.headers['authorization'].split(' ')
    
    if ( token.length != 2 ) return { status: false, code: 403, message: APP_CONSTANTS.ERRORS.UNAUTHORIZED.UNAUTHORIZED_TOKEN }
    else bearerToken = token[1];

    if (!token) return { status: false, code: 403, message: APP_CONSTANTS.ERRORS.UNAUTHORIZED.UNAUTHORIZED_TOKEN } 

    return { status: true, bearerToken };
  } catch (error) {
    return { status: false, code: 403, message: APP_CONSTANTS.ERRORS.UNKNOWN.UNKNOWN_ERROR } 
  }
}


module.exports = {
  searchToken,
  createToken,
  decodeToken,
  verifyToken,
  verifyTokenToEdit,
  loginlimiter
}