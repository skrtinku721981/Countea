const express = require('express');
const User = require('../models/User');
const router = express.Router();
const { body, validationResult } = require('express-validator');
//user creating POST "/api/auth/"

// validation points


//Login 
router.post('/login', [
    body('ename', 'Enter the valid User name').isLength({ min: 3 }),
], async(req, res) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    try{
      let user = await User.create({
        ename: req.body.ename,
        eid: req.body.eid,
        department: req.body.department,
        snacks: req.body.snacks,
        quantity: req.body.quantity,
        remarks: req.body.remarks,
        otherSnack: req.body.otherSnack,
    }).then(user => res.json(user));
    }
    catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error");
  }

})
//Authenticate the user 




module.exports = router 