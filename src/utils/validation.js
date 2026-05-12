/**
 * Input validation utilities.
 * Prevents NoSQL injection and enforces data integrity.
 */

/**
 * Validate email format.
 * @param {string} email - Email to validate
 * @returns {boolean} - True if valid email
 */
function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return typeof email === "string" && emailRegex.test(email);
}

/**
 * Validate password strength.
 * Minimum 6 characters (can be stricter in production).
 * @param {string} password - Password to validate
 * @returns {boolean} - True if valid
 */
function isValidPassword(password) {
  return typeof password === "string" && password.length >= 6;
}

/**
 * Validate user registration data.
 * Whitelist only allowed fields, prevent injection.
 * @param {object} data - Raw request body
 * @returns {object} - Validated and sanitized user data
 * @throws {Error} - If validation fails
 */
function validateUserRegistration(data) {
  if (!data || typeof data !== "object") {
    throw new Error("Invalid request body");
  }

  const { name, email, password } = data;

  if (!name || typeof name !== "string" || name.trim().length === 0) {
    throw new Error("Name is required and must be a non-empty string");
  }

  if (!isValidEmail(email)) {
    throw new Error("Valid email is required");
  }

  if (!isValidPassword(password)) {
    throw new Error("Password must be at least 6 characters");
  }

  // Return only whitelisted fields
  return {
    name: name.trim(),
    email: email.toLowerCase().trim(),
    password: password, // Will be hashed before storage
  };
}

/**
 * Validate user login data.
 * @param {object} data - Raw request body
 * @returns {object} - Validated login credentials
 * @throws {Error} - If validation fails
 */
function validateUserLogin(data) {
  if (!data || typeof data !== "object") {
    throw new Error("Invalid request body");
  }

  const { email, password } = data;

  if (!isValidEmail(email)) {
    throw new Error("Valid email is required");
  }

  if (!password || typeof password !== "string") {
    throw new Error("Password is required");
  }

  return {
    email: email.toLowerCase().trim(),
    password,
  };
}

/**
 * Validate shipment creation data.
 * Whitelist only allowed fields, prevent injection.
 * @param {object} data - Raw request body
 * @returns {object} - Validated shipment data
 * @throws {Error} - If validation fails
 */
function validateShipmentCreation(data) {
  if (!data || typeof data !== "object") {
    throw new Error("Invalid request body");
  }

  const { origin, destination, weight, carrier } = data;

  if (!origin || typeof origin !== "string" || origin.trim().length === 0) {
    throw new Error("Origin is required");
  }

  if (
    !destination ||
    typeof destination !== "string" ||
    destination.trim().length === 0
  ) {
    throw new Error("Destination is required");
  }

  if (!weight || typeof weight !== "number" || weight <= 0) {
    throw new Error("Weight must be a positive number");
  }

  if (!carrier || typeof carrier !== "string" || carrier.trim().length === 0) {
    throw new Error("Carrier is required");
  }

  // Return only whitelisted fields
  return {
    origin: origin.trim(),
    destination: destination.trim(),
    weight,
    carrier: carrier.trim(),
  };
}

/**
 * Validate shipment status update.
 * @param {object} data - Raw request body
 * @returns {object} - Validated status update data
 * @throws {Error} - If validation fails
 */
function validateStatusUpdate(data) {
  const VALID_STATUSES = ["pending", "in-progress", "delivered", "cancelled"];

  if (!data || typeof data !== "object") {
    throw new Error("Invalid request body");
  }

  const { status } = data;

  if (!status || !VALID_STATUSES.includes(status)) {
    throw new Error(`Status must be one of: ${VALID_STATUSES.join(", ")}`);
  }

  return { status };
}

module.exports = {
  isValidEmail,
  isValidPassword,
  validateUserRegistration,
  validateUserLogin,
  validateShipmentCreation,
  validateStatusUpdate,
};
