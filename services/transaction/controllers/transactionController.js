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

// // Tüm işlemleri getirme (filtreleme, sıralama, limit ve sayfalama ile)
// exports.getTransactions = async (req, res) => {
//   try {
//     const filters = { ...req.query };
//     delete filters.sortField;
//     delete filters.sortOrder;
//     delete filters.limit;
//     delete filters.page;

//     const options = {
//       sortField: req.query.sortField,
//       sortOrder: req.query.sortOrder,
//       limit: parseInt(req.query.limit),
//       page: parseInt(req.query.page)
//     };

//     const { transactions, total, page, limit } = await transactionService.getTransactions(filters, options);
//     res.status(200).json({ transactions, total, page, limit });
//   } catch (error) {
//     res.status(400).json({ message: error.message });
//   }
// };

// Tüm işlemleri getirme (filtreleme, sıralama, limit ve sayfalama ile)
exports.getTransactions = async (req, res) => {
  try {
    const { globalFilter, sortField, sortOrder, limit, page, ...filters } = req.query;

    const options = {
      sortField,
      sortOrder,
      limit: parseInt(limit),
      page: parseInt(page),
      globalFilter
    };

    const { transactions, total, page: currentPage, limit: currentLimit } = await transactionService.getTransactions(filters, options);
    res.status(200).json({ transactions, total, page: currentPage, limit: currentLimit });
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



// Son 6 aya ait toplam alacak ve borç bilgilerini getirme
exports.getMonthlyTotals = async (req, res) => {
  try {
    const totals = await transactionService.getMonthlyTotals();
    res.status(200).json(totals);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};