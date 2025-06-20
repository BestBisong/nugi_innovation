const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
  fullname: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true },
  address:{type:String},
  course: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Course' }],
  registrationDate: { type: Date, required: true },
  profileImage:{type:String},
  status: { type: String, default: 'inactive' },
  createdAt: { type: Date, default:Date.now }
});

module.exports = mongoose.model('Student', studentSchema);