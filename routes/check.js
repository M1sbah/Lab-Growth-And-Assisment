const express = require("express");
const router = express.Router();

router.get('/chk', (req,res,next) =>{
    console.log("test");
    console.log(req.body.name);
    res.json({
        name:req.body.name
    });

});

module.exports = router;