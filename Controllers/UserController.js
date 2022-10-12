const DAOManager     = require( '../DAOManager' ).queries,
      Models         = require( '../Models' ),
      bcrypt         = require( 'bcryptjs' ),
      APP_CONSTANTS  = require( '../Utils/appConstants' ),
      auth           = require( '../middleware/auth' );
      require( "dotenv" ).config();

class UsersController {

  static searchByFilter ( filter ) {
    return new Promise( async (resolve, reject ) => {
      try {
        let name = filter.name;
        if ( typeof name != 'string' || (name.length == 0) ) return reject( { code: 400, message: APP_CONSTANTS.ERRORS.BAD_REQUEST.VALUE_TYPE } )
        let skip = filter.skip != undefined ? filter.skip : 0;
        if ( Number( skip ) < 0 ) return reject( { code: 400, message: APP_CONSTANTS.ERRORS.BAD_REQUEST.VALUE_TYPE } )
        let limit = filter.limit != undefined ? filter.limit : 5;
        if ( Number( limit ) < 0 ) return reject( { code: 400, message: APP_CONSTANTS.ERRORS.BAD_REQUEST.VALUE_TYPE } )
        let query = [ 
          { 
            $match:{ $or: [
              { "uName": { $regex: new RegExp(name , "i") } },
              { "lastname": { $regex: new RegExp(name , "i") } },
            ] },
          },
          {
            $project : {
              userId: "$userId",
              uName: "$uName",
              lastname: "$lastname",
              inCharge: "$inCharge",
              emailId: "$emailId",
              rol: "$rol",
              dateOfBirth: "$dateOfBirth",
              address: "$address",
              phoneNo: "$phoneNo"
            }
          },
          { $limit: Number( limit ) },
          { $skip: Number( skip ) }
        ]

        let users = await DAOManager.aggregate( Models.User, query, {} )

        return resolve({ code: 201, message: { results: users } } );
          
        } catch ( error ) {
          reject( { code: 400, message: { results: error } } );
        }
    } )
  }

  static editUser ( payload ) {
    return new Promise( async ( resolve, reject ) => {
      let isValid = this.validEditableFields( payload )
      if ( isValid.status ) return resolve( isValid );

      let criteria = {userId : payload.userId}
      let update = {$set: { ...isValid.dataToUpdate} }
      update.$set.updatedDate = Date.now()

      let result = await DAOManager.updateOne( Models.User, criteria, update, {userId:1} );

      return resolve({ status: true, code: 200, message: result } )
    } )
  }
  
  static validEditableFields( payload ) {
    let mailRegex = new RegExp( '[a-z0-9]+@[a-z]+\.[a-z]{2,3}' );
    let phoneRegex = new RegExp( '^[0-9]{10}$' );
    let dataToUpdate = {}

    /* Making fields (optional) validation, userId is always required */
    if(payload.userId === undefined || payload.userId === '' ) return { status: true, code: 400, message: APP_CONSTANTS.ERRORS.REGISTER.INVALID_USERID };

    if(payload.uName !== undefined ) {
      if ( payload.uName == '' ) return { status: true, code: 400, message: APP_CONSTANTS.ERRORS.REGISTER.INVALID_NAME };
      
      dataToUpdate.uName = payload.uName.trim();
    }

    if(payload.lastname !== undefined ) {
      if ( payload.lastname == '' ) return { status: true, code: 400, message: APP_CONSTANTS.ERRORS.REGISTER.INVALID_LASTNAME };
      
      dataToUpdate.lastname = payload.lastname.trim();
    }

    if(payload.rol !== undefined ) {
      if ( payload.rol == '') return { status: true, code: 400, message: APP_CONSTANTS.ERRORS.REGISTER.INVALID_ROL }
      if ( ! (payload.rol == APP_CONSTANTS.ROLS.ADMIN || payload.rol == APP_CONSTANTS.ROLS.EDITOR || payload.rol == APP_CONSTANTS.ROLS.VIEWER ) ) return { status: true, code: 400, message: APP_CONSTANTS.ERRORS.REGISTER.INVALID_ROL };
      
      dataToUpdate.rol = payload.rol.trim();
    }

    if(payload.dateOfBirth !== undefined ) {
      if ( payload.dateOfBirth == '' ) return { status: true, code: 400, message: APP_CONSTANTS.ERRORS.REGISTER.INVALID_BIRTH };
      
      dataToUpdate.dateOfBirth = payload.dateOfBirth.trim();
    }

    if(payload.emailId !== undefined ) {
      if ( ! mailRegex.test(payload.emailId) ) return { status: true, code: 400, message: APP_CONSTANTS.ERRORS.REGISTER.INVALID_MAIL };
      
      dataToUpdate.emailId = payload.emailId.trim();
    }

    if(payload.phoneNo !== undefined ) {
      if ( ! phoneRegex.test(payload.phoneNo.trim()) ) return { status: true, code: 400, message: APP_CONSTANTS.ERRORS.REGISTER.INVALID_PHONE };
      
      dataToUpdate.phoneNo = payload.phoneNo.trim();
    }
    if( payload.address !== undefined && payload.address.length !== 0) dataToUpdate.address = payload.address;
    
    // if(typeof payload.inCharge === 'object' ) dataToUpdate.inCharge = payload.inCharge;
    if (Object.keys(dataToUpdate).length < 1) return { status: true, code: 400, message: APP_CONSTANTS.ERRORS.EDIT.EMPTY_BODY };

    return { status: false, dataToUpdate }
  }
  
