const LoyaltyPoints = require('../models/LoyaltyPoints');

exports.getLoyaltyPoints = async (req, res) => {
  try {
    const loyaltyPoints = await LoyaltyPoints.findOne({ user: req.user.id });
    if (!loyaltyPoints) return res.status(404).json({ message: 'Loyalty points not found' });
    res.json(loyaltyPoints);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.addLoyaltyPoints = async (req, res) => {
  try {
    let loyaltyPoints = await LoyaltyPoints.findOne({ user: req.user.id });
    if (!loyaltyPoints) {
      loyaltyPoints = new LoyaltyPoints({ user: req.user.id, points: req.body.points });
    } else {
      loyaltyPoints.points += req.body.points;
    }
    await loyaltyPoints.save();
    res.json(loyaltyPoints);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.redeemLoyaltyPoints = async (req, res) => {
  try {
    const loyaltyPoints = await LoyaltyPoints.findOne({ user: req.user.id });
    if (!loyaltyPoints) return res.status(404).json({ message: 'Loyalty points not found' });
    if (loyaltyPoints.points < req.body.points) return res.status(400).json({ message: 'Insufficient points' });
    loyaltyPoints.points -= req.body.points;
    await loyaltyPoints.save();
    res.json(loyaltyPoints);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
