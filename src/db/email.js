const mongoose = require('mongoose')

const emailSchema = new mongoose.Schema({
    sender: {
        type: String,
        required: true
    },
    receiver: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    }
})

const Email = new mongoose.model('emails', emailSchema)

module.exports = Email
