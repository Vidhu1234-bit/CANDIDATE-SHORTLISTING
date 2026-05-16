// routes/aiRoutes.js

const express = require('express');
const router = express.Router();
const { aiShortlist, generateQuestions } = require('../controllers/aiController');

// POST /api/ai/shortlist — AI ranking of candidates
router.post('/shortlist', aiShortlist);

// POST /api/ai/questions — Generate interview questions
router.post('/questions', generateQuestions);

module.exports = router;