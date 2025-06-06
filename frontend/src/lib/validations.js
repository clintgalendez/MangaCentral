export const validationRules = {
  required: (value) => {
    if (!value || value.trim() === "") {
      return "This field is required";
    }
    return "";
  },

  email: (value) => {
    if (!value) return "";
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(value)) {
      return "Please enter a valid email address";
    }
    return "";
  },

  minLength: (min) => (value) => {
    if (!value) return "";
    if (value.length < min) {
      return `Must be at least ${min} characters long`;
    }
    return "";
  },

  passwordMatch: (value, allValues) => {
    if (!value) return "";
    if (value !== allValues.password) {
      return "Passwords do not match";
    }
    return "";
  },

  username: (value) => {
    if (!value) return "";
    const usernameRegex = /^[a-zA-Z0-9_]+$/;
    if (!usernameRegex.test(value)) {
      return "Username can only contain letters, numbers, and underscores";
    }
    if (value.length < 3) {
      return "Username must be at least 3 characters long";
    }
    if (value.length > 30) {
      return "Username must be less than 30 characters";
    }
    return "";
  },
};
