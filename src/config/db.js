const mongoose = require('mongoose')

const connectdb = async () => {
    try {
        const options = {
            serverSelectionTimeoutMS: 5000, // 5 seconds
            socketTimeoutMS: 45000, // 45 seconds
            bufferMaxEntries: 0, // Disable mongoose buffering
            bufferCommands: false, // Disable mongoose buffering
            maxPoolSize: 10, // Maintain up to 10 socket connections
            retryWrites: true,
            w: 'majority'
        }

        await mongoose.connect(process.env.MONGO_URI, options)
        console.log("The DB is Connected")
        
        // Handle connection events
        mongoose.connection.on('error', (err) => {
            console.error('MongoDB connection error:', err)
        })
        
        mongoose.connection.on('disconnected', () => {
            console.log('MongoDB disconnected')
        })
        
        mongoose.connection.on('reconnected', () => {
            console.log('MongoDB reconnected')
        })
        
    } catch (error) {
        console.error("There has been some error in Connecting DB:", error.message)
        process.exit(1)
    }
}

module.exports = connectdb