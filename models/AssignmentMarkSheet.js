const mongoose = require('mongoose');

const markSheet = mongoose.Schema({
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
    subject:{
        type: String,
        required:true
    },
    marks:{
        type:Number,
        required:true
    }

});



module.exports = mongoose.model('marksheet',markSheet);