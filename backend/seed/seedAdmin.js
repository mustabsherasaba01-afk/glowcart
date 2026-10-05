const bcrypt = require('bcryptjs');
const User = require('../models/User');

const seedAdmin = async () => {
  const existing = await User.findOne({ email: 'admin@glowcart.com' });
  if (existing) return;

  const password = await bcrypt.hash('Admin123!', 10);
  await User.create({
    name: 'GlowCart Admin',
    email: 'admin@glowcart.com',
    password,
    role: 'ADMIN',
  });
};

module.exports = seedAdmin;
