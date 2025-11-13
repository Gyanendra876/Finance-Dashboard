const Transaction = require('../models/Transaction');
exports.Transaction= async (req, res) => {
  res.render('transaction', { user: req.user,transaction: null});
}

exports.addTransaction = async (req, res) => {
 const { type, category, description, amount, date } = req.body;

  await Transaction.create({
    userId: req.user._id,
    type,
    description,
    category,
    amount,
    date,
  });

  if (type === 'income') req.user.balance += Number(amount);
  else req.user.balance -= Number(amount);
  await req.user.save();

  res.redirect('/dashboard');
};
exports.getEditTransaction = async (req, res) => {
  try {
    const transaction = await Transaction.findById(req.params.id);
    if (!transaction) return res.status(404).send('Transaction not found');
    res.render('transaction', { user: req.user, transaction });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
};

// 🟨 Update Transaction
exports.updateTransaction = async (req, res) => {
  try {
    const { type, category, description, amount } = req.body;
    await Transaction.findByIdAndUpdate(req.params.id, {
      type,
      category,
      description,
      amount
    });
    res.redirect('/dashboard');
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
};

// 🟥 Delete Transaction
exports.deleteTransaction = async (req, res) => {
  try {
    await Transaction.findByIdAndDelete(req.params.id);
    res.redirect('/dashboard');
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
};
