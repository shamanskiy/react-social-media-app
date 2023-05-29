// This serves the built distribution copy of the app on localhost:4000
const express = require("express")
const path = require("path")
const app = new express()
app.use(express.static(path.join(__dirname, "dist")))
app.get("*", (req, res) => res.sendFile(__dirname + "/dist/index.html"))
app.listen("4000")
