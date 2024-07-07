const productService = require('../services/productService');

// Yeni ürün oluşturma
exports.createProduct = async (req, res) => {
  try {
    const product = await productService.createProduct(req.body);
    res.status(201).json(product);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Tüm ürünleri getirme (filtreleme, sıralama, limit ve sayfalama ile)
exports.getProducts = async (req, res) => {
    try {
      const { globalFilter, sortField, sortOrder, limit, page, ...filters } = req.query;
  
      const options = {
        sortField,
        sortOrder,
        limit: parseInt(limit),
        page: parseInt(page),
        globalFilter
      };
  
      const { products, total, page: currentPage, limit: currentLimit } = await productService.getProducts(filters, options);
      res.status(200).json({ products, total, page: currentPage, limit: currentLimit });
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  };
  

// ID ile ürün getirme
exports.getProductById = async (req, res) => {
  try {
    const product = await productService.getProductById(req.params.id);
    res.status(200).json(product);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

// Ürün güncelleme
exports.updateProduct = async (req, res) => {
  try {
    const product = await productService.updateProduct(req.params.id, req.body);
    res.status(200).json(product);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Ürün silme
exports.deleteProduct = async (req, res) => {
  try {
    await productService.deleteProduct(req.params.id);
    res.status(204).send();
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
