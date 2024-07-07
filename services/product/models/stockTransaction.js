const mongoose = require('mongoose');

const stockTransactionSchema = new mongoose.Schema({
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  type: { type: String, enum: ['alış', 'satış'], required: true }, // 'purchase' for incoming, 'sale' for outgoing
  quantity: { type: Number, required: true },
  price: { type: Number, required: true },
  totalPrice: { type: Number, required: true },
  date: { type: Date, default: Date.now },
  customer: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer', required: true } // Customer modelini kullanarak hem müşteri hem tedarikçi bilgisi
});

module.exports = mongoose.model('StockTransaction', stockTransactionSchema);
