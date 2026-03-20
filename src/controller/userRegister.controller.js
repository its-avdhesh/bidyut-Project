const User = require("../models/user.model")
const bcrypt = require("bcrypt")

const registerUser = async (req, res) => {
    try {
        const { email, password } = req.body
        if(!email || !password){
            return res.status(400).render('register', { error: "Email and password are required" })
        }
        
        // Check if user already exists
        const existingUser = await User.findOne({ email })
        if(existingUser){
            return res.status(400).render('register', { error: "Email already registered. Please use a different email or login." })
        }
        
        const saltRounds = 10
        const hashedPassword = await bcrypt.hash(password, saltRounds)

        const user = await User.create({ email, password: hashedPassword })
        res.status(201).render('login', { success: "Registration successful! Please login." })
    } catch (error) {
        // Handle specific MongoDB duplicate key error
        if(error.code === 11000 && error.keyPattern?.email) {
            return res.status(400).render('register', { error: "Email already registered. Please use a different email or login." })
        }
        res.status(400).render('register', { error: "Registration failed. Please try again." })
    }
}

module.exports = registerUser