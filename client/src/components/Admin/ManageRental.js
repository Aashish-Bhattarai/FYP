import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

function ManageRental() {
  const [rental, setRental] = useState([]);
  const [refresh, setRefresh] = useState(false);

  useEffect(() => {
    axios
      .get("http://localhost:3001/ViewRentalVehicle")
      .then((result) => {
        setRental(result.data);
      })
      .catch((err) => console.log(err));
  }, [refresh]);

  // const handleEdit = (id) => {
  //     // Handle edit action here
  // };

  // const handleDelete = (id) => {
  //     // Handle delete action here
  // };

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
      <div style={{ backgroundColor: '#4682B4', color: '#fff', textAlign: 'center', padding: '10px', borderRadius: '8px', marginTop: '30px',width: '60%', margin: 'auto' }}>
          <h2 style={{ fontSize: '2rem', fontWeight: 'bold', margin: '0' }}>View/Edit Rental Vehicles:</h2>
      </div> 
      {/* Render package cards */}
      {rental.map((rentalDetails, index) => (
        <div
          className="card"
          key={index}
          style={{
            width: "60%",
            marginBottom: "40px",
            paddingBottom: "20px",
          }}
        >
          <div className="card-inner row">
            <div className="card-content">
              <img
                src={`http://localhost:3001/images${rentalDetails.Image}`}
                className="img-fluid mb-3"
                style={{ maxHeight: "200px" }}
              />
              <h6>Package Name: {rentalDetails.VehicleName}</h6>
              <p>Description: {rentalDetails.Description}</p>
              <p>No. of Seats: {rentalDetails.SeatingType}</p>
              <p>Vehicle Make Year: {rentalDetails.VehicleYear}</p>
              <p>Cost: {rentalDetails.Cost}</p>
              <div className="button-container">
                <Link
                  to={`/UpdateRentalVehicle/${rentalDetails._id}`}
                  type="button"
                  className="btn btn-primary me-2"
                >
                  Edit
                </Link>
                <button type="button" className="btn btn-danger">
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default ManageRental;