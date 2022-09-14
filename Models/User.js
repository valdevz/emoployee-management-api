const mongoose    = require('mongoose'),
      Schema      = mongoose.Schema;

let User = new Schema({

  userId              :  { type: String, required: true, trim: true },
  emailId             :  { type: String, required: false, trim: true },
  rol                 :  { type: String, required: true, trim: true },
  name                :  { type: String, required: true, trim: true }, 
  phoneNo             :  { type: String, required: true, trim: true },
  celPhone            :  { type: String, required: true, trim: true },
  lastname            :  { type: String, required: true, trim: true },
  secondLastname      :  { type: String, required: true, trim: true },
  dateOfBirth         :  { type: Date,   required: true, trim: true },
  address             :  { type: String, required: true, trim: true },
  coordinates         :  { type: Array,  required: true },
  subUrb              :  { type: String, required: true, default: "", trim: true },
  electorKey          :  { type: String, required: true, default: "", trim: true },
  curp                :  { type: String, required: true, default: "", trim: true },
  electoralSection    :  { type: String, required: true, default: "", trim: true },
  createdBy           :  { type: String, required: true, default: "" },

  password            :  { type: String, default: "", trim: true },
  token               :  { type: String, default: "", trim: true },
  inChargeOf          :  { type: Array,  default: [] },
  immediatelyManager  :  { type: String, default: "", trim: true },
  socialSupport       :  { type: Array,  default: [], },
  givenJob            :  { type: Boolean, default: false },
  nameOfJob           :  { type: String, default: "", trim: true },
  createdDate         :  { type: Number, default: Date.now, index: true },
  updatedDate         :  { type: Number, default: Date.now, index: true },
})

module.exports = mongoose.model('User',User);