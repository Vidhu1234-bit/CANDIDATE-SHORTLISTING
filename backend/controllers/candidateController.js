// controllers/candidateController.js
// Controllers handle the LOGIC of each API endpoint
// They receive requests, process data, talk to the database, and send responses

const Candidate = require('../models/Candidate');

// ============================================================
// GET ALL CANDIDATES — GET /api/candidates
// ============================================================
const getAllCandidates = async (req, res) => {
  try {
    // Get search and filter parameters from the URL query string
    // Example: /api/candidates?search=React&minExp=2&skills=Node.js
    const { search, skills, minExp, maxExp } = req.query;

    // Build a "filter" object to query the database
    let filter = {};

    // If search term provided, search in name, email, or bio
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },   // 'i' = case insensitive
        { email: { $regex: search, $options: 'i' } },
        { bio: { $regex: search, $options: 'i' } }
      ];
    }

    // If skills filter provided, find candidates with ANY of those skills
    if (skills) {
      const skillsArray = skills.split(',').map(s => s.trim());
      filter.skills = { $in: skillsArray.map(s => new RegExp(s, 'i')) };
    }

    // Filter by experience range
    if (minExp || maxExp) {
      filter.experience = {};
      if (minExp) filter.experience.$gte = Number(minExp);
      if (maxExp) filter.experience.$lte = Number(maxExp);
    }

    // Fetch candidates from database, newest first
    const candidates = await Candidate.find(filter).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: candidates.length,
      data: candidates
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch candidates',
      error: error.message
    });
  }
};

// ============================================================
// GET SINGLE CANDIDATE — GET /api/candidates/:id
// ============================================================
const getCandidateById = async (req, res) => {
  try {
    const candidate = await Candidate.findById(req.params.id);
    
    if (!candidate) {
      return res.status(404).json({
        success: false,
        message: 'Candidate not found'
      });
    }

    res.status(200).json({
      success: true,
      data: candidate
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch candidate',
      error: error.message
    });
  }
};

// ============================================================
// CREATE CANDIDATE — POST /api/candidates
// ============================================================
const createCandidate = async (req, res) => {
  try {
    // req.body contains the data sent from the frontend form
    const { name, email, skills, experience, bio } = req.body;

    // Basic validation
    if (!name || !email || !skills || experience === undefined) {
      return res.status(400).json({
        success: false,
        message: 'Please provide name, email, skills, and experience'
      });
    }

    // Check if email already exists
    const existingCandidate = await Candidate.findOne({ email: email.toLowerCase() });
    if (existingCandidate) {
      return res.status(400).json({
        success: false,
        message: 'A candidate with this email already exists'
      });
    }

    // Parse skills: if sent as a string "React, Node.js", convert to array ["React", "Node.js"]
    let skillsArray = skills;
    if (typeof skills === 'string') {
      skillsArray = skills.split(',').map(s => s.trim()).filter(s => s.length > 0);
    }

    // Create new candidate in database
    const candidate = await Candidate.create({
      name,
      email,
      skills: skillsArray,
      experience: Number(experience),
      bio: bio || ''
    });

    res.status(201).json({
      success: true,
      message: 'Candidate added successfully!',
      data: candidate
    });
  } catch (error) {
    // Handle mongoose validation errors nicely
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(e => e.message);
      return res.status(400).json({
        success: false,
        message: messages.join(', ')
      });
    }

    res.status(500).json({
      success: false,
      message: 'Failed to create candidate',
      error: error.message
    });
  }
};

// ============================================================
// UPDATE CANDIDATE — PUT /api/candidates/:id
// ============================================================
const updateCandidate = async (req, res) => {
  try {
    const { name, email, skills, experience, bio, isShortlisted } = req.body;

    // Parse skills if string
    let updateData = { name, email, experience: Number(experience), bio, isShortlisted };
    
    if (skills) {
      if (typeof skills === 'string') {
        updateData.skills = skills.split(',').map(s => s.trim()).filter(s => s.length > 0);
      } else {
        updateData.skills = skills;
      }
    }

    // { new: true } returns the updated document, not the old one
    const candidate = await Candidate.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!candidate) {
      return res.status(404).json({
        success: false,
        message: 'Candidate not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Candidate updated successfully!',
      data: candidate
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to update candidate',
      error: error.message
    });
  }
};

// ============================================================
// DELETE CANDIDATE — DELETE /api/candidates/:id
// ============================================================
const deleteCandidate = async (req, res) => {
  try {
    const candidate = await Candidate.findByIdAndDelete(req.params.id);

    if (!candidate) {
      return res.status(404).json({
        success: false,
        message: 'Candidate not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Candidate deleted successfully!'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to delete candidate',
      error: error.message
    });
  }
};

// ============================================================
// TOGGLE SHORTLIST — PATCH /api/candidates/:id/shortlist
// ============================================================
const toggleShortlist = async (req, res) => {
  try {
    const candidate = await Candidate.findById(req.params.id);
    if (!candidate) {
      return res.status(404).json({ success: false, message: 'Candidate not found' });
    }

    candidate.isShortlisted = !candidate.isShortlisted;
    await candidate.save();

    res.status(200).json({
      success: true,
      message: candidate.isShortlisted ? 'Candidate shortlisted!' : 'Removed from shortlist',
      data: candidate
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Export all functions so routes can use them
module.exports = {
  getAllCandidates,
  getCandidateById,
  createCandidate,
  updateCandidate,
  deleteCandidate,
  toggleShortlist
};