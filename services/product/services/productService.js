const Product = require('../models/product');

// Yeni ürün oluşturma
const createProduct = async (productData) => {
  const product = new Product(productData);
  return await product.save();
};

const getProducts = async (filters, options) => {
    const { sortField, sortOrder, limit, page, globalFilter } = options;
    const query = {};
  
    // Global filter için OR sorgusu
    if (globalFilter) {
      query.$or = [
        { name: { $regex: globalFilter, $options: 'i' } },
        { description: { $regex: globalFilter, $options: 'i' } },
        { category: { $regex: globalFilter, $options: 'i' } }
      ];
    }
  
    // Diğer filtreleri ekle
    Object.assign(query, filters);
  
    const productQuery = Product.find(query);
  
    if (sortField && sortOrder) {
      const sort = {};
      sort[sortField] = sortOrder === 'desc' ? -1 : 1;
      productQuery.sort(sort);
    }
  
    if (limit) {
      const pageNumber = page || 1;
      productQuery.skip((pageNumber - 1) * limit).limit(limit);
    }
  
    const products = await productQuery.exec();
    const total = await Product.countDocuments(query);
  
    return { products, total, page: page || 1, limit };
  };
  

// ID ile ürün getirme
const getProductById = async (id) => {
  return await Product.findById(id);
};

// Ürün güncelleme
const updateProduct = async (id, productData) => {
  return await Product.findByIdAndUpdate(id, productData, { new: true });
};

// Ürün silme
const deleteProduct = async (id) => {
  return await Product.findByIdAndDelete(id);
};

module.exports = {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct
};
