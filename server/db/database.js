const Datastore = require('@seald-io/nedb');
const path = require('path');
const fs = require('fs');

const dataDir = path.join(__dirname, '../data');
if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });

const productsDB = new Datastore({
  filename: path.join(dataDir, 'products.db'),
  autoload: true,
});

const ordersDB = new Datastore({
  filename: path.join(dataDir, 'orders.db'),
  autoload: true,
});

module.exports = { productsDB, ordersDB };
