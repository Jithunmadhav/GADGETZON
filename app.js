const express = require('express')
require('dotenv').config()
const path = require('path')

const app=express()
const userRoute=require('./routes/users')
const adminRoute=require('./routes/admins')
const session=require('express-session')
const adminVerify = require('./middlewares/adminSession')
const dbConnect = require('./config/dbConfig')
const process = require('process')
// const MongoStore = require('connect-mongo');
const hbs = require("hbs");



 



app.use(express.json());
app.use(express.urlencoded({ extended: true }));


// view engine setup

app.set('views', [path.join(__dirname, 'views/admin'),path.join(__dirname, 'views/user')]);
app.set('view engine', 'hbs');

hbs.registerHelper("inc", function (value, options) {
  return parseInt(value) + 1;
});
//session
const oneDay=1000*60*60*24;
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
  secret:'thisismysecrctekeyfhrgfgrfrty84fwir767',
  resave:false,
  cookie:{maxAge:oneDay},
  saveUninitialized:true,
  // store: MongoStore.create({ mongoUrl: process.env.MONGOOSE_CONNECT })    
}));
app.use('/admin',adminRoute)
app.use(function(req, res, next) {
  res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
next();
});

dbConnect();  


app.use('/',userRoute)

// app.use(express.static(__dirname + '/public'));



app.listen(7000,()=>{
    console.log('Server running  on http://localhost:7000');
    
})

