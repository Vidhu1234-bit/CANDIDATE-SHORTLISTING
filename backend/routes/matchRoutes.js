
// routes/matchRoutes.js

const express = require('express');
const router = express.Router();
const { matchCandidates } = require('../controllers/matchController');

// POST /api/match — match candidates to job requirements
router.post('/', matchCandidates);

module.exports = router;