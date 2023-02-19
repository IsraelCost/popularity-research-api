import mongoose, { Schema } from 'mongoose'

const SurveySchema = new Schema({
  id: {
    type: String,
    required: true,
    unique: true
  },
  label: {
    type: String,
    required: true
  },
  questions: {
    type: Array,
    required: true,
    default: []
  }
})

export const SurveyMongoDBModel = mongoose.model('survey', SurveySchema)

SurveyMongoDBModel.createCollection()
