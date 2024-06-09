const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const logSchema = new Schema({
  action: {
    type: String,
    required: true
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: false
  },
  ip: {
    type: String,
    required: false
  },
  details: {
    type: String,
    required: false
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Log', logSchema);