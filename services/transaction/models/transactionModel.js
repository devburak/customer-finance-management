const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  customer: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer', required: true }, // Müşteri referansı
  receivable: { type: Number, required: false }, // Alacak tutarı
  payable: { type: Number, required: false }, // Borç tutarı
  amount: { type: Number, required: false }, // Toplam tutar
  description: { type: String, required: false }, // İşlem açıklaması
  date: { type: Date, default: Date.now }, // İşlem tarihi
  balanceAfterTransaction: { type: Number, required: true, default: 0 }, // İşlem sonrası bakiye
  category: { type: String, required: false }, // İşlem kategorisi
  paymentMethod: { type: String, required: false }, // Ödeme yöntemi
  type: { type: String, required: false }, // Ödeme yöntemi
  currency: { type: String, default: 'TL', enum: ['TL', 'USD', 'EUR', 'GBP', 'JPY', 'AUD', 'CAD', 'CHF', 'CNY', 'SEK', 'NZD'] } // Para birimi
}, { timestamps: true }); // Zaman damgaları

module.exports = mongoose.model('Transaction', transactionSchema);

