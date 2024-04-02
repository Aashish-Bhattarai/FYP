//index.js
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken"); // Import JWT library
const crypto = require('crypto'); // Import the crypto module for secret key generation

const multer = require('multer');
const path = require("path")


const UserModel = require('./models/user');
const PackageModel = require('./models/package')
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
        const token = jwt.sign({ id: user._id, role: user.role }, secretKey, { expiresIn: '1h' });

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
      } = req.body;
  
      const Image = req.file.filename;
  
  
      // Create a new hostel entry in the database
      const Package = await PackageModel.create({
        PackageName,
        Description,
        Duration,
        VehicleName,
        VehicleType,
        Cost,
        Image,
      });
  
      res.status(201).json(Package); // Respond with the created hostel data
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
app.listen(3001, () => {
  console.log("Server is Running!!");
});