const User = require("../models/user.model")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")

const login = async(req,res) =>{
    try {
        const { email, password } = req.body
        if( !email || !password ){
            return res.status(400).redirect('/login?error=Email and password are required')
        }       
        const user = await User.findOne({ email })
        if(!user){
            return res.status(400).redirect('/login?error=Invalid email or password')
        }
        const isPasswordValid = await bcrypt.compare(password, user.password)
        if( !isPasswordValid ){
            return res.status(400).redirect('/login?error=Invalid email or password')
        }
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" })
        
        // Set cookie with proper options
        res.cookie("token", token, {
            httpOnly: true,
            secure: false, // Set to true in production with HTTPS
            maxAge: 3600000, // 1 hour in milliseconds
            sameSite: 'lax'
        })
        
        // Pass user information to dashboard
        return res.status(200).redirect('/dashboard')
        
    } catch (error) {
        return res.status(400).redirect('/login?error=Login failed. Please try again.')
    }
}

module.exports = login