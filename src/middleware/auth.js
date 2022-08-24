const jwt = require("jsonwebtoken")
const User = require("../db/users")

const auth = async(req, res, next) => {
    try {
        const verifyUser = jwt.verify(req.cookies.authenticated, process.env.SECRET_KEY)
    
        const checkForUsers = await User.findOne({ _id: verifyUser._id })
        console.log(checkForUsers)

        res.render("main")

        next()
    }
    catch(err) {
        console.log(err)
        res.render("index")
        next()
    }
}

module.exports = auth
