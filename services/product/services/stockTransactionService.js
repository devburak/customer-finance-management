const StockTransaction = require('../models/stockTransaction');
const Product = require('../models/product');

// Yeni stok işlemi oluşturma
const createStockTransaction = async (transactionData) => {
  const transaction = new StockTransaction(transactionData);
  await transaction.save();

  // Stok güncellemesi
  const product = await Product.findById(transactionData.product);
  if (transactionData.type === 'purchase') {
    product.stock += transactionData.quantity;
  } else if (transactionData.type === 'sale') {
    product.stock -= transactionData.quantity;
  }
  await product.save();

  return transaction;
};

// Tüm stok işlemlerini getirme (filtreleme, sıralama, limit ve sayfalama ile)
const getStockTransactions = async (filters, options) => {
    const { sortField, sortOrder, limit, page, globalFilter } = options;
    const query = {};
  
    // Global filter için OR sorgusu
    if (globalFilter) {
      query.$or = [
        { type: { $regex: globalFilter, $options: 'i' } },
        { description: { $regex: globalFilter, $options: 'i' } },
        { category: { $regex: globalFilter, $options: 'i' } }
      ];
    }
  
    // Diğer filtreleri ekle
    Object.assign(query, filters);
  
    const transactionQuery = StockTransaction.find(query).populate('product customer');
  
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
    const total = await StockTransaction.countDocuments(query);
  
    return { transactions, total, page: page || 1, limit };
  };

// ID ile stok işlemi getirme
const getStockTransactionById = async (id) => {
  return await StockTransaction.findById(id).populate('product customer');
};

// Stok işlemi güncelleme
const updateStockTransaction = async (id, transactionData) => {
  const transaction = await StockTransaction.findByIdAndUpdate(id, transactionData, { new: true });

  // Stok güncellemesi
  const product = await Product.findById(transactionData.product);
  if (transactionData.type === 'alış') {
    product.stock += transactionData.quantity;
  } else if (transactionData.type === 'satış') {
    product.stock -= transactionData.quantity;
  }
  await product.save();

  return transaction;
};

// Stok işlemi silme
const deleteStockTransaction = async (id) => {
  const transaction = await StockTransaction.findByIdAndDelete(id);

  // Stok güncellemesi
  const product = await Product.findById(transaction.product);
  if (transaction.type === 'alış') {
    product.stock -= transaction.quantity;
  } else if (transaction.type === 'satış') {
    product.stock += transaction.quantity;
  }
  await product.save();

  return transaction;
};

module.exports = {
  createStockTransaction,
  getStockTransactions,
  getStockTransactionById,
  updateStockTransaction,
  deleteStockTransaction
};
