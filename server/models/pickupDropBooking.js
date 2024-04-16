const mongoose = require("mongoose");

const PickupDropSchema = new mongoose.Schema({
  BookedDateAndTime: Date,
  BookingTime: Date,
  PickupLocation: String, 
  DropLocation: String, 
  Distance: String,
  Cost: Number,
  userId: mongoose.Schema.Types.ObjectId, // Defining mongoose built-in _id/userId as ObjectId
  userName: String,
  userEmail: String,
  userPhone: Number,
  status: String, 
  IsCompleted: Boolean,
  DriverId: mongoose.Schema.Types.ObjectId, 
  DriverName: String, 
  DriverPhone: Number
});

const PickupDropModel = mongoose.model("BookingPickupDrop", PickupDropSchema);

module.exports = PickupDropModel;
