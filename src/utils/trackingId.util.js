const { v4: uuidv4 } = require('uuid');

const generateTrackingId = () => {
  const id = uuidv4().replace(/-/g, '').substring(0, 12).toUpperCase();
  return `SHIP-${id}`;
};

module.exports = { generateTrackingId };
