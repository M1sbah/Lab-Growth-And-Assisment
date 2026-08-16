const mongoose = require('mongoose');

const ansSchema = mongoose.Schema({
    paperID:{
        type: String,
        required:true
    },
    username:{
        type: String,
        required:true
    },
    
    email:{
        type: String,
        required:true
    },
    ques:{
        type: String,
        required:true
    },
    ans:{
        type: String,
        required:true
    },
    subject:{
        type: String,
        required:true
    },
    marks:{
        type:Number,
        required:true
    }

});



module.exports = mongoose.model('answersheet',ansSchema);