export const hashString = async (str) => {
  const encoder = new TextEncoder();
  const data = encoder.encode(str);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
};

export const generateSecureToken = (length = 32) => {
  const array = new Uint8Array(length);
  crypto.getRandomValues(array);
  return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
};

export const maskSensitiveData = (value, visibleChars = 4) => {
  if (!value) return '';
  if (value.length <= visibleChars) return '*'.repeat(value.length);
  const visiblePart = value.slice(-visibleChars);
  const maskedPart = '*'.repeat(value.length - visibleChars);
  return maskedPart + visiblePart;
};

export const sanitizeInput = (input) => {
  if (typeof input !== 'string') return input;
  return input.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#x27;').replace(/\//g, '&#x2F;');
};

export const sanitizeEmail = (email) => {
  if (typeof email !== 'string') return null;
  const sanitized = email.trim().toLowerCase();
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(sanitized) ? sanitized : null;
};

export const sanitizePhone = (phone) => {
  if (typeof phone !== 'string') return null;
  const sanitized = phone.replace(/\D/g, '');
  return /^\d{10}$/.test(sanitized) ? sanitized : null;
};

export const generateCsrfToken = () => generateSecureToken(32);
export const validateCsrfToken = (token, storedToken) => token === storedToken;
