const express = require('express')
require('dotenv').config()
const path = require('path')
const db=require('./config/connection')
const app=express()
const userRoute=require('./routes/users')
const adminRoute=require('./routes/admins')
const session=require('express-session')
const multer=require('multer')

app.use(express.json());
app.use(express.urlencoded({ extended: true }));


// view engine setup

app.set('views', [path.join(__dirname, 'views/admin'),path.join(__dirname, 'views/user')]);
app.set('view engine', 'hbs');

//session
const oneDay=1000*60*60*24;
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
  secret:'thisismysecrctekeyfhrgfgrfrty84fwir767',
  resave:false,
  cookie:{maxAge:oneDay},
  saveUninitialized:true
}));

//database connection
db.connect((err)=>{
    if(err) console.log("connection error");
    else console.log("Database connected");
  })

app.use('/',userRoute)
app.use('/admin',adminRoute)
// app.use(express.static(__dirname + '/public'));

app.listen(4000,()=>{
    console.log('Server running  on http://localhost:4000/admin/adminLogin');
})

