const validateUser = (req, res, next) => {
  const { name, email, address, password } = req.body;

  if (name && (name.length < 20 || name.length > 60)) {
    return res.status(400).json({ message: 'Name must be between 20 and 60 characters' });
  }

  if (address && address.length > 400) {
    return res.status(400).json({ message: 'Address must be under 400 characters' });
  }

  if (password) {
    if (password.length < 8 || password.length > 16) {
      return res.status(400).json({ message: 'Password must be 8-16 characters' });
    }
    if (!/[A-Z]/.test(password)) {
      return res.status(400).json({ message: 'Password must include at least one uppercase letter' });
    }
    if (!/[!@#$%^&*]/.test(password)) {
      return res.status(400).json({ message: 'Password must include at least one special character' });
    }
  }

  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({ message: 'Invalid email format' });
  }

  next();
};

module.exports = validateUser;