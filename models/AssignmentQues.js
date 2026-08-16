const mongoose = require('mongoose');

const quesSchema = mongoose.Schema({
    paperID:{
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
    }

});



module.exports = mongoose.model('AssignmentQues',quesSchema);