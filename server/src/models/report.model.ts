import mongoose, { Schema } from 'mongoose'

const QuestionSchema = new mongoose.Schema(
  {
    category: {
      type: String,
      enum: ['tech', 'behavioral'],
      required: true,
    },
    question: {
      type: String,
      required: true,
    },
    expectedAnswer: String,
    intent: String,
  },
  { _id: false }
);


const SkillSchema = new mongoose.Schema({
    skill: {
        type: String,
        required: true
    },
    priority: {
        type: String,
        enum: ['high', 'medium', 'low'],
        required: true
    }
}, { _id: false })

const PlanSchema = new mongoose.Schema({
    day: {
        type: Number,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    action: {
        type: [String],
        required: true
    }
}, { _id: false })

const reportSchema = new mongoose.Schema({
    jobDescription: {
        type: String,
        required: true
    },
    resume: {
        type: String
    },
    feedback: {
        type: String
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    score: {
        type: Number,
        default: 0
    },
    questions: {
        type: [QuestionSchema],
        default: [],
    },
    skillsToImprove: {
        type: [SkillSchema],
        default: []
    },
    improvementPlan: {
        type: [PlanSchema],
    }
}, {
    timestamps: true
})


const ReportModel = mongoose.model('Report', reportSchema)

export default ReportModel
