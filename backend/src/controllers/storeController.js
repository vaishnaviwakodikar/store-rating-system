const { Store, Rating, User } = require('../models/index');
const { Op } = require('sequelize');

const getAllStores = async (req, res) => {
  try {
    const { name, address } = req.query;
    const where = {};

    if (name) where.name = { [Op.iLike]: `%${name}%` };
    if (address) where.address = { [Op.iLike]: `%${address}%` };

    const stores = await Store.findAll({
      where,
      include: [{ model: Rating, attributes: ['rating', 'userId'] }],
    });

    const userId = req.user.id;

    const storesWithRating = stores.map(store => {
      const ratings = store.Ratings || [];
      const avg = ratings.length
        ? (ratings.reduce((sum, r) => sum + r.rating, 0) / ratings.length).toFixed(1)
        : 0;
      const userRating = ratings.find(r => r.userId === userId);
      return {
        ...store.toJSON(),
        averageRating: avg,
        userRating: userRating ? userRating.rating : null,
      };
    });

    res.json(storesWithRating);
  } catch (error) {
    console.error('GET STORES ERROR:', error.message);
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getAllStores };