const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
  name: { type: String, required: true },
  lessons: { type: Number, required: true },
  duration: { type: String, required: true },
  students: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Student' }],
  description:{type:String},
  image: {type:String},
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Course', courseSchema);