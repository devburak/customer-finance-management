const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true,
    select: false  // Varsayılan olarak password alanını hariç tutar
  },
  role: {
    type: Schema.Types.ObjectId,
    ref: 'Role',
    required: true
  },
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: false
  },
  resetPasswordToken: String,
  resetPasswordExpires: Date,
  updatedBy: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true,
  toJSON: {
    transform: function(doc, ret) {
      delete ret.password;  // JSON dönüşümünde password alanını kaldırır
      return ret;
    }
  },
  toObject: {
    transform: function(doc, ret) {
      delete ret.password;  // Object dönüşümünde password alanını kaldırır
      return ret;
    }
  }
});

module.exports = mongoose.model('User', userSchema);