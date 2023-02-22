import mongoose, { Schema } from 'mongoose'

const CitySchema = new Schema({
  id: {
    type: String,
    required: true,
    unique: true
  },
  name: {
    type: String,
    required: true
  },
  picture: {
    type: String,
    required: true
  }
})

export const CityMongoDBModel = mongoose.model('city', CitySchema)

CityMongoDBModel.createCollection()
