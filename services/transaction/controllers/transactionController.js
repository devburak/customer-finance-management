const transactionService = require('../services/transactionService');

// Yeni işlem oluşturma
exports.createTransaction = async (req, res) => {
  try {
    const transaction = await transactionService.createTransaction(req.body);
    res.status(201).json(transaction);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Tüm işlemleri getirme (filtreleme ile)
exports.getTransactions = async (req, res) => {
  try {
    const filters = req.query;
    const transactions = await transactionService.getTransactions(filters);
    res.status(200).json(transactions);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// ID ile işlem getirme
exports.getTransactionById = async (req, res) => {
  try {
    const transaction = await transactionService.getTransactionById(req.params.id);
    res.status(200).json(transaction);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

// İşlem güncelleme
exports.updateTransaction = async (req, res) => {
  try {
    const transaction = await transactionService.updateTransaction(req.params.id, req.body);
    res.status(200).json(transaction);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// İşlem silme
exports.deleteTransaction = async (req, res) => {
  try {
    await transactionService.deleteTransaction(req.params.id);
    res.status(204).send();
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Müşteri bakiyesini getirme
exports.getCustomerBalance = async (req, res) => {
  try {
    const balance = await transactionService.getCustomerBalance(req.params.customerId);
    res.status(200).json({ balance });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
