const customerService = require('../services/customerService'); // Doğru dosya yolunu ekleyin

// Yeni müşteri oluşturma
exports.createCustomer = async (req, res) => {
  try {
    const customer = await customerService.createCustomer(req.body);
    res.status(201).json(customer);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Mevcut müşteri güncelleme
exports.updateCustomer = async (req, res) => {
  try {
    const customer = await customerService.updateCustomer(req.params.id, req.body);
    res.json(customer);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// ID'ye göre müşteri getirme
exports.getCustomerById = async (req, res) => {
  try {
    const customer = await customerService.getCustomerById(req.params.id);
    res.json(customer);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

// Tüm müşterileri getirme (filtreleme ile)
exports.getAllCustomers = async (req, res) => {
  try {
    const filters = req.query;
    const customers = await customerService.getCustomers(filters);
    res.json(customers);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Mevcut müşteri silme
exports.deleteCustomer = async (req, res) => {
  try {
    await customerService.deleteCustomer(req.params.id);
    res.status(204).send();
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
