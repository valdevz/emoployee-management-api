const DAOManager     = require( '../DAOManager' ).queries,
      Models         = require( '../Models' ),
      bcrypt         = require( 'bcryptjs' ),
      APP_CONSTANTS  = require( '../Utils/appConstants' ),
      ObjectId       = require('mongodb').ObjectId,
      auth           = require( '../middleware/auth' );
      require( "dotenv" ).config();

class SuburbController {

  static async deleteSuburb( payload ) {
    return new Promise( async ( resolve, reject ) => {
      try {
        const suburbId = payload.id;
        if( suburbId == null ) return resolve( { code: 400, message: APP_CONSTANTS.ERRORS.SUBURB.ID_IS_REQUIRED } );
        let deleted = await DAOManager.deleteOne( Models.Suburb, { _id: suburbId })
        if( deleted && deleted.deletedCount == 0) return resolve( { code: 400, message: APP_CONSTANTS.ERRORS.SUBURB.SUBURB_DO_NOT_EXIST } );

        return resolve({ code: 200, message: deleted })
      } catch ( e ) {
        console.log( e )
        return reject( { code: 400, message: APP_CONSTANTS.ERRORS.UNKNOWN.UNKNOWN_ERROR } )
      }
    })
  }

  static async editSuburb( payload ){
    return new Promise( async ( resolve, reject ) => {
      try {
        let suburbId = payload.id;
        let name = payload.name;
        if( name == null || name == undefined || name == '' ) return resolve( { code: 400, message: APP_CONSTANTS.ERRORS.SUBURB.NAME_IS_REQUIRED } );
        if( suburbId == null || suburbId == undefined ) return resolve( { code: 400, message: APP_CONSTANTS.ERRORS.SUBURB.ID_IS_REQUIRED } );

        let edited = await DAOManager.updateOne( Models.Suburb, { _id: ObjectId(suburbId) }, { $set : {name: name }})
        if( edited.length == 0) return resolve( { code: 400, message: APP_CONSTANTS.ERRORS.SUBURB.SUBURB_DO_NOT_EXIST } );
        if( edited.modifiedCount == 0) return resolve( { code: 400, message: APP_CONSTANTS.ERRORS.SUBURB.SUBURB_DO_NOT_MODIFIED } );

        return resolve({ code: 200, message: edited })
      } catch (error) {
        console.log( error )
        return reject( { code: 400, message: APP_CONSTANTS.ERRORS.UNKNOWN.UNKNOWN_ERROR } )
      }
    } )
  }

  static async createSuburb( payload ) {
    return new Promise( async ( resolve, reject ) => {
      try {
        const suburb = payload.name.toLowerCase().trim();
        const arr = suburb.split( ' ' );
        if( suburb == undefined || suburb.length < 1 || typeof suburb != 'string') return resolve( { code: 400, message: APP_CONSTANTS.ERRORS.SUBURB.INVALID_NAME } );
        if( arr.includes('col') || arr.includes('col.') || arr.includes('colonia') ) return resolve( { code: 400, message: APP_CONSTANTS.ERRORS.SUBURB.COL_INVALID } );

        let exist = await DAOManager.findOne( Models.Suburb, { name: suburb}, {}, {} );

        if( exist == null) {
          let dataToInsert = {
            name : suburb,
            updatedDate: new Date().getTime()
          }
          DAOManager.insertOne( Models.Suburb, dataToInsert, {} )
          return resolve( { code: 200, message: APP_CONSTANTS.SUBURB.CREATED_SUCCESFULLY } )
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