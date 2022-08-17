const express = require('express')
const bcrypt = require('bcryptjs')
const User = require("../db/users")

const router = new express.Router()

router.get("/", (req, res) => res.render("index"))
router.get("/register", (req, res) => res.render("register"))
router.get("/login", (req, res) => res.render("login"))

router.post("/register", async(req, res) => {
    try {
        const password = await bcrypt.hash(req.body.password, 10)

        const data = {
            name: req.body.name,
            id: req.body.id,
            password
        }

        const newUser = new User(data)
        const savedData = await newUser.save()

        res.send(savedData)
    }
    catch (err) {
        res.status(401).send(err)
    }
})
router.post("/login", async (req, res) => {
    try {
        const password = req.body.password
        const foundUser = await User.findOne({ id: req.body.id })
        const comparePassword = await bcrypt.compare(password, foundUser.password)

        if(comparePassword)
            res.send(foundUser)
        else
            res.send("Invalid credentials")
    }
    catch (err) {
        res.status(401).send(err)
    }
})


module.exports = router
