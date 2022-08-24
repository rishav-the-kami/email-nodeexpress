require("dotenv").config()
const express = require('express')
const app = express()
const hbs = require('hbs')
const path = require('path')
const router = require('./models/router')
const cookieParser = require('cookie-parser')
require("./db/conn")

// NOTE and cookieParser() should be above everyone
app.use(cookieParser())
// NOTE: ALWAYS KEEP THESE 2 ABOVE EVERY OTHER APP.USE SET OR WTV
app.use(express.json())
app.use(express.urlencoded({extended: true}))

app.use(router)
app.use(express.static(path.join(__dirname, 'public')))
app.set("view engine", "hbs")
app.set("views", path.join(__dirname, '/templates/views'))
hbs.registerPartials(path.join(__dirname, '/templates/partials'))

const port = process.env.PORT || 80

app.listen(port, () => console.log("listening on https://localhost:80"))
