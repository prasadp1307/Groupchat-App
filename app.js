// Important Packages
const express = require('express');
const bodyparser = require('body-parser');
const cors = require('cors');
const path = require('path');
const dotenv = require('dotenv').config();
const jwt = require('jsonwebtoken');
const multer = require('multer');
const app = express();
const server = require('http').createServer(app);


// Middleware setup
app.use(cors());

app.use(bodyparser.json());
app.use(express.json());

app.use(express.static(path.join(__dirname, 'views')));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/public', express.static(path.join(__dirname, 'public')));

// Required Paths
const sequelize = require('./util/database');
const userRoutes = require('./routes/userRoutes');
const chatRoutes = require('./routes/chatRoutes');
const groupRoutes = require('./routes/groupRoutes');
const adminRoutes = require('./routes/adminRoutes');


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
app.use('/group',groupRoutes);
app.use('/admin',adminRoutes);
// app.use('/',pageRoutes);

// Models
const User = require('./models/users');
const Message = require('./models/message');
const Member = require('./models/member');
const Group = require('./models/group');


// Serve the signup.html file
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'signup.html'));
});


// DB associations
User.hasMany(Message);
Message.belongsTo(User);

User.hasMany(Message, { foreignKey: 'userId' });
Message.belongsTo(User, { foreignKey: 'userId' });

Group.hasMany(Member, { foreignKey: 'groupId' });
Member.belongsTo(Group, { foreignKey: 'groupId' });

User.hasMany(Member, { foreignKey: 'userId' });
Member.belongsTo(User, { foreignKey: 'userId' });

Group.hasMany(Member, { foreignKey: 'userId' });
Member.belongsTo(Group, { foreignKey: 'userId' });

Message.belongsTo(User);
Message.belongsTo(Group);



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
