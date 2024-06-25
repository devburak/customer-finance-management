const express = require('express');
const router = express.Router();
const customerService = require('../services/customerService'); // Doğru dosya yolunu ekleyin

// Yeni müşteri oluşturma
router.post('/customers', async (req, res) => {
  try {
    const customer = await customerService.createCustomer(req.body);
    res.status(201).json(customer);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Tüm müşterileri veya filtreli müşterileri getirme
router.get('/customers', async (req, res) => {
  try {
    const filters = req.query;
    const customers = await customerService.getCustomers(filters);
    res.status(200).json(customers);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// ID ile müşteri getirme
router.get('/customers/:id', async (req, res) => {
  try {
    const customer = await customerService.getCustomerById(req.params.id);
    if (!customer) {
      return res.status(404).json({ message: 'Customer not found' });
    }
    res.status(200).json(customer);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Müşteri güncelleme
router.put('/customers/:id', async (req, res) => {
  try {
    const customer = await customerService.updateCustomer(req.params.id, req.body);
    if (!customer) {
      return res.status(404).json({ message: 'Customer not found' });
    }
    res.status(200).json(customer);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Müşteri silme
router.delete('/customers/:id', async (req, res) => {
  try {
    const customer = await customerService.deleteCustomer(req.params.id);
    if (!customer) {
      return res.status(404).json({ message: 'Customer not found' });
    }
    res.status(200).json({ message: 'Customer deleted successfully' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;
