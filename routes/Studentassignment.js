const express = require("express");
const router = express.Router();
const AssignQues = require('../models/AssignmentQues');
const AnSht = require('../models/AnswerSheet');
const User = require('../models/User');
const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');
const user_jwt = require('../middleware/user_jwt');
const spawn = require("child_process").spawn;
const path = require('path');
const XMLHttpRequest = require('xhr2');



router.get('/' ,async(req,res) =>{
    let user=await User.findOne({
        email:req.session.email
    });
    let data=await AssignQues.distinct("paperID");
    
    res.status(201).render('StudentAssignment',{title:'Assignment',email:req.session.email,assignments:data});
});

router.post('/next',async(req,res)=>{


    console.log('next');
    let user=await User.findOne({
        email:req.session.email
    });

    let sheet=await AnSht.find({paperID:req.body.pid,email:req.session.email});
    let work=await AssignQues.find({paperID:req.body.pid}); 

    if (sheet.length>0){
        let sbj=await AnSht.findOne({paperID:req.body.pid});
        res.status(201).render('studentAssignmentSuccess',{title:'Success',Pid:req.body.pid,subject:sbj.subject});
    }
    res.status(201).render('Submission',{title:'Assignment',user:user,Pid:req.body.pid,data:work,subject:work[0].subject});
});


router.post('/submit',async(req,res)=>{

    // const{Pid,email,ques,ans,subject,username}=req.body;

    var xml=new XMLHttpRequest();
    xml.open("POST","http://127.0.0.1:5000/");
    xml.setRequestHeader("Content-type","application/x-www-form-urlencoded");
    // let asgn = new AnswerSheet();

    // asgn.paperID=Pid;
    // asgn.email=email;
    // asgn.username=username;
    // asgn.ques=ques[i];
    // asgn.ans=ans[i];
    // asgn.subject=subject;
    // {tans:ga[0].ans,sans:ans[0]}


    xml.onload=() =>{
        const data = xml.response;
        console.log(data);
    };

    xml.send(JSON.stringify(req.body));


    // let datasend=JSON.stringify({tans:ga[0].ans,sans:ans[0]});
    // console.log(xml.response);

    // asgn.marks=0;

    // await asgn.save();

    // console.log(ga[0].ans);

    res.status(201).render('studentAssignmentSuccess',{title:'Success',Pid:req.body.Pid,subject:req.body.subject});
});

module.exports=router;