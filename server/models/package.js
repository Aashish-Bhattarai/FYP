const mongoose = require ("mongoose");

const PackageSchema = new mongoose.Schema(
    {
        PackageName: String,
        Description: String,
        Duration: String,
        VehicleName: String,
        VehicleType: String,
        Cost: Number,
        Image: String,
    }
)

const PackageModel = mongoose.model("packages", PackageSchema)
module.exports = PackageModel