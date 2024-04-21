//index.js
const express = require("express");
const nodemailer = require("nodemailer");
const mongoose = require("mongoose");
const cors = require("cors");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken"); // Import JWT library
const crypto = require('crypto'); // Import the crypto module for secret key generation
const PDFDocument = require('pdfkit');
const moment = require('moment');

const multer = require('multer');
const path = require("path")


const UserModel = require('./models/user');
const PackageModel = require('./models/package')
const RentalModel = require('./models/rental')
const BookingPackage = require('./models/packageBooking')
const BookingRental = require('./models/rentalBooking')
const PickupDropModel = require('./models/pickupDropBooking')
const DriverRatingModel = require('./models/driverRating')

const app = express();
app.use(express.json());
app.use(cors());

mongoose.connect("mongodb://localhost:27017/YatraSathi");

// Generate a random secret key
const secretKey = crypto.randomBytes(32).toString('hex');
console.log('Generated Secret Key:', secretKey);

// Middleware to authenticate token
function authenticateToken(req, res, next) {
    const token = req.header('Authorization') && req.header('Authorization').split(' ')[1];
    if (!token) return res.status(401).json({ message: 'Token is missing or invalid' });

    jwt.verify(token, secretKey, (err, user) => {
        if (err) return res.status(403).json({ message: 'Access is restricted' });
        req.user = user;
        next();
    });
}

// Protected Home Route
app.get('/home', authenticateToken, (req, res) => {
    // The 'authenticateToken' middleware ensures that the request has a valid token
    // and sets the user information in the 'req.user' object
    res.json({ message: 'This is the home route', user: req.user });
});

// Protected Admin Route
app.get('/admin', authenticateToken, (req, res) => {
    // The 'authenticateToken' middleware ensures that the request has a valid token
    // and sets the user information in the 'req.user' object
    res.json({ message: 'This is the admin route', user: req.user });
});

// Sign-up route
app.post('/signup', async (req, res) => {
    const { name, email, phone, password } = req.body;

    try {
        const hashedPassword = await bcrypt.hash(password, 10); // 10 is the saltRounds
        const user = await UserModel.create({ name, email, phone, password: hashedPassword });
        res.json(user);
    } catch (err) {
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

// Login Route
app.post('/login', async (req, res) => {
    // Extract L_email and L_password from the request body
    const { L_email, L_password } = req.body;

    try {
        // Find a user in the database with the provided email
        const user = await UserModel.findOne({ email: L_email });

        if (!user) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        // Compare the entered password with the hashed password stored in the database
        const isPasswordValid = await bcrypt.compare(L_password, user.password);

        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }
        
        // User is authenticated - generate and send JWT token
        const token = jwt.sign({ id: user._id, role: user.role }, secretKey, { expiresIn: "1h"});

         // Sending the token and login success message in a single response
         res.status(200).json({ token, message: 'Login successful', user });

    } catch (error) {
        // If an error occurs during the process (e.g., a database error), log the error
        console.error(error);
        console.log("This is some error in login route of server!!")
        // Return a 500 Internal Server Error response with an error message
        res.status(500).json({ message: 'Internal Server Error' });
    }
});


//packages backend logic
const storages = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "../client/public/images"));
  },
  filename: (req, file, cb) => {
    cb(
      null,
      file.fieldname + "_" + Date.now() + path.extname(file.originalname)
    );
  },
});

const uploads = multer({
  storage: storages,
});

app.use(
  "/images",
  express.static("../client/public/images")
);

app.post("/Package", uploads.single("file"), async (req, res) => {
  try {
    if (!req.file) {
      throw new Error("No file uploaded.");
    }

    const {
      PackageName,
      Description,
      Duration,
      VehicleName,
      VehicleType,
      Cost,
      Recommended,
    } = req.body;

    const Image = req.file.filename;


    // Create a new package entry in the database
    const Package = await PackageModel.create({
      PackageName,
      Description,
      Duration,
      VehicleName,
      VehicleType,
      Cost,
      Image,
      Recommended,
    });

    res.status(201).json(Package); // Respond with the created package data
  } catch (error) {
    console.error("Error in Package Add endpoint:", error);
    res.status(400).json({ error: error.message });
  }
});

