import mongoose, { Schema } from 'mongoose'

const TicketSchema = new Schema({
  id: {
    type: String,
    required: true,
    unique: true
  },
  userId: {
    type: String,
    required: true
  },
  code: {
    type: String,
    required: true
  }
})

export const TicketMongoDBModel = mongoose.model('ticket', TicketSchema)

TicketMongoDBModel.createCollection()
