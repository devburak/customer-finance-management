const express = require('express');
const connectDB = require('./config/db');
const helmet = require('helmet');
const userService = require('./services/user');
const roleService = require('./services/role');
const logService = require('./services/log'); // Log servisini ekleyin
const authMiddleware = require('./services/user/middlewares/authMiddleware');
const cacheRoutes = require('./services/cache/routes/cacheRoutes');
const rateLimit = require('express-rate-limit');
const { isAdmin, isAdminOrSelf } = require('./middlewares/roleMiddleware');
const logger = require('./utils/logger');

// const requestLogger = require('./middlewares/requestLogger');
const logMiddleware = require('./middlewares/logMiddleware');

require('dotenv').config();
const limiter = rateLimit({
	windowMs: 15 * 60 * 1000, // 15 minutes
	limit: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes).
	keyGenerator: (req) => {
    return req.ip;
  },
  handler: (req, res) => {
    res.status(429).json({ message: 'Too many requests, please try again later.' });
  }
})

const app = express();
// Proxy ayarını yapın
app.set('trust proxy', 1);

app.use(limiter);
// MongoDB Bağlantısı
connectDB();
// Helmet'i kullanarak güvenlik başlıklarını ayarlayın
app.use(helmet());
app.use(express.json());

// Request logger middleware'i uygulamak
app.use(logMiddleware);

app.use('/api', userService);
app.use('/api', roleService);
app.use('/api', logService); // Log servisini ekleyin
app.use('/api', cacheRoutes);

// Protected route example
app.get('/api/protected', authMiddleware, isAdmin, (req, res) => {
  res.json({ message: 'This is a protected route' });
});

app.use(require('./middlewares/errorHandler'));

module.exports = app;