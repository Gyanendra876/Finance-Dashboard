const mongoose = require('mongoose');
const csv = require('csvtojson');
const path = require('path');
require('dotenv').config();

const Transaction = require('./models/Transaction');
const User = require('./models/user');

mongoose.connect(process.env.MONGO_URI)
  .then(async () => {
    console.log('✅ MongoDB connected');

    const filePath = path.join(__dirname, 'transactions_sample.csv');
    const transactions = await csv().fromFile(filePath);

    const cleaned = [];

    for (let t of transactions) {
      const user = await User.findOne({ email: t.userEmail }); // match CSV email
      if (!user) {
        console.warn(`⚠️  User not found for email: ${t.userEmail}, skipping transaction`);
        continue;
      }

      cleaned.push({
        userId: user._id,
        type: t.type,
        category: t.category,
        description: t.description,
        amount: Number(t.amount),
        date: new Date(t.date),
      });
    }

    if (cleaned.length === 0) {
      console.warn('⚠️ No valid transactions to insert');
      return mongoose.connection.close();
    }

    await Transaction.insertMany(cleaned);
    console.log('✅ Transactions inserted successfully!');

    mongoose.connection.close();
  })
  .catch(err => console.error('❌ DB error:', err));
