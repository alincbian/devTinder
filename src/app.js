const express = require("express")

const app = express()

app.use("/test", (req, res) => {
    res.send("Hello from test route!")
})

app.use("/hello", (req, res) => {
    res.send("Hello Hello Hello..")
})


app.listen(7777, () => {
    console.log("server is listening on port: 7777...")
})