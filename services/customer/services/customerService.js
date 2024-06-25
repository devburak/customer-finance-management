const Customer = require('../models/customerModel'); // Doğru dosya yolunu ekleyin

// Yeni müşteri oluşturma
const createCustomer = async (customerData) => {
  const customer = new Customer(customerData);
  return await customer.save();
};

// Filtreli müşteri getirme
const getCustomers = async (filters) => {
  const query = {};

  // Şirket adına göre filtreleme
  if (filters.companyName) {
    query.companyName = { $regex: filters.companyName, $options: 'i' }; // case-insensitive arama
  }

  // Sorumlu kişiye göre filtreleme
  if (filters.responsiblePersonName) {
    query['responsiblePerson.name'] = { $regex: filters.responsiblePersonName, $options: 'i' }; // case-insensitive arama
  }

  // Vergi numarasına göre filtreleme
  if (filters.taxNumber) {
    query.taxNumber = { $regex: filters.taxNumber, $options: 'i' }; // case-insensitive arama
  }

  return await Customer.find(query);
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

module.exports = {
  createCustomer,
  getCustomers,
  getCustomerById,
  updateCustomer,
  deleteCustomer
};
