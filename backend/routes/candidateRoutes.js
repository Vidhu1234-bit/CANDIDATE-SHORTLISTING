// routes/candidateRoutes.js
// Routes define WHICH function runs for which URL + HTTP method

const express = require('express');
const router = express.Router();

// Import controller functions
const {
  getAllCandidates,
  getCandidateById,
  createCandidate,
  updateCandidate,
  deleteCandidate,
  toggleShortlist
} = require('../controllers/candidateController');

// Define routes:
// GET    /api/candidates        → get all candidates (with search/filter)
// POST   /api/candidates        → add new candidate
// GET    /api/candidates/:id    → get one candidate
// PUT    /api/candidates/:id    → update candidate
// DELETE /api/candidates/:id    → delete candidate
// PATCH  /api/candidates/:id/shortlist → toggle shortlist

router.route('/')
  .get(getAllCandidates)
  .post(createCandidate);

router.route('/:id')
  .get(getCandidateById)
  .put(updateCandidate)
  .delete(deleteCandidate);

router.patch('/:id/shortlist', toggleShortlist);

module.exports = router;