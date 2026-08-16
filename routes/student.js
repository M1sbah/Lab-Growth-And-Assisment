const express = require("express");
const router = express.Router();
const User = require('../models/User');
const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');
const user_jwt = require('../middleware/user_jwt');
const AssignQues = require('../models/AssignmentQues');


router.get("/",async(req,res) =>{
    if(req.session.email && await User.findOne({
        email:req.session.email
    })){
        let userMail=await User.findOne({
            email:req.session.email
        });
        let pid=await AssignQues.distinct("paperID");
        // let qD=await AssignQues.find({});
        res.status(201).render('Studentdashboard',{title:'Dashboard',data:userMail,assignments:pid});
        console.log(req.session.email);
    }
    res.render("Studentlogin")
});

router.post("/",async (req,res) =>{
    try {
        const email=req.body.email;
        const password=req.body.password;

        req.session.email=email;

        let userMail=await User.findOne({
            email:email
        });

        const isMatch =await bcryptjs.compare(password,userMail.password);
        if(isMatch){
            req.session.email=email;
            let pid=await AssignQues.distinct("paperID");
            
            res.status(201).render('Studentdashboard',{title:'Dashboard',data:userMail,assignments:pid});
        }
        else{
            res.status(403).render('Studentlogin');
        }
        
        
        
    } catch (error) {
        res.status(400).send('Invalid');
    }
});


router.get('/register',async(req,res) =>{
    res.render("register")
});

router.post('/register',async(req,res) =>{
    const{username,email,password}=req.body;
    if (password[0] != password[1]){
        res.render("Studentregister")
    }

    try {
        let user_exist =await User.findOne({email:email});
        if(user_exist){
            let usr={
                exist:true
            }
            return res.status(409).render('Studentregister',{data:usr});
        }
        let user = new User();
        user.username=username;
        user.email=email;
        
        const salt = await bcryptjs.genSalt(10);
        user.password=await bcryptjs.hash(password[0],salt);

        let size=200;
        user.avatar = "https://gravatar.com/avatar/?s="+size+'&d=retro';
        
        await user.save();

        const payload = {
            user:{
                id:user.id
            }
        }

        jwt.sign(payload,process.env.jwtUserSecret,{
            expiresIn:360000
        }, (err,token)=>{
            if(err) throw err;
            req.session.email=email;
            res.status(200).render('Studentdashboard',{data:user})
        });

        
    } catch (err) {
        console.log(err);
    }

});

module.exports = router;