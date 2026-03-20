const express = require("express")
const router = express.Router()

const userLogin = require("../controller/userLogin.controller")
const userRegister = require("../controller/userRegister.controller")

router.post("/login", userLogin)
router.post("/register", userRegister)


module.exports = router