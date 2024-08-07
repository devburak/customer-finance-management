const express = require('express');
const connectDB = require('./config/db');
const helmet = require('helmet');
const cors = require('cors');
const userService = require('./services/user');
const roleService = require('./services/role');
const logService = require('./services/log'); // Log servisini ekleyin
const authMiddleware = require('./services/user/middlewares/authMiddleware');
const cacheRoutes = require('./services/cache/routes/cacheRoutes');
const rateLimit = require('express-rate-limit');
const { isAdmin, isAdminOrSelf } = require('./middlewares/roleMiddleware');
const logger = require('./utils/logger');
const customerService = require('./services/customer');
const transactionService = require('./services/transaction');
// const requestLogger = require('./middlewares/requestLogger');
const logMiddleware = require('./middlewares/logMiddleware');
const { productService, stockService } = require('./services/product');

require('dotenv').config();
const limiter = rateLimit({
	windowMs: 15 * 60 * 1000, // 15 minutes
	limit: 1000, // Limit each IP to 100 requests per `window` (here, per 15 minutes).
	keyGenerator: (req) => {
    return req.ip;
  },
  handler: (req, res) => {
    res.status(429).json({ message: 'Too many requests, please try again later.' });
  }
})

const app = express();
// Proxy ayarını yapın
app.set('trust proxy', true);

app.use(limiter);
// MongoDB Bağlantısı
connectDB();
// Helmet'i kullanarak güvenlik başlıklarını ayarlayın
app.use(helmet());
app.use(express.json());

// Request logger middleware'i uygulamak
app.use(logMiddleware);
app.use(cors()); 

// Protected route example
app.get('/isalive', (req, res) => {
  res.json({ message: 'OK' });
});

app.use('/api', userService);
app.use('/api', roleService);
app.use('/api', logService); // Log servisini ekleyin
app.use('/api', cacheRoutes);
app.use('/api', customerService);
app.use('/api', transactionService);
app.use('/api', productService);
app.use('/api', stockService);

// Protected route example
app.get('/api/protected', authMiddleware, isAdmin, (req, res) => {
  res.json({ message: 'This is a protected route' });
});

app.use(require('./middlewares/errorHandler'));

module.exports = app;