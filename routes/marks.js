const express = require("express");
const router = express.Router();
const AssignQues = require('../models/AssignmentQues');
const AnswerSheet = require('../models/AnswerSheet');
const User = require('../models/User');
const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');
const user_jwt = require('../middleware/user_jwt');
const spawn = require("child_process").spawn;
const path = require('path');

router.get('/' ,async(req,res) =>{
    let user=await User.findOne({
        email:req.session.email
    });
    let pid=await AssignQues.distinct("paperID");
    
    res.status(201).render('sheet',{title:'Assignment',email:req.session.email,assignments:pid});
});

router.post('/evaluate',async(req,res)=>{
    console.log(req.body.pid);
    var process = spawn('python',[
        "-u",'ML/test.py',req.body.pid]);
    console.log(`running`);
    
    process.stdout.on('data', function(data) {
        console.log(data.toString());
    } );

    return res.status(201);

});

module.exports=router;