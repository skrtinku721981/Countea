const express = require('express');
const User = require('../models/User');
const router = express.Router();
const { body, validationResult } = require('express-validator');

// Login (submit snack data)
router.post('/login', [
    body('Ename', 'Enter a valid User name').isLength({ min: 3 }),
    body('Eid', 'Enter a valid Employee ID').isNumeric(),
    body('Department', 'Enter a valid department').isLength({ min: 2 }),
    body('Snacks', 'Snacks must be an array').isArray({ min: 1 }),
    body('Purpose', 'Purpose is required').isIn(['official', 'meeting', 'guest']),
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    try {
        const { Ename, Eid, Department, Snacks, Purpose, OtherSnack } = req.body;

        // Optionally, validate each snack object
        for (const snackObj of Snacks) {
            if (
                typeof snackObj.Snack !== "string" ||
                typeof snackObj.Quantity !== "number" ||
                snackObj.Quantity < 1
            ) {
                return res.status(400).json({ error: "Invalid snack entry" });
            }
        }

        const user = await User.create({
            Ename,
            Eid,
            Department,
            Snacks,
            Purpose,
            OtherSnack
        });

        res.json(user);
    }
    catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error");
    }
});

// Endpoint to get employee details by ID (for autofill)
router.get('/employee/:Eid', async (req, res) => {
    try {
        const user = await User.findOne({ Eid: req.params.Eid });
        if (!user) {
            return res.status(404).json({ error: "Employee not found" });
        }
        res.json({
            Ename: user.Ename,
            Department: user.Department
        });
    } catch (error) {
        res.status(500).json({ error: "Server error" });
    }
});

module.exports = router;