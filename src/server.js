const express=require('express');
const colors =require('colors');
const morgan = require('morgan');
const connectDB = require('../config/db');
const dotenv = require('dotenv');
const hbs = require('hbs');
const path = require('path');
const User = require('../models/User');
const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');
const user_jwt = require('../middleware/user_jwt');

//session
const session = require('express-session');
const cookieParser = require("cookie-parser");





const app=express();



const expTime= 1000 * 60 * 60;
app.use(session({
  
    // It holds the secret key for session
    secret: 'Your_Secret_Key',
  
    // Forces the session to be saved
    // back to the session store
    resave: true,

    cookie: { maxAge: expTime },
  
    // Forces a session that is "uninitialized"
    // to be saved to the store
    saveUninitialized: true
}));



const temperates_path = path.join(__dirname,"../temperates/views");
const partials_path = path.join(__dirname,"../temperates/partials");
const static_path=path.join(__dirname,"../public");


/*app.use((req,res,next)=>{
    console.log("middleware ran");
    req.title="Ansari";
    next();
})*/

app.use(morgan('dev'));

app.use(express.json({}));
app.use(express.urlencoded({extended:false}));
app.use(express.json({
    extended:true
}));


dotenv.config({
    path:'./config/config.env'
});

connectDB();

//set paths
hbs.registerPartials(partials_path);


app.set("views",temperates_path);
app.use(express.static(static_path));
app.set("view engine","hbs");
app.use(express.static("images"));



app.get("/static", (req, res) => {
    res.render("static");
});

app.get('/',(req,res)=>{
   res.render("index")
});






app.route("/dashboard",(req,res) =>{
    res.render("dashboard")
});



app.use('/api/todo/auth',require('../routes/user'));

app.use('/admin',require('../routes/admin'));
app.use('/student',require('../routes/student'));

app.use('/assignment',require('../routes/assignment'));
app.use('/studentassignment',require('../routes/Studentassignment'));
app.use('/marksheet',require('../routes/marksheet'))
app.use('/studentmarksheet',require('../routes/studentmarksheet'))

app.use('/logout',require('../routes/logout'));

app.use('/marks',require('../routes/marks'));
/*app.get('/todo',(req,res)=>{
   res.status(200).json({
        "name":"Misbah",
   });
});*/


const PORT=process.env.PORT || 3000;

app.listen(PORT,console.log(`Server running on port:${PORT}`.red.underline.bold));