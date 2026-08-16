const express = require("express");
const router = express.Router();


router.get('/',async(req,res) => {
    if (req.session){
        req.session.destroy();
    }

    res.render('index');
});


module.exports = router;