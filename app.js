// Important Packages
const express = require('express');
const bodyparser = require('body-parser');
const cors = require('cors');
const path = require('path');
const dotenv = require('dotenv').config();
const jwt = require('jsonwebtoken');

const app = express();
const server = require('http').createServer(app);


// Middleware setup
app.use(cors());

app.use(bodyparser.json());
app.use(express.json());

app.use(express.static(path.join(__dirname, 'views')));
app.use('/public', express.static(path.join(__dirname, 'public')));

// Required Paths
const sequelize = require('./util/database');
const userRoutes = require('./routes/userRoutes');
const chatRoutes = require('./routes/chatRoutes');
// const pageRoutes = require('./routes/pageRoutes');


// Authenticaton of WebSocket Connection request
// io.use(websocketAuth);

// socket.io all event listeners and actions
// io.on('connection', connectionListener);

// // HTTP API Routing
// app.use((req, res, next) => {
//     req.io = io;
//     console.log(req.url);
//     next();
// })


// Routes
app.use('/user', userRoutes);
app.use('/chat', chatRoutes);
// app.use('/',pageRoutes);

// Models
const User = require('./models/users');
const Message = require('./models/message');

// Serve the signup.html file
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'signup.html'));
});

// DB associations
User.hasMany(Message);
Message.belongsTo(User);

User.hasMany(Message, { foreignKey: 'userId' });
Message.belongsTo(User, { foreignKey: 'userId' });








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
