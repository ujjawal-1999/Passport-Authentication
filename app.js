const express = require("express");
const port = process.env.PORT || 3000;
const expressLayouts = require("express-ejs-layouts");
const path = require("path");
const mongoose = require("mongoose");
const flash = require('connect-flash');
const session = require('express-session');

//Passport Config
const passport = require('passport');
require('./config/passport')(passport);

//DB
const db = require("./config/keys").MONGO_URI;

mongoose.connect(db,{
    useNewUrlParser : true,
    useUnifiedTopology:true
}).then(()=> console.log("MongoDb Running"))
    .catch(()=>console.error(err));

const app = express();
app.use(expressLayouts);
app.set("view engine","ejs");
const publicDirectoryPath = path.join(__dirname,'public');
app.use(express.static(publicDirectoryPath));

//Body Parse
app.use(express.urlencoded({extended:false}));

//Express Session
app.use(session({
    secret: 'Secret',
    resave: true,
    saveUninitialized: true
  }));

//Passport Middleware
app.use(passport.initialize());
app.use(passport.session());

  //Connect flash
app.use(flash());

//Global variables
app.use((req,res,next)=>{
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    next();
});

//Routes
app.use('/',require('./routes/index'));
app.use('/users',require('./routes/user'));

app.listen(port,()=>{
    console.log("Server Started at Port",port);
})