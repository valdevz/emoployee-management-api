const DAOManager     = require( '../DAOManager' ).queries,
      Models         = require( '../Models' ),
      bcrypt         = require( 'bcryptjs' ),
      APP_CONSTANTS  = require( '../Utils/appConstants' ),
      auth           = require( '../middleware/auth' );
      require( "dotenv" ).config();

class SuburbController {

  static async createSuburb( payload ) {
    return new Promise( async (resolve, reject) => {
      try {
        const suburb = payload.name.toLowerCase().trim();
        const arr = suburb.split( ' ' );
        if( suburb == undefined || suburb.length < 1 || typeof suburb != 'string') return reject( { code: 400, message: APP_CONSTANTS.ERRORS.SUBURB.INVALID_NAME } );
        if( arr.includes('col') || arr.includes('col.') || arr.includes('colonia') ) return reject( { code: 400, message: APP_CONSTANTS.ERRORS.SUBURB.COL_INVALID } );

        let exist = await DAOManager.findOne( Models.Suburb, { name: suburb}, {}, {} );

        if( exist == null) {
          let dataToInsert = {
            name : suburb,
            updatedDate: new Date().getTime()
          }
          DAOManager.insertOne( Models.Suburb, dataToInsert, {} )
          return resolve( { code: 201, message: APP_CONSTANTS.SUBURB.CREATED_SUCCESFULLY } )
        } else return reject( { code: 400, message: APP_CONSTANTS.ERRORS.SUBURB.ALREADY_EXIST } )
      } catch (error) {
        reject( { code: 400, message: { results: error } } );
      }
    } )
  }
  static async getAllSuburbs(){
    try {
      return await DAOManager.getData( Models.Suburb, {}, {name: 1, updatedDate: 1}, {})
    } catch (error) {
      return { code: 500, message: error}
    }
  }
}

module.exports = SuburbController;