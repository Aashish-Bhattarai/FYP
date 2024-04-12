const mongoose = require('mongoose');

// Define a schema
const bookingPackageSchema = new mongoose.Schema({
    PackageName: String,
    BookedDate: Date,
    BookingTime: Date,
    PeopleCapacity: String,
    Cost: Number,
    status: String,
    userId: mongoose.Schema.Types.ObjectId // Defining mongoose built-in _id/userId as ObjectId
});

// Create a model from the schema
const BookingPackage = mongoose.model('BookingPackage', bookingPackageSchema);

module.exports = BookingPackage;
