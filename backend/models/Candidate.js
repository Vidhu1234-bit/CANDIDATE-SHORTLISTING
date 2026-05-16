// models/Candidate.js
// This defines the "shape" of a candidate in our database
// Think of it like a form template — every candidate must have these fields

const mongoose = require('mongoose');

// Define the schema (blueprint) for a Candidate
const candidateSchema = new mongoose.Schema(
  {
    // Candidate's full name — required field
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true, // removes extra spaces
      minlength: [2, 'Name must be at least 2 characters']
    },

    // Email address — must be unique
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true, // no two candidates can have same email
      lowercase: true, // store as lowercase
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email'] // email format check
    },

    // Skills array — list of skills like ["React", "Node.js", "MongoDB"]
    skills: {
      type: [String],
      required: [true, 'At least one skill is required'],
      validate: {
        validator: function(arr) { return arr.length > 0; },
        message: 'Skills array cannot be empty'
      }
    },

    // Years of experience
    experience: {
      type: Number,
      required: [true, 'Experience is required'],
      min: [0, 'Experience cannot be negative'],
      max: [50, 'Experience seems too high']
    },

    // Bio or project description
    bio: {
      type: String,
      default: '',
      maxlength: [1000, 'Bio cannot exceed 1000 characters']
    },

    // Whether this candidate is shortlisted/saved
    isShortlisted: {
      type: Boolean,
      default: false
    },

    // Store the last AI match score (0-100)
    lastMatchScore: {
      type: Number,
      default: null
    }
  },
  {
    // Automatically add "createdAt" and "updatedAt" timestamps
    timestamps: true
  }
);

// Export the model so other files can use it
module.exports = mongoose.model('Candidate', candidateSchema);