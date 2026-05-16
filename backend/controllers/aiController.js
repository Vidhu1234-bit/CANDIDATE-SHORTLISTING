// controllers/aiController.js
// This handles AI features using OpenRouter API
// OpenRouter lets us use powerful AI models for free

const axios = require('axios');
const Candidate = require('../models/Candidate');

// Helper function to call OpenRouter API
const callOpenRouter = async (prompt, maxTokens = 1000) => {
  const response = await axios.post(
    'https://openrouter.ai/api/v1/chat/completions',
    {
      model: 'mistralai/mistral-7b-instruct:free', // Free model on OpenRouter
      messages: [
        {
          role: 'system',
          content: 'You are an expert HR recruiter and talent acquisition specialist. Provide structured, professional analysis.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      max_tokens: maxTokens,
      temperature: 0.7
    },
    {
      headers: {
        'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': process.env.FRONTEND_URL || 'http://localhost:5173',
        'X-Title': 'Candidate Shortlisting System'
      }
    }
  );

  return response.data.choices[0].message.content;
};

// ============================================================
// AI SHORTLIST — POST /api/ai/shortlist
// ============================================================
const aiShortlist = async (req, res) => {
  try {
    const { requiredSkills, preferredSkills, minExperience, jobTitle, jobDescription } = req.body;

    if (!requiredSkills) {
      return res.status(400).json({
        success: false,
        message: 'Required skills are needed for AI analysis'
      });
    }

    // Get all candidates from DB
    const candidates = await Candidate.find({});

    if (candidates.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No candidates found. Please add candidates first.'
      });
    }

    // Build candidate summaries for AI
    const candidateSummaries = candidates.map((c, i) =>
      `Candidate ${i + 1}: ${c.name}
       Skills: ${c.skills.join(', ')}
       Experience: ${c.experience} years
       Bio: ${c.bio || 'Not provided'}`
    ).join('\n\n');

    // Build the AI prompt for ranking
    const rankingPrompt = `
You are an expert HR recruiter. Analyze these candidates for the following job:

JOB TITLE: ${jobTitle || 'Software Developer'}
REQUIRED SKILLS: ${requiredSkills}
PREFERRED SKILLS: ${preferredSkills || 'None specified'}
MINIMUM EXPERIENCE: ${minExperience || 0} years
JOB DESCRIPTION: ${jobDescription || 'Not provided'}

CANDIDATES:
${candidateSummaries}

Please provide:
1. RANKING: Rank all candidates from best to least suitable
2. EXPLANATION: For each candidate, explain in 2-3 sentences why they are or aren't suitable
3. TOP PICK: Clearly state who the best candidate is and why

Format your response as:
RANKING:
1. [Candidate Name] - [Score/10] - [One line reason]
2. [Candidate Name] - [Score/10] - [One line reason]
...

EXPLANATIONS:
[Candidate Name]: [2-3 sentence explanation]
...

TOP PICK:
[Name]: [Why they are the best fit]
`;

    const aiRankingResult = await callOpenRouter(rankingPrompt, 1500);

    // Now generate interview questions for top candidates
    const topCandidates = candidates.slice(0, Math.min(3, candidates.length));
    const topNames = topCandidates.map(c => c.name).join(', ');

    const interviewPrompt = `
Generate 5 technical interview questions for a candidate applying for a role requiring: ${requiredSkills}

Make the questions specific to these skills. Include:
- 2 conceptual/theory questions
- 2 practical/coding questions  
- 1 behavioral question

Format as:
Q1: [Question]
Type: [Conceptual/Practical/Behavioral]
Expected Answer Hint: [Brief hint]

Q2: ...
`;

    const interviewQuestions = await callOpenRouter(interviewPrompt, 800);

    // Generate an overall recommendation
    const recommendationPrompt = `
Based on this job requiring ${requiredSkills} with minimum ${minExperience || 0} years experience, 
and having ${candidates.length} candidates total, provide a brief 2-paragraph hiring recommendation.
Include what to look for in interviews and any concerns about the candidate pool.
`;

    const recommendation = await callOpenRouter(recommendationPrompt, 400);

    res.status(200).json({
      success: true,
      jobTitle: jobTitle || 'Software Developer',
      totalCandidatesAnalyzed: candidates.length,
      aiRanking: aiRankingResult,
      interviewQuestions: interviewQuestions,
      recommendation: recommendation,
      analyzedAt: new Date().toISOString()
    });

  } catch (error) {
    console.error('AI Shortlist Error:', error.response?.data || error.message);
    
    // If API key is missing or invalid
    if (error.response?.status === 401) {
      return res.status(401).json({
        success: false,
        message: 'OpenRouter API key is invalid or missing. Please check your .env file.'
      });
    }

    // If rate limited
    if (error.response?.status === 429) {
      return res.status(429).json({
        success: false,
        message: 'Too many AI requests. Please wait a moment and try again.'
      });
    }

    res.status(500).json({
      success: false,
      message: 'AI analysis failed. Please try again.',
      error: error.message
    });
  }
};

// ============================================================
// GENERATE INTERVIEW QUESTIONS — POST /api/ai/questions
// ============================================================
const generateQuestions = async (req, res) => {
  try {
    const { candidateId, jobRequirements } = req.body;

    const candidate = await Candidate.findById(candidateId);
    if (!candidate) {
      return res.status(404).json({ success: false, message: 'Candidate not found' });
    }

    const prompt = `
Generate 8 personalized interview questions for this candidate:

CANDIDATE: ${candidate.name}
CANDIDATE SKILLS: ${candidate.skills.join(', ')}
EXPERIENCE: ${candidate.experience} years
BIO: ${candidate.bio || 'Not provided'}
JOB REQUIREMENTS: ${jobRequirements || candidate.skills.join(', ')}

Create a mix of:
- Technical questions specific to their skills
- Problem-solving questions
- Experience-based questions
- Culture fit questions

Format each question clearly numbered.
`;

    const questions = await callOpenRouter(prompt, 800);

    res.status(200).json({
      success: true,
      candidate: { name: candidate.name, skills: candidate.skills },
      questions: questions
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to generate questions',
      error: error.message
    });
  }
};

module.exports = { aiShortlist, generateQuestions };