app.get("/ViewPackage", (req, res)=>{
  PackageModel.find({})
  .then((viewPackage) => res.json(viewPackage))
  .catch((err) => res.json(err));
})

app.get("/ViewPackage/:id", (req, res)=>{
  const id= req.params.id;
  PackageModel.findById({_id: id})
  .then((viewPackage) => res.json(viewPackage))
  .catch((err) => res.json(err));
})

app.put("/UpdatePackage/:id", (req, res) => {
const id = req.params.id;
PackageModel.findByIdAndUpdate(
  { _id: id },
  {
    PackageName: req.body.PackageName,
    Description: req.body.Description,
    Duration: req.body.Duration,
    VehicleName: req.body.VehicleName,
    VehicleType: req.body.VehicleType,
    Cost: req.body.Cost,
    Image: req.body.Image,
    Recommended: req.body.Recommended,
  }
)
  .then((UpdatePackage) => res.json(UpdatePackage))
  .catch((err) => res.json(err));
});

// app.put("/UpdatePackageImg/:id", upload.single("image"), (req, res) => {
//   const id = req.params.id;
//   const imagePath = req.file.filename;

//   PackageModel.findByIdAndUpdate(
//     { _id: id },
//     { image: imagePath },
//     { new: true }
//   )
//     .then((updatedPackage) => res.json(updatedPackage))
//     .catch((err) => res.status(500).json({ error: err }));
// });


// Defining route to fetch user details based on userId when a user books any service
app.get('/users/getUser/:userId', async (req, res) => {
  try {
      const userId = req.params.userId;
      const user = await UserModel.findById(userId);
      res.status(200).json(user);
  } catch (error) {
      console.error('Error fetching user details:', error);
      res.status(500).json({ error: 'An error occurred while fetching user details' });
  }
});


// Package Booking Back-End 
app.post('/BookPackage', async (req, res) => {
  try {
      const { PackageName, BookedDate, BookingTime, PeopleCapacity, Cost, status, userId, userName, userEmail, userPhone } = req.body;

      // Create a new BookingPackage instance and save it to the database
      const booking = await BookingPackage.create({
          PackageName,
          BookedDate,
          BookingTime,
          PeopleCapacity,
          Cost,
          status,
          userId,
          userName, 
          userEmail, 
          userPhone
      });

      console.log('Booking saved successfully:', booking);
      res.status(200).json({ message: 'Booking saved successfully', booking });
  } catch (err) {
      console.error('Error saving booking:', err);
      res.status(500).json({ error: 'An error occurred while saving the booking' });
  }
});

app.get("/ViewPackageRequest", (req, res)=>{
  BookingPackage.find({})
  .then((viewPackageRequest) => res.json(viewPackageRequest))
  .catch((err) => res.json(err));
})

// Update the status of a Package Booking by ID
app.put("/UpdatePackageBookingStatus/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const { status } = req.body;

    const updatedBooking = await BookingPackage.findByIdAndUpdate(id, { status });

    if (!updatedBooking) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    res.json(updatedBooking);
  } catch (error) {
    console.error('Error updating booking status:', error);
    res.status(500).json({ error: 'An error occurred while updating booking status' });
  }
});

// app.put("/UpdatePackage/:id", (req, res) => {
//   const id = req.params.id;
//   PackageModel.findByIdAndUpdate(
//     { _id: id },
//     {
//       PackageName: req.body.PackageName,
//       Description: req.body.Description,
//       Duration: req.body.Duration,
//       VehicleName: req.body.VehicleName,
//       VehicleType: req.body.VehicleType,
//       Cost: req.body.Cost,
//       Image: req.body.Image,
//       Recommended: req.body.Recommended,
//     }
//   )
//     .then((UpdatePackage) => res.json(UpdatePackage))
//     .catch((err) => res.json(err));
//   });

//rentals backend logic
const rentalstorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "../client/public/images"));
  },
  filename: (req, file, cb) => {
    cb(
      null,
      file.fieldname + "_" + Date.now() + path.extname(file.originalname)
    );
  },
});

const rentalupload = multer({
  storage: rentalstorage,
});

app.use(
  "/images",
  express.static("../client/public/images")
);

