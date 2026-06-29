require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');

const routes = require('./routes/index');
const errorHandler = require('./middlewares/errorHandler');

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const mongoUrl = process.env.DATABASE_URL || 'mongodb://localhost:27017/logitrack';
mongoose.connect(mongoUrl, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
  useFindAndModify: false
})
  .then(() => {
    console.log('--- DATABASE CONNECTED ---');
  })
  .catch((err) => {
    console.log('DATABASE CONNECTION ERROR:');
    console.log(err);
  });

app.use('/api', routes);

app.get('/', (req, res) => {
  res.json({ message: 'LogiTrack Backend running' });
});

app.use(errorHandler);

const PORT = process.env.PORT || 3000;
if (require.main === module) {
  app.listen(PORT, () => {
    console.log('Server is alive on port ' + PORT);
    console.log('Wait for MongoDB before testing...');
  });
}

module.exports = app;
