const Transaction = require('../models/Transaction');
const User = require('../models/user');

// List all transactions
exports.listTransactions = async (req, res) => {
  try {
    const userId = req.user.id; // <-- use .id
    const transactions = await Transaction.find({ userId }).sort({ date: -1 }).lean();
    res.json({ transactions });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
};

// Add a transaction
exports.addTransaction = async (req, res) => {
  try {
    let { type, category, description, amount, date } = req.body;

    type = String(type).toLowerCase().trim();
    if (!["income", "expense"].includes(type)) {
      return res.status(400).json({ msg: "Invalid type" });
    }

    const userId = req.user.id; // <-- use .id
    if (!userId) return res.status(401).json({ msg: "Unauthorized" });

    amount = Number(amount);
    if (isNaN(amount)) return res.status(400).json({ msg: "Invalid amount" });

    date = date ? new Date(date) : new Date();

    const transaction = await Transaction.create({
      userId,
      type,
      category,
      description,
      amount,
      date
    });

    // Update user balance
    const user = await User.findById(userId);
    if (user) {
      const transactions = await Transaction.find({ userId });
      const balance = transactions.reduce((acc, t) => acc + (t.type === "income" ? t.amount : -t.amount), 0);
      user.balance = balance;
      await user.save();
    }

    res.status(201).json({ msg: "Transaction added", transaction });
  } catch (err) {
    console.error("Transaction Add Error:", err);
    res.status(500).json({ msg: "Server error" });
  }
};

// Get single transaction
exports.getTransaction = async (req, res) => {
  try {
    const userId = req.user.id;
    const tx = await Transaction.findOne({ _id: req.params.id, userId }).lean();
    if (!tx) return res.status(404).json({ msg: 'Transaction not found' });
    res.json({ transaction: tx });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
};

// Update transaction
exports.updateTransaction = async (req, res) => {
  try {
    const { type, category, description, amount } = req.body;
    const userId = req.user.id;

    const tx = await Transaction.findOneAndUpdate(
      { _id: req.params.id, userId },
      { type, category, description, amount },
      { new: true }
    );

    if (!tx) return res.status(404).json({ msg: 'Transaction not found' });

    // Recalculate user balance
    const user = await User.findById(userId);
    if (user) {
      const transactions = await Transaction.find({ userId });
      const balance = transactions.reduce((acc, t) => acc + (t.type === "income" ? t.amount : -t.amount), 0);
      user.balance = balance;
      await user.save();
    }

    res.json({ msg: 'Transaction updated', transaction: tx });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
};

// Delete transaction
exports.deleteTransaction = async (req, res) => {
  try {
    const userId = req.user.id;

    await Transaction.findOneAndDelete({ _id: req.params.id, userId });

    // Update user balance
    const user = await User.findById(userId);
    if (user) {
      const transactions = await Transaction.find({ userId });
      const balance = transactions.reduce((acc, t) => acc + (t.type === "income" ? t.amount : -t.amount), 0);
      user.balance = balance;
      await user.save();
    }

    res.json({ msg: 'Transaction deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
};