app.post("/Rental", rentalupload.single("file"), async (req, res) => {
  try {
    if (!req.file) {
      throw new Error("No file uploaded.");
    }

    const {
      VehicleName,
      Description,
      SeatingType,
      VehicleYear,
      Cost,
    } = req.body;

    const Image = req.file.filename;


    // Create a new vehicle entry in the database
    const Rental = await RentalModel.create({
      VehicleName,
      Description,
      SeatingType,
      VehicleYear,
      Cost,
      Image,
    });

    res.status(201).json(Rental); // Respond with the created vehicle data
  } catch (error) {
    console.error("Error in Package Add endpoint:", error);
    res.status(400).json({ error: error.message });
  }
});


app.get("/ViewRentalVehicle", (req, res)=>{
  RentalModel.find({})
  .then((ViewRentalVehicle) => res.json(ViewRentalVehicle))
  .catch((err) => res.json(err));
})

app.get("/ViewRentalVehicle/:id", (req, res)=>{
  const id= req.params.id;
  RentalModel.findById({_id: id})
  .then((ViewRentalVehicle) => res.json(ViewRentalVehicle))
  .catch((err) => res.json(err));
})

app.put("/UpdateRentalVehicle/:id", (req, res) => {
  const id = req.params.id;
  RentalModel.findByIdAndUpdate(
    { _id: id },
    {
      VehicleName: req.body.VehicleName,
      Description: req.body.Description,
      SeatingType: req.body.SeatingType,
      VehicleYear: req.body.VehicleYear,
      Cost: req.body.Cost,
      Image: req.body.Image,
    }
  )
    .then((UpdateRentalVehicle) => res.json(UpdateRentalVehicle))
    .catch((err) => res.json(err));
});

app.post('/BookRental', async (req, res) => {
  try {
      const { VehicleName, BookedDate, BookingTime, RentedDays, SeatingType, VehicleYear, CostTotal, status, userId, userName, userEmail, userPhone } = req.body;

      // Create a new BookingPackage instance and save it to the database
      const bookingRental = await BookingRental.create({
          VehicleName,
          BookedDate,
          BookingTime,
          RentedDays,
          SeatingType,
          VehicleYear, 
          CostTotal,
          status,
          userId,
          userName,
          userEmail,
          userPhone
      });

      console.log('Booking saved successfully:', bookingRental);
      res.status(200).json({ message: 'Booking saved successfully', bookingRental });
  } catch (err) {
      console.error('Error saving booking:', err);
      res.status(500).json({ error: 'An error occurred while saving the booking' });
  }
});

app.get("/ViewBookedVehicles", async (req, res) => {
  try {
    const currentDate = new Date();
    const bookedVehicles = await BookingRental.find({});
    const filteredBookedVehicles = bookedVehicles.map(vehicle => ({
      VehicleName: vehicle.VehicleName,
      BookedDate: vehicle.BookedDate,
      BookingEndDate: new Date(vehicle.BookedDate.getTime() + (vehicle.RentedDays + 1) * 24 * 60 * 60 * 1000), // Calculate booking end date with maintenance day
      status: vehicle.status
    })).filter(vehicle => currentDate < vehicle.BookingEndDate); // Filter out vehicles whose booking has not expired
    res.json(filteredBookedVehicles);
  } catch (error) {
    console.error('Error fetching booked vehicles:', error);
    res.status(500).json({ error: 'An error occurred while fetching booked vehicles' });
  }
});

app.get("/ViewRentalRequest", (req, res)=>{
  BookingRental.find({})
  .then((viewRentalRequest) => res.json(viewRentalRequest))
  .catch((err) => res.json(err));
})

// Update the status of a Package Booking by ID
app.put("/UpdateRentalBookingStatus/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const { status } = req.body;

    const updatedBooking = await BookingRental.findByIdAndUpdate(id, { status });

    if (!updatedBooking) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    res.json(updatedBooking);
  } catch (error) {
    console.error('Error updating booking status:', error);
    res.status(500).json({ error: 'An error occurred while updating booking status' });
  }
});

