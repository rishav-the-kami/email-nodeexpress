const mongoose = require("mongoose")
const validator = require("validator")

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
    }
})

const User = new mongoose.model("Users", userSchema)

module.exports = User
