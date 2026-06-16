const bcrypt = require('bcryptjs');
const { User, Store, Rating } = require('../models/index');

const getDashboard = async (req, res) => {
  try {
    const totalUsers = await User.count();
    const totalStores = await Store.count();
    const totalRatings = await Rating.count();

    res.json({ totalUsers, totalStores, totalRatings });
  } catch (error) {
    console.error('DASHBOARD ERROR:', error.message);
    res.status(500).json({ message: error.message });
  }
};

const addUser = async (req, res) => {
  try {
    const { name, email, address, password, role } = req.body;

    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, address, password: hashedPassword, role });

    res.status(201).json({ message: 'User created successfully', user });
  } catch (error) {
    console.error('ADD USER ERROR:', error.message);
    res.status(500).json({ message: error.message });
  }
};

const getAllUsers = async (req, res) => {
  try {
    const { name, email, address, role } = req.query;
    const where = {};

    if (name) where.name = name;
    if (email) where.email = email;
    if (address) where.address = address;
    if (role) where.role = role;

    const users = await User.findAll({
      where,
      attributes: ['id', 'name', 'email', 'address', 'role'],
    });

    res.json(users);
  } catch (error) {
    console.error('GET USERS ERROR:', error.message);
    res.status(500).json({ message: error.message });
  }
};

const getAllStores = async (req, res) => {
  try {
    const stores = await Store.findAll({
      include: [{ model: Rating, attributes: ['rating'] }],
    });

    const storesWithRating = stores.map(store => {
      const ratings = store.Ratings || [];
      const avg = ratings.length
        ? (ratings.reduce((sum, r) => sum + r.rating, 0) / ratings.length).toFixed(1)
        : 0;
      return { ...store.toJSON(), averageRating: avg };
    });

    res.json(storesWithRating);
  } catch (error) {
    console.error('GET STORES ERROR:', error.message);
    res.status(500).json({ message: error.message });
  }
};

const addStore = async (req, res) => {
  try {
    const { name, email, address, ownerId } = req.body;
    const store = await Store.create({ 
      name, 
      email, 
      address, 
      ownerId: ownerId ? parseInt(ownerId) : null 
    });
    res.status(201).json({ message: 'Store created successfully', store });
  } catch (error) {
    console.error('ADD STORE ERROR:', error.message);
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getDashboard, addUser, getAllUsers, getAllStores, addStore };