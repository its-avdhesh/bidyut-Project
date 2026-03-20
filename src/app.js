const express = require('express')
const path = require('path')
const app = express()
app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
const userRoutes = require("./routes/user.routes")

app.use("/user", userRoutes)

// View routes
app.get('/register', (req, res) => {
    res.render('register')
})

app.get('/login', (req, res) => {
    res.render('login')
})

app.get('/logout', (req, res) => {
    res.clearCookie('token')
    res.render('login', { success: "Logged out successfully!" })
})

app.get('/', (req, res) => {
    res.render('landing')
})

module.exports = app