const mongoose = require('mongoose')
const connectdb = async () =>{
    try{
        await mongoose.connect(process.env.MONGO_URI)
        console.log("The DB is Connected")
    }catch(error){
        console.log("There has been some error in Connecting DB",error.message)
        process.exit(1)
    }
}
module.exports = connectdb