const express = require("express");
const router = express.Router();
const AssignQues = require('../models/AssignmentQues');
const User = require('../models/FacultyS');
const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');
const user_jwt = require('../middleware/user_jwt');


// router.get('/',async(req,res)=>{
//     let user=await User.findOne({
//         email:req.session.email
//     });
//     res.status(201).render('assignment',{title:'Assignment',data:user});

// });

router.get('/create',async(req,res)=>{

    let user=await User.findOne({
        email:req.session.email
    });
    res.status(201).render('assignment',{title:'Assignment',email:req.session.email,Pid:Date.now()});
});
router.post('/create',async(req,res)=>{

    const{Pid,email,ques,ans,subject}=req.body;
    let asgn = new AssignQues();

    asgn.paperID=Pid;
    asgn.email=email;
    asgn.ques=ques;
    asgn.ans=ans;
    asgn.subject=subject;

    await asgn.save();

    res.status(201).render('assignment',{title:'Assignment',email:req.body.email,Pid:req.body.Pid,subject:req.body.subject});
});

router.post('/submit',async(req,res)=>{

    console.log("submit");
    const{Pid,email,ques,ans,subject}=req.body;
    let asgn = new AssignQues();

    asgn.paperID=Pid;
    asgn.email=email;
    asgn.ques=ques;
    asgn.ans=ans;
    asgn.subject=subject;

    await asgn.save();

    res.status(201).render('AssignmentSuccess',{title:'Success',Pid:req.body.Pid,subject:req.subject});

});


module.exports=router;