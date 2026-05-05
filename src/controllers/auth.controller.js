// Auth controller stub
const User = require('../../models/User');
const jwt = require('jsonwebtoken');
const md5 = require('md5');
const JWT_SECRET = process.env.JWT_SECRET || 'secret123';

// POST /register
const register = (req, res) => {
  var userData = { ...req.body };
  userData.password = md5(userData.password);
  var newUser = new User(userData);
  newUser.save()
    .then(function(user) {
      console.log('Registered user: ' + user.email);
      res.json({
        success: true,
        message: 'Account created!',
        user: user
      });
    })
    .catch(function(err) {
      console.log('Error in register: ' + err);
      res.json({ success: false, error: 'Cannot register' });
    });
};

// POST /login
const login = (req, res) => {
  User.findOne({ email: req.body.email })
    .then(function(user) {
      if (!user) {
        return res.json({ error: 'No user found with that email' });
      }
      if (user.password === md5(req.body.password)) {
        var token = jwt.sign(
          { id: user._id, role: user.role }, 
          JWT_SECRET, 
          { expiresIn: '12h' }
        );
        res.json({
          msg: 'Login OK',
          token: token,
          data: {
            name: user.name,
            email: user.email,
            role: user.role
          }
        });
      } else {
        res.json({ error: 'Password does not match' });
      }
    })
    .catch(function(err) {
      console.log('Login crash: ' + err);
      res.json({ error: 'Server error' });
    });
};

module.exports = { register, login };
