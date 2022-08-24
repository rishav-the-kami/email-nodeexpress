const mongoose = require("mongoose")
const validator = require("validator")
const jwt = require("jsonwebtoken")

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        minlength: 1
    },
    id: {
        type: String,
        required: true,
        unique: true,
        validate(val) {
            if(!(val.indexOf('@') == val.lastIndexOf('@')))
                throw new Error('Invalid Email Address')
        }
    },
    password: {
        required: true,
        type: String
    },
    tokens: [{
        token: {
            type: String,
            required: true
        }
    }]
})

userSchema.methods.generateToken = async function() {
    try {
        const generatedToken = jwt.sign({ id: this._id.toString() }, process.env.SECRET_KEY)
        this.tokens.push({ token: generatedToken })
        await this.save()
        console.log(generatedToken)

        return generatedToken
    }
    catch (err) {
        console.log(err) 
    }
}

const User = new mongoose.model("Users", userSchema)

module.exports = User
