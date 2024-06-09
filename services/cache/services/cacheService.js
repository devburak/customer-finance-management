const NodeCache = require('node-cache');
const cache = new NodeCache();

const setCache = (key, value, ttl = 60) => {
  cache.set(key, value, ttl);
};

const getCache = (key) => {
  return cache.get(key);
};

const deleteCache = (key) => {
  cache.del(key);
};

const flushCache = () => {
  cache.flushAll();
};

module.exports = {
  setCache,
  getCache,
  deleteCache,
  flushCache
};
