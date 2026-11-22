const Datastore = require('@seald-io/nedb');
const path = require('path');
const fs = require('fs');

// Support Vercel serverless writable /tmp directory
const isServerless = process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME;
const dataDir = isServerless ? '/tmp/nmnora_data' : path.join(__dirname, '../data');

try {
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
} catch (e) {
  console.warn('Data directory creation notice:', e.message);
}

const productsDB = new Datastore({
  filename: path.join(dataDir, 'products.db'),
  autoload: true,
});

const ordersDB = new Datastore({
  filename: path.join(dataDir, 'orders.db'),
  autoload: true,
});

module.exports = { productsDB, ordersDB };
