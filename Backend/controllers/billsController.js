// controllers/billsController.js
const Bill = require('../models/Bill');
exports.getBills=async (req, res) => {
  const bills = await Bill.find({ userId: req.user });
  res.json({ bills });
};

exports.addBill = async (req, res) => {
  try {
    const { title, amount, dueDate } = req.body;
    const bill = await Bill.create({
      userId: req.user,
      title, amount, dueDate
    });
    res.status(201).json({ msg: 'Bill added', bill });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
};

exports.deleteBill = async (req, res) => {
  try {
    await Bill.findOneAndDelete({ _id: req.params.id, userId: req.user });
    res.json({ msg: 'Bill deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
};
// controllers/billsController.js