//Pickup and Drop Backend Logic
app.post('/BookPickupDrop', async (req, res) => {
  try {
    const { BookedDateAndTime, BookingTime, PickupLocation, DropLocation, Distance, Cost, userId, userName, userEmail, userPhone, status, IsCompleted } = req.body;

    // Create a new PickupDrop instance and save it to the database
    const pickupDrop = await PickupDropModel.create({
      BookedDateAndTime,
      BookingTime,
      PickupLocation,
      DropLocation,
      Distance,
      Cost,
      userId,
      userName,
      userEmail,
      userPhone,
      status,
      IsCompleted
    });

    console.log('Pickup and Drop Booking saved successfully:', pickupDrop);
    res.status(200).json({ message: 'Pickup and Drop Booking saved successfully', pickupDrop });
  } catch (err) {
    console.error('Error saving Pickup and Drop booking:', err);
    res.status(500).json({ error: 'An error occurred while saving the Pickup and Drop booking' });
  }
});


//Driver Side
// Endpoint to fetch pickup and drop requests with status 'Pending'
app.get('/pickup-drop-requests', async (req, res) => {
  try {
    const request = await PickupDropModel.find({ status: 'Pending' });
    res.status(200).json(request);
  } catch (error) {
    console.error('Error fetching pickup and drop requests:', error);
    res.status(500).json({ error: 'An error occurred while fetching pickup and drop requests' });
  }
});


//Endpoint to populate the PickupDropModel with Driver Info
app.post('/accepted-pickup-drop-request/:id', async (req, res) => {
  try {
    const requestId = req.params.id;
    const { DriverId, DriverName, DriverPhone } = req.body;

    // Find the request by ID and update the fields
    const updatedRequest = await PickupDropModel.findByIdAndUpdate(
      requestId,
      {
        $set: {
          DriverId,
          DriverName,
          DriverPhone,
          status: 'Accepted'
        }
      },
      { new: true }
    );

    // Send the updated request as response
    res.json(updatedRequest);
  } catch (error) {
    console.error('Error accepting pickup-drop request:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Get driver requests by driver id
app.get('/driver-requests/:driverId', async (req, res) => {
  try {
    const driverId = req.params.driverId;
    const driverRequests = await PickupDropModel.find({ DriverId: driverId });
    res.json(driverRequests);
  } catch (error) {
    console.error('Error fetching driver requests:', error);
    res.status(500).json({ error: 'An error occurred while fetching driver requests' });
  }
});

// Mark a Pickup Drop Request as complete
app.put('/driver-requests/:requestId', async (req, res) => {
  try {
    const requestId = req.params.requestId;
    const { IsCompleted } = req.body;

    // Find the request by ID and update the IsCompleted field
    const updatedRequest = await PickupDropModel.findByIdAndUpdate(
      requestId,
      { $set: { IsCompleted: IsCompleted } },
      { new: true }
    );

    res.json(updatedRequest);
  } catch (error) {
    console.error('Error marking request as complete:', error);
    res.status(500).json({ error: 'An error occurred while marking request as complete' });
  }
});

// user specific profile with profile edit and change password endpoints
app.get("/userprofile/:id", (req, res) => {
  const id = req.params.id;
  UserModel.findById(id) // Use id directly, as it represents the user's ID
    .then((userprofile) => res.json(userprofile))
    .catch((err) => res.json(err));
});

// Update user profile
app.put("/userprofile/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const updatedUserData = req.body;

    const updatedUser = await UserModel.findByIdAndUpdate(id, updatedUserData, { new: true });
    res.json(updatedUser);
  } catch (err) {
    res.status(500).json({ message: "Error updating user profile", error: err });
  }
});

// Check if current password matches
app.post("/userprofile/:id/checkpassword", async (req, res) => {
  try {
    const id = req.params.id;
    const { password } = req.body;

    const user = await UserModel.findById(id);
    const isValidPassword = await bcrypt.compare(password, user.password);

    res.json({ isValid: isValidPassword });
  } catch (err) {
    res.status(500).json({ isValid: false, message: "Error checking password", error: err });
  }
});

// Change user password
app.put("/userprofile/:id/changepassword", async (req, res) => {
  try {
    const id = req.params.id;
    const { newPassword } = req.body;

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await UserModel.findByIdAndUpdate(id, { password: hashedPassword });

    res.json({ message: "Password updated successfully" });
  } catch (err) {
    res.status(500).json({ message: "Error updating password", error: err });
  }
});


// app.post('/signup', async (req, res) => {
//   const { name, email, phone, password } = req.body;

//   try {
//       const hashedPassword = await bcrypt.hash(password, 10); // 10 is the saltRounds
//       const user = await UserModel.create({ name, email, phone, password: hashedPassword });
//       res.json(user);
//   } catch (err) {
//       res.status(500).json({ message: 'Internal Server Error' });
//   }
// });

// User History

//user package service history

app.get("/UserPackageHistory/:userId", (req, res) => {
  const userId = req.params.userId;
  BookingPackage.find({ userId }) // Find all bookings with the specified userId
    .then((UserPackageHistory) => res.json(UserPackageHistory))
    .catch((err) => res.json(err));
});

//user rental service history

app.get("/UserRentalHistory/:userId", (req, res) => {
  const userId = req.params.userId;
  BookingRental.find({ userId }) // Find all bookings with the specified userId
    .then((UserRentalHistory) => res.json(UserRentalHistory))
    .catch((err) => res.json(err));
});

app.get("/UserPickupDropHistory/:userId", (req,res) => {
  const  userId = req.params.userId;
  PickupDropModel.find({ userId}) //Find all pickup drop requests with the specified userId
    .then((UserPickupDropHistory) => res.json(UserPickupDropHistory))
    .catch((err) => res.json(err));
})

// Route to submit driver rating
app.post('/submitDriverRating', async (req, res) => {
  try {
    // Extract data from request body
    const { userId, userName, driverId, driverName, rating, date, PickupDropId } = req.body;

    // Create new driver rating document
    const driverRating = new DriverRatingModel({
      DriverName: driverName,
      DriverId: driverId,
      userName: userName,
      userID: userId,
      Rating: rating,
      BookedDate: date,
      PickupDropId: PickupDropId // Associate the rating with the corresponding PickupDropModel document
    });

    // Save the driver rating document to the database
    await driverRating.save();

    // Respond with success message
    res.status(200).json({ message: 'Rating submitted successfully' });
  } catch (error) {
    // Respond with error message
    res.status(500).json({ error: 'Error submitting rating' });
  }
});

// Route to fetch data from the DriverRatingModel
app.get('/driver-ratings', async (req, res) => {
  try {
    const ratings = await DriverRatingModel.find();
    res.json(ratings); // Send the ratings as JSON response
  } catch (error) {
    console.error('Error fetching driver ratings:', error);
    res.status(500).json({ error: 'Internal server error' }); 
  }
});

// Define a route to send emails
app.post('/sendEmail', (req, res) => {
  const { recipient, subject, body } = req.body;

  // Create a transporter object using nodemailer
  const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
          user: 'bhattaraiaashish100@gmail.com',
          pass: 'kqde bnmo daxm bjhh'
      }
  });

  // Define the mail options
  const mailOptions = {
      from: 'bhattaraiaashish100@gmail.com',
      to: recipient, // Get recipient email address from the request body
      subject: subject,
      text: body
  };

  // Send the email
  transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
          console.error('Error sending email:', error);
          res.status(500).json({ message: 'Error sending email' });
      } else {
          console.log('Email sent:', info.response);
          res.status(200).json({ message: 'Email sent successfully' });
      }
  });
});