  static validRegFields(payload) {
    let regex = new RegExp( '[a-z0-9]+@[a-z]+\.[a-z]{2,3}' );
    if( payload.rol === undefined || payload.rol === '' ) return { status: true, code: 400, message: APP_CONSTANTS.ERRORS.REGISTER.ROL };
    if( payload.uName === undefined || payload.uName === '' ) return { status: true, code: 400, message: APP_CONSTANTS.ERRORS.REGISTER.INVALID_NAME };
    if( payload.phoneNo === undefined || payload.phoneNo === '' ) return { status: true, code: 400, message: APP_CONSTANTS.ERRORS.REGISTER.INVALID_PHONE };
    if( payload.lastname === undefined || payload.lastname === '' ) return { status: true, code: 400, message: APP_CONSTANTS.ERRORS.REGISTER.INVALID_LASTNAME };
    if( payload.dateOfBirth === undefined || payload.dateOfBirth ===  '' ) return { status: true, code: 400, message: APP_CONSTANTS.ERRORS.REGISTER.INVALID_BIRTH };
    if( typeof payload.address != 'object' && payload.address.length != 2 ) return { status: true, code: 400, message: APP_CONSTANTS.ERRORS.REGISTER.INVALID_ADDRESS };
    if( typeof payload.inCharge != 'object' ) return { status: true, code: 400, message: APP_CONSTANTS.ERRORS.REGISTER.INVALID_ARRAY };
    if( payload.password ===  undefined ) return { status: true, code: 400, message: APP_CONSTANTS.ERRORS.REGISTER.INVALID_PASSWORD };
    if ( payload.emailId != undefined  || ! regex.test( payload.emailId ) ) return { status: true, code: 400, message: APP_CONSTANTS.ERRORS.REGISTER.INVALID_MAIL };

    return { status: false }
  }

  static async userExist( payload ) {
    let mailExist = await DAOManager.findOne( Models.User, { emailId: payload.emailId }, {}, {} );
    if( mailExist != null ) return { status: true, code: 409, message: APP_CONSTANTS.ERRORS.REGISTER.USER_EXIST };
    let phonexist = await DAOManager.findOne( Models.User, { phoneNo: payload.phoneNo }, {}, {} );
    if( phonexist != null ) return { status: true, code: 409, message: APP_CONSTANTS.ERRORS.REGISTER.USER_EXIST };
    return { status: false }
  }

  static createUserId( payload ) {
    let lastname ;
    /*Part1: first 2 letters of the name*/
    let part1 = payload.uName.trim().split( ' ' )[0].substring(0,2);

    if( payload.lastname == ( undefined || '' ) ) lastname = payload.secondLastname;
    else lastname = payload.lastname;

    /*Part2: first 2 letters of the first lastname*/
    let part2 = lastname.trim().split( ' ' )[0].substring( 0, 2 );
    /*Part3: random number from 0 to 100*/
    let part3 = Math.floor( Math.random() * 101 );
    
    return part1 + part2 + part3;
  }

  static validRole( rol ) {
    let rols = Object.values( APP_CONSTANTS.ROLS );
    let valid = rols.find( item => item == rol );
      if ( valid ) return { status: false }
      else return { status: true, code: 401, message: APP_CONSTANTS.ERRORS.REGISTER.INVALID_ROL };
  }

  static trimPayload( payload ) {
    Object.keys( payload ).map( k => {
      payload[k] = typeof payload[k] == 'string' ? payload[k].trim() : payload[k]
    } );
    return payload;
  }

  static formatBirthDate( date ) {
    let day = date.split( '/' )[0];
    let month = date.split( '/' )[1];
    let year = date.split( '/' )[2];
    return new Date( `${month}/${day}/${year}` ).getTime();
  }

  static async Register( payload ) {
    return new Promise( async ( resolve, reject ) => {
      let areFieldsValid = this.validRegFields( payload );
      if ( areFieldsValid.status ) return reject( areFieldsValid );
      
      let userExist = await this.userExist( payload );
      if ( userExist.status ) return reject( userExist );

      let validRol = this.validRole( payload.rol );
      if ( validRol.status ) return reject( validRol )

      payload = this.trimPayload ( payload )

      let userId = this.createUserId( payload );

      let encryptedPassword = await bcrypt.hash( payload.password, 16 );

      let epoxDate = this.formatBirthDate( payload.dateOfBirth );

      let data = {
        userId: userId,
        emailId: payload.emailId,
        rol: payload.rol,
        uName: payload.uName,
        phoneNo: payload.phoneNo,
        lastname: payload.lastname,
        dateOfBirth: epoxDate,
        address: payload.address,
        password: encryptedPassword,
        createdDate: Date.now(),
        updatedDate: Date.now(),
      }
      
      const token = auth.createToken( payload, userId );
      
      let user = await DAOManager.insertOne( Models.User, data, {} );
      user.token = token;
      return resolve( { status: true, code: 201, message: user } );

    } )
  }

  static async getAllUsersLocation() {
    let allUsers = await DAOManager.getData( Models.User, {}, { userId: 1, uName: 1, coordinates: 1 } );
    return allUsers;
  }
  
  static async getAllUsers( skip, limit ) {
    if ( skip == undefined ) skip = 0;
    if ( limit == undefined ) limit = 10;
    let allUsers = await DAOManager.getData( Models.User, {}, { userId: 1, uName: 1, lastname: 1, address: 1, rol: 1 } ).skip( skip ).limit( limit )
    let count = await DAOManager.count( Models.User, {})
    allUsers.push({'counter': count})
    return allUsers;
  }

  static async getUserById( id ) {
    let query = { userId: id };
    let data = { password: 0, updatedDate: 0, _id: 0, token: 0, createdDate: 0 }
    let user = await DAOManager.findOne( Models.User, query, data,  {} );

    if( user ) return { code: 201, message: { user } }
    return { code: 404, message: APP_CONSTANTS.ERRORS.NOT_FOUND }
  }
}

module.exports = UsersController;