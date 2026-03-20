const User = require("../models/user.model")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const login = async(req,res) =>{
    try {
        const { email, password } = req.body
        if( !email || !password ){
            return res.status(400).render('login', { error: "Email and password are required" })
        }       
        const user = await User.findOne({ email })
        if(!user){
            return res.status(400).render('login', { error: "Invalid email or password" })
        }
        const isPasswordValid = await bcrypt.compare(password, user.password)
        if( !isPasswordValid ){
            return res.status(400).render('login', { error: "Invalid email or password" })
        }
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" })
        res.cookie("token", token)
        return res.status(200).render('dashboard', { token })
        
    } catch (error) {
        return res.status(400).render('login', { error: error.message })
        
    }
}

module.exports = login