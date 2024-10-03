const express = require("express")
const connectDB = require("./config/database")
const User = require("./models/user")

const app = express()

app.use(express.json())

app.post("/signup", async (req, res) => {

    const newUser = new User(req.body)

    try {
        await newUser.save()
        res.send("User added successfully!")
    }catch(err){
        res.status(400).send("An error occurred: " + err)
    }
})

// Find user by emailId

app.get("/user", async (req, res) => {
    
    const {emailId} = req.body

    try{
        const user = await User.findOne({emailId: emailId})

        if(!user){
            res.status(404).send("User not found")
        }else{
            res.send(user)
        }
    }catch (err){
        res.status(400).send("Something went wrong: " + err)
    }
})

// Find user by id

app.get("/user/:id", async (req, res) => {

    const {id} = req.params

    try{
        const user = await User.findById(id)

        if(!user){
            res.status(404).send("User not found")
        }else{
            res.send(user)
        }
    }catch (err){
        res.status(400).send("Something went wrong: " + err)
    }

})

// Feed users 

app.get("/feed", async (req, res) => {
    try{
        const users = await User.find({})

        if(users?.length){
            res.send(users)
        }
    }catch (err){
        res.status(400).send("Something went wrong: " + err)
    }
})

// Delete user

app.delete("/user", async (req, res) => {
    const {userId} = req.body
    
    try {
     const user = await User.findByIdAndDelete(userId)

     res.send("User deleted successfully")

    }catch(err) {
        res.status(400).send("Something went wrong: " + err)
    }
})

// Update user by id

app.patch("/user", async (req, res) => {
    const {userId} = req.body
    const data = req.body

    try {

      const updatedUser = await User.findByIdAndUpdate(userId, data)
      
      await updatedUser.save()
      res.send("User updated successfully")

    } catch(err) {
        res.status(400).send("Something went wrong: " + err)
    }
})

// update user by email

app.patch("/user/byEmail", async (req, res) => {
    const {emailId} = req.body
    const data = req.body

    try {
        const updatedUser = await User.findOneAndUpdate({emailId}, data)

        await updatedUser.save()
      res.send("User updated successfully")
    } catch (err){
        res.status(400).send("Something went wrong: " + err)
    }
})

connectDB().then(() => {
    console.log("DB connection established")
    app.listen(7777, () => {
        console.log("server is listening on port: 7777...")
    }) 
}).catch((err) => {
    console.log(("DB can not be connected"))
})
