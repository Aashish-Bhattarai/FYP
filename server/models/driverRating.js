const mongoose = require('mongoose')

const DriverRatingSchema = new mongoose.Schema({
    DriverName: String,
    DriverId: mongoose.Schema.Types.ObjectId, // Defining mongoose built-in _id/userId as ObjectId
    userName: String,
    userID: mongoose.Schema.Types.ObjectId, 
    Rating: Number,
    PickupDropId: mongoose.Schema.Types.ObjectId 
})

const DriverRatingModel = mongoose.model("DriverRating", DriverRatingSchema)
module.exports = DriverRatingModel