const Transaction = require('../models/transactionModel');
const Customer = require('../../customer/models/customerModel');

const createTransaction = async (transactionData) => {
  // Önceki tüm işlemleri al
  const customerTransactions = await Transaction.find({ customer: transactionData.customer });

  // Yeni işlemle birlikte güncel bakiyeyi hesapla
  const balanceAfterTransaction = customerTransactions.reduce((acc, curr) => {
    return curr.type === 'alacak' ? acc + curr.amount : acc - curr.amount;
  }, 0) + (transactionData.type === 'alacak' ? transactionData.amount : -transactionData.amount);

  // Yeni işlemi oluştur ve kaydet
  const transaction = new Transaction({ ...transactionData, balanceAfterTransaction });
  await transaction.save();

  return { ...transaction.toObject(), balanceAfterTransaction };
};


// Tüm işlemleri getirme (sıralama, limit ve sayfalama ile)
const getTransactions = async (filters, options) => {
  const { sortField, sortOrder, limit, page, globalFilter } = options;
  const query = {};

  // Global filter için OR sorgusu
  if (globalFilter) {
    query.$or = [
      { paymentMethod: { $regex: globalFilter, $options: 'i' } },
      { category: { $regex: globalFilter, $options: 'i' } },
      { type: { $regex: globalFilter, $options: 'i' } },
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

// Son 6 aya ait toplam alacak ve borç bilgilerini getirme
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
        totalAlacak: {
          $sum: {
            $cond: [{ $eq: ["$type", "alacak"] }, "$amount", 0]
          }
        },
        totalBorc: {
          $sum: {
            $cond: [{ $eq: ["$type", "borç"] }, "$amount", 0]
          }
        }
      }
    },
    {
      $sort: { "_id.year": 1, "_id.month": 1 }
    }
  ]);

  const result = transactions.map(t => ({
    month: `${t._id.year}-${t._id.month}`,
    alacak: t.totalAlacak,
    borç: t.totalBorc
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
