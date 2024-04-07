const mongoose = require('mongoose');

// Define a schema
const bookingPackageSchema = new mongoose.Schema({
    PackageName: String,
    BookedDate: Date,
    BookingTime: Date,
    PeopleCapacity: String,
    Cost: Number,
    status: String
});

// Create a model from the schema
const BookingPackage = mongoose.model('BookingPackage', bookingPackageSchema);

module.exports = BookingPackage;
