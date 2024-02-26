const mongoose = require('mongoose')

const UserSchema = new mongoose.Schema({
    name: String,
    email: String,
    phone: Number,
    password: String,
    role: { 
        type: String,
        default: 'user', // Set the default role as 'user'
    },
})

const UserModel = mongoose.model("users", UserSchema)
module.exports = UserModel