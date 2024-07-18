// Important Packages
const express = require('express');
const bodyparser = require('body-parser');
const cors = require('cors');
const path = require('path');
const dotenv = require('dotenv').config();
const jwt = require('jsonwebtoken');
const app = express();


// Middleware setup
app.use(cors());
app.use(bodyparser.json());
app.use(express.json());

app.use(express.static(path.join(__dirname, 'views')));
app.use('/public', express.static(path.join(__dirname, 'public')));

const sequelize = require('./util/database');
const userRoutes = require('./routes/userRoutes');

// Routes
app.use('/user', userRoutes);


// Serve the signup.html file
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'signup.html'));
});

// Database & Server start
sequelize
  .sync()
  .then(result => {
    console.log('Database Connected');
    app.listen(4000, () => {
      console.log('Server is running on port 4000');
    });
  })
  .catch(err => console.log(err));