//Forgot Password Backend Logic
app.post('/forgot-password', (req,res)=> {
  const {email} = req.body;
  UserModel.findOne({email:email})
  .then(user => {
    if(!user) {
      return res.send({Status: "User doesn't exist"})
    }
    const token  = jwt.sign({id: user._id}, secretKey, {expiresIn: "1d"} )
    const encodedToken = encodeURIComponent(token);
    const resetPasswordURL = `http://localhost:3000/reset-password/${user._id}/${encodedToken}`;

      // Create a transporter object using nodemailer
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'bhattaraiaashish100@gmail.com',
            pass: 'kqde bnmo daxm bjhh'
        }
      });

      // Define the mail options
      const mailOptions = {
          from: 'bhattaraiaashish100@gmail.com',
          to: email, 
          subject: 'Reset Your Password',
          text: resetPasswordURL
      };

      // Send the email
      transporter.sendMail(mailOptions, (error, info) => {
          if (error) {
              console.error('Error sending email:', error);
              res.status(500).json({ message: 'Error sending email' });
          } else {
              console.log('Email sent:', info.response);
              res.status(200).json({ message: 'Email sent successfully' });
          }
      });

    })
})

//reset password backend logic
app.post('/reset-password/:id/:token', (req, res) => {
  const {id, token} = req.params;
  const {newPassword} = req.body;

  jwt.verify(token, secretKey, (err, decoded) => {
    if (err) {
      return res.json ({Status: "Error with Token"})
    } else {
      bcrypt.hash(newPassword, 10)
      .then(hash =>{
        UserModel.findByIdAndUpdate({_id:id}, {password: hash})
        .then (u => res.send({Status: "success"}))
        .catch(err => res.send({Status: err}))
      })
    }
  })
})


