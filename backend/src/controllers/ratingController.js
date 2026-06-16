const { Rating } = require('../models/index');

const submitRating = async (req, res) => {
  try {
    const { storeId, rating } = req.body;
    const userId = req.user.id;

    const existing = await Rating.findOne({ where: { userId, storeId } });

    if (existing) {
      await existing.update({ rating });
      return res.json({ message: 'Rating updated successfully' });
    }

    await Rating.create({ userId, storeId, rating });
    res.status(201).json({ message: 'Rating submitted successfully' });
  } catch (error) {
    console.error('RATING ERROR:', error.message);
    res.status(500).json({ message: error.message });
  }
};

module.exports = { submitRating };