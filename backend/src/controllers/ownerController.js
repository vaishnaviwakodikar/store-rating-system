const { Rating, User, Store } = require('../models/index');

const getOwnerDashboard = async (req, res) => {
  try {
    const store = await Store.findOne({ where: { ownerId: req.user.id } });

    if (!store) {
      return res.status(404).json({ message: 'No store found for this owner' });
    }

    const ratings = await Rating.findAll({
      where: { storeId: store.id },
      include: [{ model: User, attributes: ['name', 'email'] }],
    });

    const avg = ratings.length
      ? (ratings.reduce((sum, r) => sum + r.rating, 0) / ratings.length).toFixed(1)
      : 0;

    res.json({ store, ratings, averageRating: avg });
  } catch (error) {
    console.error('OWNER DASHBOARD ERROR:', error.message);
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getOwnerDashboard };