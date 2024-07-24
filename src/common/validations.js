// Name validation
export const validateName = (name) => {
    const errors = {};
    if (name.length < 3) {
        errors.length = 'Name must be at least 3 characters long';
    }
    else if (!/^[A-Za-z\s]+$/.test(name)) {
        errors.alphabet = 'Name must contain only alphabets';
    }
    return errors;
};
// Email validation
export const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};
// Password validation
export const validatePassword = (password) => {
    const errors = {};
    if (password.length < 8) {
        errors.length = 'Password must be at least 8 characters long';
    }
    else if (!/[A-Z]/.test(password)) {
        errors.uppercase = 'Password must contain at least one uppercase letter';
    }
    else if (!/[a-z]/.test(password)) {
        errors.lowercase = 'Password must contain at least one lowercase letter';
    }
    else if (!/\d/.test(password)) {
        errors.number = 'Password must contain at least one number';
    }
    else if (!/[@$#!%*?&]/.test(password)) {
        errors.special = 'Password must contain at least one special character';
    }
    return errors;
};