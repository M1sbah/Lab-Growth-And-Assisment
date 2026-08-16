const express = require("express");
const router = express.Router();
const User = require('../models/User');
const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');
const user_jwt = require('../middleware/user_jwt');

router.get('/',async(req,res) => {
    console.log(req.session.email);

});

module.exports=router;