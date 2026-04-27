export const validators = {
  required: (value) => value && value.toString().trim().length > 0,
  email: (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value),
  phone: (value) => /^\d{10}$/.test(value),
  aadhar: (value) => /^\d{12}$/.test(value),
  pan: (value) => /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(value),
  url: (value) => { try { new URL(value); return true; } catch { return false; } },
  minLength: (length) => (value) => value && value.length >= length,
  maxLength: (length) => (value) => value && value.length <= length,
  min: (min) => (value) => Number(value) >= min,
  max: (max) => (value) => Number(value) <= max,
  matches: (regex) => (value) => regex.test(value),
  oneOf: (options) => (value) => options.includes(value)
};

export const validateForm = (data, rules) => {
  const errors = {};
  for (const [field, fieldRules] of Object.entries(rules)) {
    const value = data[field];
    for (const rule of fieldRules) {
      if (typeof rule === 'function') {
        if (!rule(value)) {
          errors[field] = `Invalid ${field}`;
          break;
        }
      } else if (rule.validator && !rule.validator(value)) {
        errors[field] = rule.message || `Invalid ${field}`;
        break;
      }
    }
  }
  return { isValid: Object.keys(errors).length === 0, errors };
};
