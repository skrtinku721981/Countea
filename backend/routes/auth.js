const express = require('express');
const User = require('../models/User');
const router = express.Router();
const { body, validationResult } = require('express-validator');

// Login (submit snack data)
router.post('/login', [
    body('ename', 'Enter a valid User name').isLength({ min: 3 }),
    body('eid', 'Enter a valid Employee ID').isNumeric(),
    body('department', 'Enter a valid department').isLength({ min: 2 }),
    body('snacks', 'Snacks must be an array').isArray({ min: 1 }),
    body('remarks', 'Remarks are required').isLength({ min: 2 }),
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    try {
        const { ename, eid, department, snacks, remarks, otherSnack } = req.body;

        // Optionally, validate each snack object
        for (const snackObj of snacks) {
            if (
                typeof snackObj.snack !== "string" ||
                typeof snackObj.quantity !== "number" ||
                snackObj.quantity < 1
            ) {
                return res.status(400).json({ error: "Invalid snack entry" });
            }
        }

        const user = await User.create({
            ename,
            eid,
            department,
            snacks,      // snacks: [{ snack, quantity }]
            remarks,
            otherSnack
        });

        res.json(user);
    }
    catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error");
    }
});

// Endpoint to get employee details by ID (for autofill)
router.get('/employee/:eid', async (req, res) => {
    try {
        const user = await User.findOne({ eid: req.params.eid });
        if (!user) {
            return res.status(404).json({ error: "Employee not found" });
        }
        res.json({
            ename: user.ename,
            department: user.department
        });
    } catch (error) {
        res.status(500).json({ error: "Server error" });
    }
});

module.exports = router;