//Admin Dashboard

//fetch the number of users
app.get('/users', async (req, res) => {
  try {
      const users = await UserModel.countDocuments();
      res.json({ totalUsers: users });
  } catch (error) {
      console.error('Error fetching users:', error);
      res.status(500).json({ error: 'Server error' });
  }
});

//fetch the number of drivers
app.get('/drivers', async (req, res) => {
  try {
      const drivers = await UserModel.countDocuments({ role: 'driver' });
      res.json({ totalDrivers: drivers });
  } catch (error) {
      console.error('Error fetching drivers:', error);
      res.status(500).json({ error: 'Server error' });
  }
});

//fetch total earnings
app.get('/earnings', async (req, res) => {
  try {
      const bookings = await Promise.all([
          BookingPackage.find({ status: 'Accepted' }).select('Cost'),
          PickupDropModel.find({ status: 'Accepted' }).select('Cost'),
          BookingRental.find({ status: 'Accepted' }).select('CostTotal')
      ]);

      const totalEarnings = bookings.flat().reduce((acc, booking) => acc + (booking.Cost || booking.CostTotal), 0);
      res.json({ totalEarnings });
  } catch (error) {
      console.error('Error fetching total earnings:', error);
      res.status(500).json({ error: 'Server error' });
  }
});

// Route to fetch total number of services
app.get('/services', async (req, res) => {
  try {
      // Fetch total number of all services
      const totalPickupDropServices = await PickupDropModel.countDocuments();
      const totalRentalServices = await BookingRental.countDocuments();
      const totalPackageServices = await BookingPackage.countDocuments();

      // Fetch total number of pending services
      const totalPendingPickupDropServices = await PickupDropModel.countDocuments({ status: 'Pending' });
      const totalPendingRentalServices = await BookingRental.countDocuments({ status: 'Pending' });
      const totalPendingPackageServices = await BookingPackage.countDocuments({ status: 'Pending' });

      // Fetch total number of accepted services
      const totalAcceptedPickupDropServices = await PickupDropModel.countDocuments({ status: 'Accepted' });
      const totalAcceptedRentalServices = await BookingRental.countDocuments({ status: 'Accepted' });
      const totalAcceptedPackageServices = await BookingPackage.countDocuments({ status: 'Accepted' });

      res.json({
          totalPickupDropServices,
          totalRentalServices,
          totalPackageServices,
          totalPendingPickupDropServices,
          totalPendingRentalServices,
          totalPendingPackageServices,
          totalAcceptedPickupDropServices,
          totalAcceptedRentalServices,
          totalAcceptedPackageServices
      });
  } catch (error) {
      console.error('Error fetching total services:', error);
      res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Endpoint to fetch average ratings for drivers
app.get('/driver-ratings', async (req, res) => {
  try {
    // Aggregate to calculate average ratings for each driver
    const averageRatings = await DriverRatingModel.aggregate([
      {
        $group: {
          _id: '$DriverId',
          averageRating: { $avg: '$Rating' }
        }
      }
    ]);

    res.status(200).json({ averageRatings });
  } catch (error) {
    console.error('Error fetching average driver ratings:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Endpoint to remove a driver
app.delete('/remove-driver/:driverId', async (req, res) => {
  const driverId = req.params.driverId;

  try {
      // Remove the driver from the UserModel based on the driverId
      await UserModel.deleteOne({ _id: driverId });

      // Respond with success message
      res.status(200).json({ message: 'Driver removed successfully' });
  } catch (error) {
      console.error('Error removing driver:', error);
      res.status(500).json({ error: 'Internal server error' });
  }
});


// Download report for a month
app.get('/reports/:month', async (req, res) => {
  try {
    const { month } = req.params;

    // Parse the month parameter to ensure it's a valid number
    const monthNumber = parseInt(month);

    // Check if the provided month is a valid number between 1 and 12
    if (isNaN(monthNumber) || monthNumber < 1 || monthNumber > 12) {
      return res.status(400).json({ error: 'Invalid month' });
    }

    // Extract the year from the current date
    const currentYear = new Date().getFullYear();

    // Calculate the start and end dates of the specified month
    const startDate = moment({ year: currentYear, month: monthNumber - 1 });
    const endDate = startDate.clone().endOf('month');

    // Fetch data from the database for each service type
    const [bookingPackages, pickupDropServices, bookingRentals] = await Promise.all([
      BookingPackage.find({
        BookedDate: {
          $gte: startDate.toDate(),
          $lte: endDate.toDate()
        }
      }),
      PickupDropModel.find({
        BookedDateAndTime: {
          $gte: startDate.toDate(),
          $lte: endDate.toDate()
        }
      }),
      BookingRental.find({
        BookedDate: {
          $gte: startDate.toDate(),
          $lte: endDate.toDate()
        }
      })
    ]);

    // Calculate total earnings
    const totalEarnings = bookingPackages
      .concat(pickupDropServices)
      .concat(bookingRentals)
      .filter(service => service.status === 'Accepted')
      .reduce((total, service) => total + parseFloat(service.Cost || service.CostTotal), 0);

    // Calculate the most popular service (service with the most bookings)
    const serviceCounts = {
      'PickupDrop': pickupDropServices.filter(service => service.status === 'Accepted').length,
      'Rental': bookingRentals.filter(service => service.status === 'Accepted').length,
      'Package': bookingPackages.filter(service => service.status === 'Accepted').length
    };
    const mostPopularService = Object.keys(serviceCounts).reduce((maxService, service) => serviceCounts[service] > (serviceCounts[maxService] || 0) ? service : maxService, '');

    // Calculate the most booked vehicle in rental services
    const vehicleCounts = {};
    bookingRentals
      .filter(service => service.status === 'Accepted')
      .forEach(service => {
        const vehicle = service.VehicleName || 'Unknown';
        vehicleCounts[vehicle] = (vehicleCounts[vehicle] || 0) + 1;
      });
    const mostBookedVehicle = Object.keys(vehicleCounts).reduce((maxVehicle, vehicle) => vehicleCounts[vehicle] > (vehicleCounts[maxVehicle] || 0) ? vehicle : maxVehicle, '');

    // Calculate the most booked package
    const packageCounts = {};
    bookingPackages
      .filter(service => service.status === 'Accepted')
      .forEach(service => {
        const packageName = service.PackageName || 'Unknown';
        packageCounts[packageName] = (packageCounts[packageName] || 0) + 1;
      });
    const mostBookedPackage = Object.keys(packageCounts).reduce((maxPackage, packageName) => packageCounts[packageName] > (packageCounts[maxPackage] || 0) ? packageName : maxPackage, '');

    // Fetch driver ratings for pickup drop services in the specified month
    const driverRatings = await DriverRatingModel.aggregate([
      {
        $match: {
          BookedDate: {
            $gte: startDate.toDate(),
            $lte: endDate.toDate()
          }
        }
      },
      {
        $group: {
          _id: '$DriverId',
          averageRating: { $avg: '$Rating' }
        }
      },
      { $sort: { averageRating: -1 } }
    ]);

    // Find the highest average rating
    const highestAverageRating = driverRatings.length > 0 ? driverRatings[0].averageRating : null;

    // Find all drivers with the highest average rating
    const topRatedDrivers = driverRatings.filter(driver => driver.averageRating === highestAverageRating).map(driver => driver._id);

    // Fetch details of the top-rated drivers
    const mostRatedDrivers = await DriverRatingModel.find({ DriverId: { $in: topRatedDrivers } });

    res.json({
      totalEarnings,
      mostPopularService,
      mostBookedVehicle,
      mostBookedPackage,
      mostRatedDrivers
    });

  } catch (error) {
    console.error('Error generating report:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});





// setting port for the server
app.listen(3001, () => {
  console.log("Server is Running!!");
});