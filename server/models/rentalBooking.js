const mongoose = require('mongoose');

// Define a schema
const bookingRentalSchema = new mongoose.Schema({
    VehicleName: String,
    BookedDate: Date,
    BookingTime: Date,
    RentedDays: Number,
    SeatingType: String,
    VehicleYear: String,
    CostTotal: Number,
    status: String,
    userId: mongoose.Schema.Types.ObjectId // Defining mongoose built-in _id/userId as ObjectId
});

// Create a model from the schema
const BookingRental= mongoose.model('BookingRental', bookingRentalSchema);

module.exports = BookingRental;
