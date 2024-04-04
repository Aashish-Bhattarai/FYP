import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

function ManagePackage() {
  const [pkg, setPkg] = useState([]);
  const [refresh, setRefresh] = useState(false);

  useEffect(() => {
    axios
      .get("http://localhost:3001/ViewPackage")
      .then((result) => {
        setPkg(result.data);
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
          <h2 style={{ fontSize: '2rem', fontWeight: 'bold', margin: '0' }}>View/Edit Packages:</h2>
      </div> 
      {/* Render package cards */}
      {pkg.map((packageDetails, index) => (
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
              <div className="package-image" style={{float: 'left', width: '35%', marginLeft: '15px'}}>
              <img
                src={`http://localhost:3001/images/${packageDetails.Image}`}
                className="img-fluid mb-3"
                style={{width:'300px', height:'200px', borderRadius: '8px', marginTop: '35px' }}
              />
              </div>
              <div className="package-details" style={{float: 'right', width: '65%', marginLeft: '30px', marginTop: '15px'}}>
              <div style={{ display: "flex", alignItems: "center" }}>
                <h4 style={{ margin: "0", marginRight: "10px" }}>Package:</h4> &ensp;
                <i> <h5 style={{ margin: "0" }}>{packageDetails.PackageName}</h5> </i>
              </div>
              <br/>
              <p><b>Description:</b>&ensp; {packageDetails.Description}</p>
              <p><b>Duration:</b>&ensp; {packageDetails.Duration}</p>
              <p><b>Vehicle Name:</b>&ensp; {packageDetails.VehicleName}</p>
              <p><b>Vehicle Type:</b>&ensp; {packageDetails.VehicleType}</p>
              <p><b>Cost:</b>&ensp; {packageDetails.Cost}</p>
              </div>
              </div>
              <div className="button-container">
                <Link
                  to={`/UpdatePackage/${packageDetails._id}`}
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

export default ManagePackage;
