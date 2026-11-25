const path = require('path');

// Ensure .env is loaded regardless of process working directory
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });
require('dotenv').config({ path: path.join(__dirname, '..', '..', '.env') });

// Absolute fallback: if DATABASE_URL is not set, resolve absolute path to dev.db
if (!process.env.DATABASE_URL) {
  const dbPath = path.resolve(__dirname, '..', 'prisma', 'dev.db');
  process.env.DATABASE_URL = `file:${dbPath}`;
}

const { PrismaClient } = require('@prisma/client');

let prisma;

if (process.env.NODE_ENV === 'production') {
  prisma = new PrismaClient();
} else {
  if (!global.prisma) {
    global.prisma = new PrismaClient();
  }
  prisma = global.prisma;
}

module.exports = prisma;
