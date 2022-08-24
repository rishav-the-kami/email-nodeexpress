const express = require('express')
const bcrypt = require('bcryptjs')
const User = require("../db/users")
const Email = require("../db/email")
const auth = require("../middleware/auth")
const jwt = require("jsonwebtoken")

const router = new express.Router()

router.get("/", auth, async (req, res) => {})
router.get("/register", (req, res) => res.render("register"))
router.get("/login", (req, res) => res.render("login"))

router.post("/", async(req, res) => {
    try {
        const receivedUser = await User.findOne({ id: req.body.receiverId })
        console.log(receivedUser)
        
        const verifyUser = jwt.verify(req.cookies.authenticated, process.env.SECRET_KEY)
        const verifiedUser = await User.findOne({ _id: verifyUser.id })

        const sender = verifiedUser.id
        const receiver = receivedUser.id
        const content = req.body.content

        if(sender != receiver) {
            const newEmail = new Email({ sender, receiver, content })
            const savedEmail = await newEmail.save()
            console.log(savedEmail)

            res.send(savedEmail)
        }
        else {
            res.send("SENDER = RECEIVER")
        }
    }
    catch (err) {
        res.send(err)
    }
})
router.post("/register", async(req, res) => {
    try {
        const password = await bcrypt.hash(req.body.password, 10)

        const data = {
            name: req.body.name,
            id: req.body.id,
            password
        }

        const newUser = new User(data)

        const token = await newUser.generateToken()
        console.log(token)

        const savedData = await newUser.save()

        res.cookie("authenticated", token, {
            expires: new Date(Date.now() + 60000),
            httpOnly: true
        })

        res.render("main")
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

        if(comparePassword) {
            const token = await foundUser.generateToken()
            console.log(token)
            
            res.cookie("authenticated", token, {
                expires: new Date(Date.now() + 600000),
                httpOnly: true
            })

            res.render("main")
        }
        else
            res.send("Invalid credentials")
    }
    catch (err) {
        res.status(401).send(err)
    }
})

const getEmails = async(req, res) => {
    try {
        const verifyUser = jwt.verify(req.cookies.authenticated, process.env.SECRET_KEY)
        const checkForUser = await User.findOne({ _id: verifyUser.id })
        
        const emails = await Email.find({ receiver: checkForUser.id })
        
        emails.length > 0 ? res.render("emails", { emails }) : res.render("emails", { noEmailMsg: "How bad does it feel to have no frens to get emails from jajajajjaja" })
    }
    catch (err) {
        res.send("UR NOOB. LOGIN/REGISTER NOOOB")
        console.log(err)
    }
}

router.get("/emails/myemails", getEmails)
router.get("/emails/myemail", getEmails)

router.get("/emails/sent", async(req, res) => {
    try {
        const verifyUser = jwt.verify(req.cookies.authenticated, process.env.SECRET_KEY)
        const checkForUser = await User.findOne({ _id: verifyUser.id })
        
        const emails = await Email.find({ sender: checkForUser.id })
        
        emails.length > 0 ? res.render("emails", { emails }) : res.render("emails", { noEmailMsg: "NO EMAILS. MAIL SMTH NOOB" })
    }
    catch (err) {
        res.send("UR NOOB. LOGIN/REGISTER MFFFFFFF")
        console.log(err)
    }
})

router.get("/logout", async (req, res) => {
    try {
        const verifyUser = jwt.verify(req.cookies.authenticated, process.env.SECRET_KEY)
        const checkForUser = await User.findOne({ _id: verifyUser.id })

        res.clearCookie("authenticated")
        res.render("login")
    }
    catch(err) {
        res.send("REGISTER/LOGIN FIRST U NOOOOOB")
        console.log(err) 
    }
})


module.exports = router