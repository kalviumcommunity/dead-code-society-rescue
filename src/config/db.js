const mongoose = require('mongoose');

/**
 * Connect to MongoDB using Mongoose.
 * @param {string} mongoUrl
 * @returns {Promise<mongoose.Connection>}
 */
const connectDb = async (mongoUrl) => {
  await mongoose.connect(mongoUrl, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false,
  });

  return mongoose.connection;
};

module.exports = {
  connectDb,
};
