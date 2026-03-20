require('dotenv').config()
const express = require('express')
const path = require('path')
const app = express()
const cookieParser = require('cookie-parser')
app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())
const userRoutes = require("./routes/user.routes")

app.use("/user", userRoutes)

// View routes
app.get('/register', (req, res) => {
    const error = req.query.error
    const success = req.query.success
    res.render('register', { error, success })
})

app.get('/login', (req, res) => {
    const error = req.query.error
    const success = req.query.success
    res.render('login', { error, success })
})

app.get('/logout', (req, res) => {
    res.clearCookie('token')
    res.render('login', { success: "Logged out successfully!" })
})

app.get('/infrastructure', async (req, res) => {
    try {
        const token = req.cookies.token
        if (!token) {
            return res.redirect('/login?error=Please login to access infrastructure')
        }

        const jwt = require('jsonwebtoken')
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        
        const User = require('./models/user.model')
        
        const user = await User.findById(decoded.id)
        if (!user) {
            return res.redirect('/login?error=User not found')
        }

        res.render('infrastructure', { 
            token,
            user: {
                email: user.email,
                createdAt: user.createdAt,
                id: user._id
            }
        })
    } catch (error) {
        res.redirect('/login?error=Invalid session. Please login again.')
    }
})

app.get('/dashboard', async (req, res) => {
    try {
        const token = req.cookies.token
        if (!token) {
            return res.redirect('/login?error=Please login to access dashboard')
        }

        const jwt = require('jsonwebtoken')
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        const User = require('./models/user.model')
        
        const user = await User.findById(decoded.id)
        if (!user) {
            return res.redirect('/login?error=User not found')
        }

        res.render('dashboard', { 
            token,
            user: {
                email: user.email,
                createdAt: user.createdAt,
                id: user._id
            }
        })
    } catch (error) {
        console.error('Dashboard JWT verification error:', error.message)
        res.redirect('/login?error=Invalid session. Please login again.')
    }
})

app.get('/', (req, res) => {
    res.render('landing')
})

module.exports = app