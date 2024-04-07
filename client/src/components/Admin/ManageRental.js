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
              <div className="details" style={{display:'flex', position:'relative', backgroundColor: '#e8e8e8', borderRadius: '5px'}}>
              <div className="rental-details" style={{float: 'left', width: '65%', marginLeft: '20px', marginTop: '15px'}}>
              <div style={{ display: "flex", alignItems: "center" }}>
              <h4 style={{ margin: "0", marginRight: "10px" }}>Vehicle Name:</h4> &ensp;
              <i> <h5 style={{ margin: "0" }}>{rentalDetails.VehicleName}</h5> </i>
              </div>
              <br/>
              <p><b>Description:</b>&ensp; {rentalDetails.Description}</p>
              <p><b>No. of Seats:</b>&ensp; {rentalDetails.SeatingType}</p>
              <p><b>Vehicle Make Year:</b>&ensp; {rentalDetails.VehicleYear}</p>
              <p><b>Cost:</b>&ensp; {rentalDetails.Cost}</p>
              </div>
              <div className="rental-image" style={{float: 'right', width: '35%',marginRight: '10px', marginTop: '15px', marginBottom: '40px'}}>
              <img
                src={`http://localhost:3001/images/${rentalDetails.Image}`}
                className="img-fluid"
                style={{width:'300px', height:'220px', borderRadius: '8px'}}
              />
              </div>
              </div>
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