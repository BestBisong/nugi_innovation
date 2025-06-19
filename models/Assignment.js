const mongoose = require('mongoose');

const assignmentSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  dueDate: Date,
  file: String,
  submittedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  submittedAt: { type: Date, default: Date.now },
  status: { type: String, default: 'submitted' },
  grade: Number,
  feedback: String
});

module.exports = mongoose.model('Assignment', assignmentSchema);