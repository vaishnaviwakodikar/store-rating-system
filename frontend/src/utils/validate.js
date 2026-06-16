export const validateName = (name) => {
  if (!name) return 'Name is required';
  if (name.length < 20) return 'Name must be at least 20 characters';
  if (name.length > 60) return 'Name must be under 60 characters';
  return '';
};

export const validateEmail = (email) => {
  if (!email) return 'Email is required';
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return 'Invalid email format';
  return '';
};

export const validatePassword = (password) => {
  if (!password) return 'Password is required';
  if (password.length < 8 || password.length > 16) return 'Password must be 8-16 characters';
  if (!/[A-Z]/.test(password)) return 'Must include at least one uppercase letter';
  if (!/[!@#$%^&*]/.test(password)) return 'Must include at least one special character';
  return '';
};

export const validateAddress = (address) => {
  if (!address) return 'Address is required';
  if (address.length > 400) return 'Address must be under 400 characters';
  return '';
};