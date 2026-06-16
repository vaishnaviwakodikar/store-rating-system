const bcrypt = require('bcryptjs');
const { connectDB, sequelize } = require('./config/db');
require('./models/index');
const { User } = require('./models/index');

const seed = async () => {
  await connectDB();
  await sequelize.sync();

  const hashedPassword = await bcrypt.hash('Admin@123', 10);

  await User.create({
    name: 'System Administrator User',
    email: 'admin@gmail.com',
    address: 'Admin Office, Main Street, City',
    password: hashedPassword,
    role: 'admin',
  });

  console.log('Admin user created!');
  console.log('Email: admin@gmail.com');
  console.log('Password: Admin@123');
  process.exit();
};

seed();