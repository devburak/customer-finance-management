const Customer = require('../models/customerModel'); // Doğru dosya yolunu ekleyin
const Transaction = require('../../transaction/models/transactionModel');
const StockTransaction = require('../../product/models/stockTransaction');
const mongoose = require('mongoose');


// Yeni müşteri oluşturma
const createCustomer = async (customerData) => {
  const customer = new Customer(customerData);
  return await customer.save();
};

// Filtreli müşteri getirme (sıralama, limit ve sayfalama ile)
const getCustomers = async (filters, options) => {
  const { sortField, sortOrder, limit, page, globalFilter } = options;
  const query = {};

  // Global filter için OR sorgusu
  if (globalFilter) {
    query.$or = [
      { companyName: { $regex: globalFilter, $options: 'i' } },
      { 'responsiblePerson.name': { $regex: globalFilter, $options: 'i' } },
      { taxNumber: { $regex: globalFilter, $options: 'i' } },
      { 'responsiblePerson.phone': { $regex: globalFilter, $options: 'i' } },
      { 'responsiblePerson.email': { $regex: globalFilter, $options: 'i' } },
      { 'contactInfo.phone': { $regex: globalFilter, $options: 'i' } },
      { 'contactInfo.email': { $regex: globalFilter, $options: 'i' } }
    ];
  }

  // Diğer filtreleri ekle
  Object.assign(query, filters);

  const customerQuery = Customer.find(query);

  if (sortField && sortOrder) {
    const sort = {};
    sort[sortField] = sortOrder === 'desc' ? -1 : 1;
    customerQuery.sort(sort);
  }

  if (limit) {
    const pageNumber = page || 1;
    customerQuery.skip((pageNumber - 1) * limit).limit(limit);
  }

  const customers = await customerQuery.exec();
  const total = await Customer.countDocuments(query);

  return { customers, total, page: page || 1, limit };
};


// ID ile müşteri getirme
const getCustomerById = async (id) => {
  return await Customer.findById(id);
};

// Müşteri güncelleme
const updateCustomer = async (id, customerData) => {
  return await Customer.findByIdAndUpdate(id, customerData, { new: true });
};

// Müşteri silme
const deleteCustomer = async (id) => {
  return await Customer.findByIdAndDelete(id);
};


// Belirli bir müşteri için finansal ve stok işlemlerinin özetini getirme
const getCustomerSummary = async (customerId) => {
  // Finansal özet
  const financialTransactions = await Transaction.find({ customer: new mongoose.Types.ObjectId(customerId) });
  const totalReceivables = financialTransactions.reduce((acc, tx) => acc + (tx.receivable || 0), 0);
  const totalPayables = financialTransactions.reduce((acc, tx) => acc + (tx.payable || 0), 0);
  const balance = totalReceivables - totalPayables;

  // Stok özet
  const stockTransactions = await StockTransaction.find({ customer: new mongoose.Types.ObjectId(customerId) });
  const totalProductsSold = stockTransactions.reduce((acc, tx) => acc + (tx.type === 'sale' ? tx.quantity : 0), 0);
  const totalProductsPurchased = stockTransactions.reduce((acc, tx) => acc + (tx.type === 'purchase' ? tx.quantity : 0), 0);

  // Son 6 aylık borç alacak, alınan ve satılan ürün bilgileri
  const sixMonthsAgo = new Date();
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
  sixMonthsAgo.setHours(0, 0, 0, 0); // Günü başlatın

  const monthlyFinancialSummary = await Transaction.aggregate([
    {
      $match: {
        customer: new mongoose.Types.ObjectId(customerId),
        date: { $gte: sixMonthsAgo }
      }
    },
    {
      $group: {
        _id: { month: { $month: "$date" }, year: { $year: "$date" } },
        totalReceivables: { $sum: "$receivable" },
        totalPayables: { $sum: "$payable" }
      }
    },
    { $sort: { "_id.year": 1, "_id.month": 1 } }
  ]);

  const monthlyStockSummary = await StockTransaction.aggregate([
    {
      $match: {
        customer: new mongoose.Types.ObjectId(customerId),
        date: { $gte: sixMonthsAgo }
      }
    },
    {
      $group: {
        _id: { month: { $month: "$date" }, year: { $year: "$date" } },
        totalProductsSold: { $sum: { $cond: [{ $eq: ["$type", "sale"] }, "$quantity", 0] } },
        totalProductsPurchased: { $sum: { $cond: [{ $eq: ["$type", "purchase"] }, "$quantity", 0] } }
      }
    },
    { $sort: { "_id.year": 1, "_id.month": 1 } }
  ]);

  return {
    totalReceivables,
    totalPayables,
    balance,
    totalProductsSold,
    totalProductsPurchased,
    monthlyFinancialSummary,
    monthlyStockSummary
  };
};

module.exports = {
  createCustomer,
  getCustomers,
  getCustomerById,
  updateCustomer,
  deleteCustomer,
  getCustomerSummary
};
