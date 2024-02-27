export const emailRegex = /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/;
export const passwordRegex =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/;
export const usernameRegex = /^[a-zA-Z0-9_.-]{3,}$/;
export const nameRegex = /^[a-zA-Z]{2,}$/;
export const phoneRegex = /^[0-9]{10,}$/;
export const addressRegex = /^[a-zA-Z0-9\s,'-]*$/;

export const validateEmail = (email: string) => {
  if (!email) {
    return "Email is required";
  }

  if (!emailRegex.test(email)) {
    return "Invalid email";
  }

  return null; // If the email is valid, return null or an empty string
};

export const validatePassword = (password: string) => {
  if (!password) {
    return "Password is required";
  }

  if (!passwordRegex.test(password)) {
    return "Password should contain at least 8 characters, 1 uppercase letter, 1 lowercase letter and 1 number";
  }

  return null; // If the password is valid, return null or an empty string
};

export const validateUsername = (username: string) => {
  return usernameRegex.test(username);
};

export const validateName = (name: string) => {
  return nameRegex.test(name);
};

export const validatePhone = (phone: string) => {
  return phoneRegex.test(phone);
};

export const validateAddress = (address: string) => {
  return addressRegex.test(address);
};

export const passwordMatch = (password: string, confirmPassword: string) => {
  if (!password) {
    return "Password is required";
  }

  if (!confirmPassword) {
    return "Confirm password is required";
  }

  if (password !== confirmPassword) {
    return "Passwords do not match";
  }

  return null;
};
