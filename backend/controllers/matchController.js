// controllers/matchController.js
// This handles the SKILL MATCHING logic
// It compares job requirements with candidate skills and gives a match score

const Candidate = require('../models/Candidate');

// ============================================================
// MATCH CANDIDATES TO JOB — POST /api/match
// ============================================================
const matchCandidates = async (req, res) => {
  try {
    const { requiredSkills, preferredSkills, minExperience } = req.body;

    // Validate input
    if (!requiredSkills || requiredSkills.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Please provide at least one required skill'
      });
    }

    // Parse required skills
    let reqSkills = requiredSkills;
    if (typeof requiredSkills === 'string') {
      reqSkills = requiredSkills.split(',').map(s => s.trim().toLowerCase());
    } else {
      reqSkills = requiredSkills.map(s => s.toLowerCase());
    }

    // Parse preferred skills
    let prefSkills = [];
    if (preferredSkills) {
      if (typeof preferredSkills === 'string') {
        prefSkills = preferredSkills.split(',').map(s => s.trim().toLowerCase());
      } else {
        prefSkills = preferredSkills.map(s => s.toLowerCase());
      }
    }

    const minExp = Number(minExperience) || 0;

    // Get all candidates from DB
    const allCandidates = await Candidate.find({});

    // Calculate match score for each candidate
    const scoredCandidates = allCandidates.map(candidate => {
      const candidateSkills = candidate.skills.map(s => s.toLowerCase());

      // Count how many REQUIRED skills the candidate has
      const requiredMatches = reqSkills.filter(skill =>
        candidateSkills.some(cs => cs.includes(skill) || skill.includes(cs))
      );

      // Count how many PREFERRED skills the candidate has
      const preferredMatches = prefSkills.filter(skill =>
        candidateSkills.some(cs => cs.includes(skill) || skill.includes(cs))
      );

      // SCORING FORMULA:
      // Required skills = 70% of score
      // Preferred skills = 20% of score
      // Experience = 10% of score

      const reqScore = reqSkills.length > 0
        ? (requiredMatches.length / reqSkills.length) * 70
        : 70;

      const prefScore = prefSkills.length > 0
        ? (preferredMatches.length / prefSkills.length) * 20
        : 20;

      // Experience score: meets minimum = full 10 points
      const expScore = candidate.experience >= minExp ? 10 : 
        (candidate.experience / Math.max(minExp, 1)) * 10;

      const totalScore = Math.round(reqScore + prefScore + expScore);

      // Determine rank level based on score
      let rank;
      if (totalScore >= 70) rank = 'High Match';
      else if (totalScore >= 40) rank = 'Medium Match';
      else rank = 'Low Match';

      return {
        candidate: {
          _id: candidate._id,
          name: candidate.name,
          email: candidate.email,
          skills: candidate.skills,
          experience: candidate.experience,
          bio: candidate.bio,
          isShortlisted: candidate.isShortlisted
        },
        matchScore: totalScore,
        rank,
        matchedRequiredSkills: requiredMatches,
        matchedPreferredSkills: preferredMatches,
        missingRequiredSkills: reqSkills.filter(skill =>
          !candidateSkills.some(cs => cs.includes(skill) || skill.includes(cs))
        ),
        meetsExperience: candidate.experience >= minExp
      };
    });

    // Sort by match score — highest first
    scoredCandidates.sort((a, b) => b.matchScore - a.matchScore);

    // Update lastMatchScore in DB for each candidate
    for (const result of scoredCandidates) {
      await Candidate.findByIdAndUpdate(result.candidate._id, {
        lastMatchScore: result.matchScore
      });
    }

    res.status(200).json({
      success: true,
      jobRequirements: {
        requiredSkills: reqSkills,
        preferredSkills: prefSkills,
        minExperience: minExp
      },
      totalCandidates: scoredCandidates.length,
      highMatches: scoredCandidates.filter(c => c.rank === 'High Match').length,
      mediumMatches: scoredCandidates.filter(c => c.rank === 'Medium Match').length,
      lowMatches: scoredCandidates.filter(c => c.rank === 'Low Match').length,
      results: scoredCandidates
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to match candidates',
      error: error.message
    });
  }
};

module.exports = { matchCandidates };