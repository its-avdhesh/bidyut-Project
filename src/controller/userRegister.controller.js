const User = require("../models/user.model")
const bcrypt = require("bcrypt")

const registerUser = async (req, res) => {
    try {
        const { email, password } = req.body
        if(!email || !password){
            return res.status(400).render('register', { error: "Email and password are required" })
        }
        const saltRounds = 10
        const hashedPassword = await bcrypt.hash(password, saltRounds)

        const user = await User.create({ email, password: hashedPassword })
        res.status(201).render('login', { success: "Registration successful! Please login." })
    } catch (error) {
        res.status(400).render('register', { error: error.message })
    }
}

module.exports = registerUser