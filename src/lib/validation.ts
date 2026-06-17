export const validators = {
  email: (v: string) => {
    if (!v.trim()) return 'This field is required';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)) return 'Please enter a valid email address';
    return '';
  },

  phone: (v: string) => {
    if (!v.trim()) return 'This field is required';
    const digits = v.replace(/\D/g, '');
    if (digits.length < 10 || digits.length > 15) return 'Please enter a valid phone number';
    return '';
  },

  name: (v: string) => {
    if (!v.trim()) return 'This field is required';
    if (v.trim().length < 2) return 'Name must be at least 2 characters';
    if (v.trim().length > 50) return 'Name must be 50 characters or less';
    return '';
  },

  text: (v: string, min = 1, max = 500) => {
    if (!v.trim()) return 'This field is required';
    if (v.trim().length < min) return `Must be at least ${min} characters`;
    if (v.trim().length > max) return `Must be ${max} characters or less`;
    return '';
  },

  postalCode: (v: string) => {
    if (!v.trim()) return 'This field is required';
    if (v.trim().length < 3) return 'Please enter a valid postal code';
    return '';
  },

  required: (v: string) => {
    if (!v.trim()) return 'This field is required';
    return '';
  },
};
