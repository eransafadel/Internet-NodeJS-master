const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const app = express();
const port = process.env.port || 3000;
const session = require('express-session');


const loginRouter = require('./routes/login');
const homeRouter = require('./routes/home');

var a = require('./models').DataBase_Github;
const Sequelize= require("sequelize");

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use("/public", express.static(path.join(__dirname, 'public')));

// initalize sequelize with session store
var SequelizeStore = require('connect-session-sequelize')(session.Store);
const config = require(__dirname + '/config/config.json')["development"];
var sequelize = new Sequelize(config.database,config.username,config.password,config);
// initalize sequelize with session store
var SequelizeStore = require('connect-session-sequelize')(session.Store);
var myStore = new SequelizeStore({db: sequelize});
// initialize express-session to allow us track the logged-in user across sessions.
app.use(session({secret:'secret',resave: false,saveUninitialized: false}));
myStore.sync();

app.use('/page1', loginRouter);
app.use('/api',homeRouter);

app.listen(port);

module.exports = app;

