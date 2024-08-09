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

    if (!/[A-Z]/.test(password)) {
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
    else if (password.length < 8) {
        errors.length = 'Password must be at least 8 characters long';
    }
    return errors;
};

// Phone number validation
export const validatePhone = (phone) => {
    const errors = {}
    let phoneRegex = /^(?=[6-9])[0-9]+$/;
     if(!phoneRegex.test(phone)){
        errors.invalid = 'Invalid phone number';
    }else if(phone.length < 10){
        errors.length = 'Phone number must have 10 numbers'
    }else if(phone.length > 10){
        errors.greater = "Phone number must be less than 11 numbers";
    }
    return errors;
}

// Vehicle registration number validation
export const validateVehicleRegistration = (registrationNumber) => {
    
    // Small letters and capital
    // const vehicleRegex = /^[a-zA-Z]{2}-\d{2}-[a-zA-Z]{2}-\d{4}$/i;

    // Only capital letters
    const vehicleRegex = /^[A-Z]{2}-\d{2}-[A-Z]{2}-\d{4}$/;
    return vehicleRegex.test(registrationNumber);
};
