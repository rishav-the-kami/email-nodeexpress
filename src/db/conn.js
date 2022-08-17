const mongoose = require("mongoose")
mongoose.connect("mongodb://localhost:27017/email")
.then(() => console.log("connection to db successful"))
.catch(err => console.log(err))