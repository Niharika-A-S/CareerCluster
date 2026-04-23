const mongoose = require('mongoose');

async function connectDb() {
  const uri = process.env.MONGO_URI;
  if (!uri) {
    const err = new Error('MONGO_URI is required');
    err.statusCode = 500;
    throw err;
  }

  mongoose.set('strictQuery', true);

  await mongoose.connect(uri, {
    autoIndex: process.env.NODE_ENV !== 'production',
  });
}

module.exports = { connectDb };

