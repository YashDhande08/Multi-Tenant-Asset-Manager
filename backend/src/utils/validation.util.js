const { BadRequestError } = require('../constants/errors');

/**
 * Safely converts a value to an integer for Prisma Int fields
 * @param {string|number} value - The value to convert
 * @param {string} fieldName - The field name for error messages (optional)
 * @returns {number} - The integer value
 * @throws {BadRequestError} - If the value cannot be converted to a valid integer
 */
const parseId = (value, fieldName = 'id') => {
  if (value === null || value === undefined) {
    throw new BadRequestError(`${fieldName} is required`);
  }

  // If already a number, validate it's an integer
  if (typeof value === 'number') {
    if (!Number.isInteger(value) || isNaN(value)) {
      throw new BadRequestError(`Invalid ${fieldName}: must be a valid integer`);
    }
    return value;
  }

  // Convert string to number
  const parsed = parseInt(value, 10);

  // Validate the conversion
  if (isNaN(parsed) || !Number.isInteger(parsed)) {
    throw new BadRequestError(`Invalid ${fieldName}: must be a valid integer`);
  }

  // Ensure the original string represents the same integer (prevents "123abc" -> 123)
  if (String(parsed) !== String(value).trim()) {
    throw new BadRequestError(`Invalid ${fieldName}: must be a valid integer`);
  }

  return parsed;
};

/**
 * Safely converts multiple values to integers
 * @param {Object} values - Object with field names and values to convert
 * @returns {Object} - Object with converted integer values
 */
const parseIds = (values) => {
  const result = {};
  for (const [key, value] of Object.entries(values)) {
    result[key] = parseId(value, key);
  }
  return result;
};

module.exports = {
  parseId,
  parseIds,
};
