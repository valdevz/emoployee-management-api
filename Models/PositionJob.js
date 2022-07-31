const mongoose    = require( 'mongoose' ),
      Schema      = mongoose.Schema;

let PositionJob = new Schema({

  name              :  { type: String, required: true, trim: true }, 
  totalPersons      :  { type: Number, required: true, trim: true },
  createdDate       :  { type: Number, default: Date.now, index: true },
  updatedDate       :  { type: Number, default: Date.now, index: true }

})

module.exports = mongoose.model( 'PositionJob', PositionJob );