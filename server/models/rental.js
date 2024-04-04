const mongoose = require ("mongoose");

const PackageSchema = new mongoose.Schema(
    {
        VehicleName: String,
        Description: String,
        SeatingType: String,
        VehicleYear: Number,
        Cost: Number,
        Image: String,
    }
)

const RentalModel = mongoose.model("rentals", PackageSchema)
module.exports = RentalModel
