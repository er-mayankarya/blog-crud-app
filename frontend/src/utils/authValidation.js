const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const USERNAME_REGEX = /^(?=.{3,20}$)[a-z0-9_]+(?:[.-]?[a-z0-9_]+)*$/;
const PHONE_ALLOWED_REGEX = /^[0-9+\-\s()]+$/;

const hasValidEmail = (value) => EMAIL_REGEX.test(value.trim());

const hasValidPhone = (value) => {
  const trimmedValue = value.trim();
  const digitsOnly = trimmedValue.replace(/\D/g, '');

  return PHONE_ALLOWED_REGEX.test(trimmedValue) && digitsOnly.length >= 7 && digitsOnly.length <= 15;
};

const hasStrongEnoughPassword = (value) => value.trim().length >= 6;

export const validateReaderAuth = (mode, formData) => {
  const errors = {};

  if (mode === 'signup') {
    if (formData.name.trim().length < 2) {
      errors.name = 'Enter a valid full name';
    }

    if (!USERNAME_REGEX.test(formData.username.trim().toLowerCase())) {
      errors.username = 'Use 3-20 letters, numbers, dots, dashes, or underscores';
    }

    if (!hasValidPhone(formData.mobile)) {
      errors.mobile = 'Enter a valid mobile number';
    }

    if (!hasStrongEnoughPassword(formData.password)) {
      errors.password = 'Password must be at least 6 characters';
    }
  } else {
    if (!formData.login?.trim()) {
      errors.login = 'Email, username, or mobile number is required';
    }

    if (!formData.password.trim()) {
      errors.password = 'Password is required';
    }
  }

  if (mode === 'signup' && !hasValidEmail(formData.email)) {
    errors.email = 'Enter a valid email address';
  }

  return errors;
};

export const validateReaderReset = (step, formData) => {
  const errors = {};

  if (!hasValidEmail(formData.resetEmail)) {
    errors.resetEmail = 'Enter a valid email address';
  }

  if (step === 2 && !hasStrongEnoughPassword(formData.newPassword)) {
    errors.newPassword = 'Password must be at least 6 characters';
  }

  return errors;
};

export const validateWriterAuth = (mode, formData) => {
  const errors = {};

  if (mode === 'register') {
    if (formData.name.trim().length < 2) {
      errors.name = 'Enter a valid writer name';
    }

    if (!USERNAME_REGEX.test(formData.username.trim().toLowerCase())) {
      errors.username = 'Use 3-20 letters, numbers, dots, dashes, or underscores';
    }

    if (!hasValidEmail(formData.email)) {
      errors.email = 'Enter a valid email address';
    }

    if (!hasValidPhone(formData.phone)) {
      errors.phone = 'Enter a valid phone number';
    }

    if (formData.description.trim().length < 20) {
      errors.description = 'Description must be at least 20 characters';
    }

    if (!hasStrongEnoughPassword(formData.password)) {
      errors.password = 'Password must be at least 6 characters';
    }
  } else {
    if (!formData.login.trim()) {
      errors.login = 'Email, phone, or username is required';
    }

    if (!formData.password.trim()) {
      errors.password = 'Password is required';
    }
  }

  return errors;
};

export const validateWriterReset = (step, formData) => {
  const errors = {};

  if (!hasValidEmail(formData.resetEmail)) {
    errors.resetEmail = 'Enter a valid email address';
  }

  if (!hasValidPhone(formData.resetPhone)) {
    errors.resetPhone = 'Enter a valid phone number';
  }

  if (step === 2 && !hasStrongEnoughPassword(formData.newPassword)) {
    errors.newPassword = 'Password must be at least 6 characters';
  }

  return errors;
};
