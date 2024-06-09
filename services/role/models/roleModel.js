const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const roleSchema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  description: {
    type: String,
    required: false
  },
  permissions: {
    type: [String],
    required: true,
    default:['read']
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Role', roleSchema);
