require('dotenv').config()
const app = require('./src/app')
const connectDB = require('./src/config/db')

const server = async (req,res) =>{
    try {
        await connectDB()
        app.listen(process.env.PORT,()=>{
            console.log("Server has Started")
        })
    } catch (error) {
        console.log(error.message)
    }
}

server()