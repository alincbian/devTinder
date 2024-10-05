const validator = require("validator");

const validateSignupApi = (req) => {
  const { firstName, lastName, emailId, password } = req.body;

  if (!firstName || !lastName) {
    throw new Error("Name is required!");
  } else if (!validator.isEmail(emailId)) {
    throw new Error("Please enter valid email!");
  } else if (!validator.isStrongPassword(password)) {
    throw new Error("Please enter a strong password!");
  }
};

const validateLoginApi = (emailId) => {
  if (!validator.isEmail(emailId)) throw new Error("Please enter valid email!");
};

module.exports = { validateSignupApi, validateLoginApi };
