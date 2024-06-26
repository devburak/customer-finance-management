const Transaction = require('../models/transactionModel');
const Customer = require('../../customer/models/customerModel');

// Yeni işlem oluşturma
const createTransaction = async (transactionData) => {
  const transaction = new Transaction(transactionData);
  await transaction.save();
  
  // İşlem sonrası bakiyeyi güncelleme
  const customerTransactions = await Transaction.find({ customer: transactionData.customer });
  const balance = customerTransactions.reduce((acc, curr) => {
    return curr.type === 'alacak' ? acc + curr.amount : acc - curr.amount;
  }, 0);
  
  return { ...transaction.toObject(), balance };
};

// Tüm işlemleri getirme
const getTransactions = async (filters) => {
  return await Transaction.find(filters).populate('customer');
};

// ID ile işlem getirme
const getTransactionById = async (id) => {
  return await Transaction.findById(id).populate('customer');
};

// İşlem güncelleme
const updateTransaction = async (id, transactionData) => {
  return await Transaction.findByIdAndUpdate(id, transactionData, { new: true });
};

// İşlem silme
const deleteTransaction = async (id) => {
  return await Transaction.findByIdAndDelete(id);
};

// Müşteri bakiyesini hesaplama
const getCustomerBalance = async (customerId) => {
  const customerTransactions = await Transaction.find({ customer: customerId });
  const balance = customerTransactions.reduce((acc, curr) => {
    return curr.type === 'alacak' ? acc + curr.amount : acc - curr.amount;
  }, 0);
  
  return balance;
};

module.exports = {
  createTransaction,
  getTransactions,
  getTransactionById,
  updateTransaction,
  deleteTransaction,
  getCustomerBalance
};
