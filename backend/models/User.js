const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName:  { type: String, required: true },
  email:     { type: String, required: true, unique: true },
  contact:   { type: String, required: true },
 
  password:  { type: String, required: true },
  collegeYear: { type: String },
  enrollmentNo:{type:Number},
  branch:    { type: String},
  role:      { type: String, enum: ['student', 'librarian'], default: 'student' },
   isApproved: {
    type: Boolean,
    default: false   
  },
  isActive: {
  type: Boolean,
  default: true,  // true means user can log in
}

});

module.exports = mongoose.model('User', userSchema);
