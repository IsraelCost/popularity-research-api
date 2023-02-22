import mongoose, { Schema } from 'mongoose'

const SurveySchema = new Schema({
  id: {
    type: String,
    required: true,
    unique: true
  },
  award: {
    type: Object,
    required: true
  },
  label: {
    type: String,
    required: true
  },
  questions: {
    type: Array,
    required: true,
    default: []
  },
  cityId: {
    type: String
  }
})

export const SurveyMongoDBModel = mongoose.model('survey', SurveySchema)

SurveyMongoDBModel.createCollection()
