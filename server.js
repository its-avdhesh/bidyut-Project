require('dotenv').config()
const app = require('./src/app')
const connectDB = require('./src/config/db')

const server = async () => {
    try {
        await connectDB()
        
        const server = app.listen(process.env.PORT, () => {
            console.log(`Server has Started on port ${process.env.PORT}`)
        })

        // Graceful shutdown
        const gracefulShutdown = async (signal) => {
            console.log(`Received ${signal}. Shutting down gracefully...`)
            
            server.close(async () => {
                console.log('HTTP server closed')
                
                // Close database connection
                const mongoose = require('mongoose')
                await mongoose.connection.close()
                console.log('MongoDB connection closed')
                
                process.exit(0)
            })
            
            // Force close after 10 seconds
            setTimeout(() => {
                console.log('Forcing shutdown...')
                process.exit(1)
            }, 10000)
        }

        // Handle shutdown signals
        process.on('SIGTERM', () => gracefulShutdown('SIGTERM'))
        process.on('SIGINT', () => gracefulShutdown('SIGINT'))
        
    } catch (error) {
        console.error('Server startup error:', error.message)
        process.exit(1)
    }
}

server()