const stockTransactionService = require('../services/stockTransactionService');

// Yeni stok işlemi oluşturma
exports.createStockTransaction = async (req, res) => {
  try {
    const transaction = await stockTransactionService.createStockTransaction(req.body);
    res.status(201).json(transaction);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Tüm stok işlemlerini getirme (filtreleme, sıralama, limit ve sayfalama ile)
exports.getStockTransactions = async (req, res) => {
    try {
      const { globalFilter, sortField, sortOrder, limit, page, ...filters } = req.query;
  
      const options = {
        sortField,
        sortOrder,
        limit: parseInt(limit),
        page: parseInt(page),
        globalFilter
      };
  
      const { transactions, total, page: currentPage, limit: currentLimit } = await stockTransactionService.getStockTransactions(filters, options);
      res.status(200).json({ transactions, total, page: currentPage, limit: currentLimit });
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  };
  

// ID ile stok işlemi getirme
exports.getStockTransactionById = async (req, res) => {
  try {
    const transaction = await stockTransactionService.getStockTransactionById(req.params.id);
    res.status(200).json(transaction);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

// Stok işlemi güncelleme
exports.updateStockTransaction = async (req, res) => {
  try {
    const transaction = await stockTransactionService.updateStockTransaction(req.params.id, req.body);
    res.status(200).json(transaction);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Stok işlemi silme
exports.deleteStockTransaction = async (req, res) => {
  try {
    await stockTransactionService.deleteStockTransaction(req.params.id);
    res.status(204).send();
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
