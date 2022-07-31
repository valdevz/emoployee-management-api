const mongoose    = require('mongoose'),
      Schema      = mongoose.Schema;

let User = new Schema({

  userId            :  { type: String, required: true, trim: true },
  emailId           :  { type: String, required: true, trim: true },
  rol               :  { type: String, required: true, trim: true },
  name              :  { type: String, required: true, trim: true }, 
  phoneNo           :  { type: String, required: true, trim: true },
  lastname          :  { type: String, required: true, trim: true },
  secondLastname    :  { type: String, required: true, trim: true },
  dateOfBirth       :  { type: Date, required: true, trim: true },
  address           :  { type: Array, required: true, trim: true },
  password          :  { type: String, default: "", trim: true },
  token             :  { type: String, default: "", trim: true },
  inCharge          :  { type: Array, default: [] },
  createdDate       :  { type: Number, default: Date.now, index: true },
  updatedDate       :  { type: Number, default: Date.now, index: true }

})

module.exports = mongoose.model('User',User);