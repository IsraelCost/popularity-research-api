import mongoose, { Schema } from 'mongoose'

const UserSchema = new Schema({
  id: {
    type: String,
    required: true,
    unique: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  name: {
    type: String,
    required: true
  },
  profile: {
    type: String,
    enum: ['access', 'root'],
    required: true
  },
  verified: {
    type: Boolean,
    default: false
  },
  password: {
    type: String,
    required: true
  }
})

export const UserMongoDBModel = mongoose.model('user', UserSchema)

UserMongoDBModel.createCollection()
