const express = require("express");
const router = express.Router();
const AnSht = require('../models/AnswerSheet');
const MrkSht=require('../models/AssignmentMarkSheet');


router.get('/',async(req,res)=>{
    // let ams=await AMS.find({});
    let data=await MrkSht.find({email:req.session.email});

    res.render('StudentMarkSheet',{title:'Marksheet',data:data})
});

router.post('/studentviewsheet',async(req,res)=>{
    const{username,pid,email,subject}=req.body;

    // await AnSht.deleteMany({paperID:"1685118186850"});

    let sheet=await AnSht.find({paperID:pid,email:email});

    // console.log(sheet);

    res.render("StudentViewAnswerSheet",{title:'Answersheet',data:sheet,paperID:pid,email:email,subject:subject,username:username});

});

module.exports=router;
