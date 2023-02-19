import mongoose from 'mongoose'

export const connect = async (uri = process.env.MONGO_URI) => {
  await mongoose.connect(uri!, {
    dbName: process.env.DB_NAME,
    ignoreUndefined: true
  })
  console.log('Database connected')
}

export const disconnect = async () => {
  await mongoose.disconnect()
  console.log('Database disconnected')
}
