const DAOManager     = require( '../DAOManager' ).queries,
      Models         = require( '../Models' ),
      bcrypt         = require( 'bcryptjs' ),
      APP_CONSTANTS  = require( '../Utils/appConstants' ),
      ObjectId       = require('mongodb').ObjectId,
      auth           = require( '../middleware/auth' );
      require( "dotenv" ).config();

class SupportJobsController {

  static async deleteJob( payload ) {
    return new Promise( async ( resolve, reject ) => {
      try {
        const jobId = payload.id;
        if( jobId == null ) return resolve( { code: 400, message: APP_CONSTANTS.ERRORS.SUPPORT_JOBS.ID_IS_REQUIRED } );
        let deleted = await DAOManager.deleteOne( Models.SupportJobs, { _id: jobId })
        if( deleted && deleted.deletedCount == 0) return resolve( { code: 400, message: APP_CONSTANTS.ERRORS.SUPPORT_JOBS.JOB_DO_NOT_EXIST } );

        return resolve({ code: 200, message: deleted })
      } catch ( e ) {
        console.log( e )
        return reject( { code: 400, message: APP_CONSTANTS.ERRORS.UNKNOWN.UNKNOWN_ERROR } )
      }
    })
  }

  static async editJob( payload ){
    return new Promise( async ( resolve, reject ) => {
      try {
        let jobId = payload.id;
        let name = payload.name;
        if( name == null || name == undefined || name == '' ) return resolve( { code: 400, message: APP_CONSTANTS.ERRORS.SUPPORT_JOBS.JOB_NAME_IS_REQUIRED } );
        if( jobId == null || jobId == undefined ) return resolve( { code: 400, message: APP_CONSTANTS.ERRORS.SUPPORT_JOBS.ID_IS_REQUIRED } );

        let edited = await DAOManager.updateOne( Models.SupportJobs, { _id: ObjectId(jobId) }, { $set : {name: name }})
        if( edited.length == 0) return resolve( { code: 400, message: APP_CONSTANTS.ERRORS.SUPPORT_JOBS.JOB_DO_NOT_EXIST } );
        if( edited.modifiedCount == 0) return resolve( { code: 400, message: APP_CONSTANTS.ERRORS.SUPPORT_JOBS.JOB_DO_NOT_MODIFIED } );

        return resolve({ code: 200, message: edited })
      } catch (error) {
        console.log( error )
        return reject( { code: 400, message: APP_CONSTANTS.ERRORS.UNKNOWN.UNKNOWN_ERROR } )
      }
    } )
  }

  static async createJob( payload ) {
    return new Promise( async ( resolve, reject ) => {
      try {
        const job = payload.name != undefined? payload.name.toLowerCase().trim(): reject( { code: 400, message:  APP_CONSTANTS.ERRORS.SUPPORT_JOBS.INVALID_NAME } )
        const arr = job.split( ' ' );
        if( job == undefined || job.length < 1 || typeof job != 'string') return resolve( { code: 400, message: APP_CONSTANTS.ERRORS.SUPPORT_JOBS.INVALID_NAME } );

        let exist = await DAOManager.findOne( Models.SupportJobs, { name: job}, {}, {} );

        if( exist == null) {
          let dataToInsert = {
            name : job,
            updatedDate: new Date().getTime(),
            createdDate: new Date().getTime(),
          }
          DAOManager.insertOne( Models.SupportJobs, dataToInsert, {} )
          return resolve( { code: 200, message: APP_CONSTANTS.SUPPORT_JOBS.CREATED_SUCCESFULLY } )
        } else return resolve( { code: 400, message: APP_CONSTANTS.ERRORS.SUPPORT_JOBS.ALREADY_EXIST } )
      } catch (error) {
        console.log(error)
        reject( { code: 400, message: { results: error } } );
      }
    } )
  }
  static async getAllJobs(){
    try {
      return await DAOManager.getData( Models.SupportJobs, {}, {name: 1, updatedDate: 1}, {}).sort({'name': 1})
    } catch (error) {
      return { code: 500, message: error}
    }
  }
}

module.exports = SupportJobsController;