let ERRORS = {
  BRUTE_FORCE_ATTACK: 'You reached the max request number, please try again in 20 min',
  BAD_REQUEST : {
    VALUE_TYPE: 'Bad request'
  },
  EDIT: {
    EMPTY_BODY    : 'You have to send at least one field to edit.',
  },
  EMPLOYEE_ROLS: {
    INVALID_NAME: 'Name of rol must to be a string and can\'t be empty or undefined.',
    ALREADY_EXIST: 'This rol already exist.',
    ID_IS_REQUIRED: 'The id is required.',
    NAME_IS_REQUIRED: 'Name is required.',
    ROL_DO_NOT_EXIST: 'The rol do not exist.',
    ROL_DO_NOT_MODIFIED: 'The rol could not be modified.'
  },
  LOGIN: {
    INVALID_CREDENTIALS : 'Login Failed: Your user ID/email or password is incorrect.',
    FIELDS_REQUIRED     : 'Email/user ID and password are required.'
  },
  NOT_FOUND : '404 error: Not found.',
  REGISTER : {
    USER_EXIST             : 'User already exist.',
    INVALID_MAIL           : 'Invalid value for emailId input.',
    INVALID_ROL            : 'Invalid value for rol input.',
    INVALID_NAME           : 'Invalid value for name input.',
    INVALID_PHONE          : 'Invalid value for phone input.',
    INVALID_LASTNAME       : 'Invalid value for lastname input.',
    INVALID_SECONDLASTNAME : 'Invalid value for seconLastname input.',
    INVALID_BIRTH          : 'Invalid value for dateOfBirth input.',
    INVALID_ADDRESS        : 'Invalid value for address input.',
    INVALID_PASSWORD       : 'Invalid value for password input.',
    INVALID_ARRAY          : 'Invalid value for inCharge input.',
    INVALID_USERID         : 'Invalid value for userId input.',
  },
  SUBURB: {
    INVALID_NAME: 'Name of suburb must to be a string and can\'t be empty or undefined.',
    ALREADY_EXIST: 'This suburb already exist.',
    COL_INVALID : 'Please avoid the word "Colonia" and their abbreviations.',
    ID_IS_REQUIRED: 'The id is required.',
    NAME_IS_REQUIRED: 'Name is required.',
    SUBURB_DO_NOT_EXIST: 'The suburbs do not exist.',
    SUBURB_DO_NOT_MODIFIED: 'The suburbs could not be modified.'
  },
  UNAUTHORIZED : {
    UNAUTHORIZED_TOKEN : 'Unauthorized token.',
    BAD_TOKEN : 'Bad token format.',
    EXPIRED   : 'Token expired.',
    PERMISSIONS : 'You do not have the permisions to do this operation.',
  },
  UNKNOWN : {
    UNKNOWN_ERROR : 'Unknown error.'
  },
}

let EMPLOYEE_ROLS = {
  CREATED_SUCCESFULLY : 'Rol created succesfully.'
}

let ROLS = {
  ADMIN  : 'ADMIN',
  EDITOR : 'EDITOR',
  VIEWER : 'USER',
}

let SUBURB = {
  CREATED_SUCCESFULLY : 'Suburb created succesfully.'
}

module.exports = {
  ERRORS,
  ROLS,
  SUBURB,
  EMPLOYEE_ROLS
}