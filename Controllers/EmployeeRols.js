const DAOManager     = require( '../DAOManager' ).queries,
      Models         = require( '../Models' ),
      APP_CONSTANTS  = require( '../Utils/appConstants' ),
      ObjectId       = require('mongodb').ObjectId;
      require( "dotenv" ).config();

class EmployeeRols {

  static async deleteRol( payload ) {
    return new Promise( async ( resolve, reject ) => {
      try {
        const rolId = payload.id;
        if( rolId == null ) return resolve( { code: 400, message: APP_CONSTANTS.ERRORS.EMPLOYEE_ROLS.ID_IS_REQUIRED } );
        let deleted = await DAOManager.deleteOne( Models.EmployeeRols, { _id: rolId })
        if( deleted && deleted.deletedCount == 0) return resolve( { code: 400, message: APP_CONSTANTS.ERRORS.EMPLOYEE_ROLS.ROL_DO_NOT_EXIST } );

        return resolve({ code: 200, message: deleted })
      } catch ( e ) {
        console.log( e )
        return reject( { code: 400, message: APP_CONSTANTS.ERRORS.UNKNOWN.UNKNOWN_ERROR } )
      }
    })
  }

  static async editRol( payload ){
    return new Promise( async ( resolve, reject ) => {
      try {
        let employeeRolId = payload.id;
        let name = payload.name;
        if( name == null || name == undefined || name == '' ) return resolve( { code: 400, message: APP_CONSTANTS.ERRORS.EMPLOYEE_ROLS.INVALID_NAME } );
        if( employeeRolId == null || employeeRolId == undefined ) return resolve( { code: 400, message: APP_CONSTANTS.ERRORS.EMPLOYEE_ROLS.ID_IS_REQUIRED } );

        let edited = await DAOManager.updateOne( Models.EmployeeRols, { _id: ObjectId( employeeRolId ) }, { $set : { name: name }})
        if( edited.length == 0) return resolve( { code: 400, message: APP_CONSTANTS.ERRORS.EMPLOYEE_ROLS.ROL_DO_NOT_EXIST } );
        if( edited.modifiedCount == 0) return resolve( { code: 400, message: APP_CONSTANTS.ERRORS.EMPLOYEE_ROLS.ROL_DO_NOT_MODIFIED } );

        return resolve({ code: 200, message: edited })
      } catch (error) {
        console.log( error )
        return reject( { code: 400, message: APP_CONSTANTS.ERRORS.UNKNOWN.UNKNOWN_ERROR } )
      }
    } )
  }

  static async createEmployeeRol( payload ) {
    return new Promise( async ( resolve, reject ) => {
      try {
        const employeeRol = payload.name.toLowerCase().trim();
        const arr = employeeRol.split( ' ' );
        if( employeeRol == undefined || employeeRol.length < 1 || typeof employeeRol != 'string') return resolve( { code: 400, message: APP_CONSTANTS.ERRORS.EMPLOYEE_ROLS.INVALID_NAME } );

        let exist = await DAOManager.findOne( Models.EmployeeRols, { name: employeeRol}, {}, {} );

        if( exist == null) {
          let dataToInsert = {
            name : employeeRol,
            totalPersons: 0,
            updatedDate: new Date().getTime()
          }
          DAOManager.insertOne( Models.EmployeeRols, dataToInsert, {} )
          return resolve( { code: 200, message: APP_CONSTANTS.EMPLOYEE_ROLS.CREATED_SUCCESFULLY } )
        } else return reject( { code: 400, message: APP_CONSTANTS.ERRORS.EMPLOYEE_ROLS.ALREADY_EXIST } )
      } catch (error) {
        reject( { code: 400, message: { results: error } } );
      }
    } )
  }
  static async getAllEmployeeRols(){
    try {
      return await DAOManager.getData( Models.EmployeeRols, {}, {name: 1, updatedDate: 1}, {}).sort({'name': 1})
    } catch (error) {
      return { code: 500, message: error}
    }
  }
}

module.exports = EmployeeRols;