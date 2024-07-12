const Transaction = require('../models/transactionModel');
const Customer = require('../../customer/models/customerModel');



// Diğer işlemler
const getTransactions = async (filters, options) => {
  const { sortField="createdAt", sortOrder, limit, page, globalFilter } = options;
  const query = {};

  // Global filter için OR sorgusu
  if (globalFilter) {
    query.$or = [
      { paymentMethod: { $regex: globalFilter, $options: 'i' } },
      { category: { $regex: globalFilter, $options: 'i' } },
      { description: { $regex: globalFilter, $options: 'i' } }
    ];
  }

  // Diğer filtreleri ekle
  Object.assign(query, filters);

  const transactionQuery = Transaction.find(query).populate('customer');

  if (sortField && sortOrder) {
    const sort = {};
    sort[sortField] = sortOrder === 'desc' ? -1 : 1;
    transactionQuery.sort(sort);
  }

  if (limit) {
    const pageNumber = page || 1;
    transactionQuery.skip((pageNumber - 1) * limit).limit(limit);
  }

  const transactions = await transactionQuery.exec();
  const total = await Transaction.countDocuments(query);

  return { transactions, total, page: page || 1, limit };
};

// ID ile işlem getirme
const getTransactionById = async (id) => {
  return await Transaction.findById(id).populate('customer');
};

// Yeni işlem oluşturma
const createTransaction = async (transactionData) => {
  const transaction = new Transaction(transactionData);
  await transaction.save();
  return transaction;
};

// İşlem güncelleme
const updateTransaction = async (id, transactionData) => {
  const transaction = await Transaction.findByIdAndUpdate(id, transactionData, { new: true });
  return transaction;
};

// İşlem silme
const deleteTransaction = async (id) => {
  return await Transaction.findByIdAndDelete(id);
};
// Müşteri bakiyesini hesaplama
const getCustomerBalance = async (customerId) => {
  const transactions = await Transaction.find({ customer: customerId });
  const balance = transactions.reduce((acc, transaction) => {
    const receivable = transaction.receivable || 0;
    const payable = transaction.payable || 0;
    return acc + receivable - payable;
  }, 0);
  return balance;
};

const getMonthlyTotals = async () => {
  const sixMonthsAgo = new Date();
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

  const transactions = await Transaction.aggregate([
    {
      $match: {
        date: { $gte: sixMonthsAgo }
      }
    },
    {
      $group: {
        _id: {
          month: { $month: "$date" },
          year: { $year: "$date" }
        },
        totalReceivable: {
          $sum: "$receivable"
        },
        totalPayable: {
          $sum: "$payable"
        }
      }
    },
    {
      $sort: { "_id.year": 1, "_id.month": 1 }
    }
  ]);

  const result = transactions.map(t => ({
    month: `${t._id.year}-${t._id.month}`,
    receivable: t.totalReceivable || 0,
    payable: t.totalPayable || 0
  }));

  return result;
};

module.exports = {
  createTransaction,
  getTransactions,
  getTransactionById,
  updateTransaction,
  deleteTransaction,
  getCustomerBalance,
  getMonthlyTotals
};
