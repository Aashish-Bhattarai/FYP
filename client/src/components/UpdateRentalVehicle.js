import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

function UpdateRentalVehicle() {
  const { id } = useParams();
  const [VehicleName, setVehicleName] = useState();
  const [Description, setDescription] = useState();
  const [SeatingType, setSeatingType] = useState();
  const [VehicleYear, setVehicleYear] = useState();
  const [Cost, setCost] = useState();

  // const [file, setFile] = useState([]);
  const navigate = useNavigate();
  const [refresh, setRefresh] = useState(false);

  useEffect(() => {
    axios
      .get("http://localhost:3001/ViewRentalVehicle/" + id)
      .then((result) => {
        console.log("hey", result);
        setVehicleName(result.data.VehicleName);
        setDescription(result.data.Description);
        setSeatingType(result.data.SeatingType);
        setVehicleYear(result.data.VehicleYear);
        setCost(result.data.Cost);
      })
      .catch((err) => console.log(err));
  }, [id]);

  const Update = (e) => {
    e.preventDefault();
    axios
      .put("http://localhost:3001/UpdateRentalVehicle/" + id, {
        VehicleName,
        Description,
        SeatingType,
        VehicleYear,
        Cost,
      })
      .then((result) => {
        console.log(result);
        navigate("/AdminManageRental"); // Providing the absolute path
      })
      .catch((err) => console.log(err));
  };
  return (
    <div style={{ backgroundColor: 'rgba(0, 0, 0, 0.1)', backdropFilter: 'blur(8px)', padding: '20px', borderRadius: '8px', height: '100vh'}}>
      <div style={{ backgroundColor: '#4682B4', color: '#fff', textAlign: 'center', padding: '10px', borderTopLeftRadius: '8px', borderTopRightRadius: '8px', width: '50%', margin: 'auto', marginTop: '50px' }}>
          <h2 style={{ fontSize: '2rem', fontWeight: 'bold', margin: '0' }}>Edit Package: </h2>
      </div> 
      <form  onSubmit={Update} style={{ backgroundColor: '#f5f5f5', padding: '20px', borderBottomLeftRadius: '8px', borderBottomRightRadius: '8px', marginLeft: 'auto', marginRight: 'auto', width: '50%' }}>
        <div className="form-group">
          <label htmlFor="exampleFormControlInput1"><h5>Vehicle Name: </h5></label>
          <input type="text" className="form-control" id="exampleFormControlInput1" placeholder="Enter Vehicle Name Here.." value={VehicleName} onChange={(e) => setVehicleName(e.target.value)} required/>
        </div> 
        <br/>
        <div className="form-group">
          <label htmlFor="exampleFormControlTextarea1"><h5>Description: </h5></label>
          <textarea className="form-control" id="exampleFormControlTextarea1" rows="3" placeholder="Enter Vehicle Description Here.." value={Description} onChange={(e) => setDescription(e.target.value)} required></textarea>
        </div> 
        <br/>
        <div className="form-group">
          <label htmlFor="exampleFormControlSelect1"><h5>Select Seating Configuration: </h5></label>
          <select className="form-control" id="exampleFormControlSelect1" value={SeatingType} onChange={(e) => setSeatingType(e.target.value)}>
            <option value="default">Select Seating Number</option>
            <option>4 Seater</option>
            <option>7 Seater</option>
          </select>
        </div>
        <br/>
        <div className="form-group">
          <label htmlFor="exampleFormControlInput4"><h5>Vehicle Model Year: </h5></label>
          <input type="number" className="form-control" id="VehicleYear" placeholder="Enter Make/Model Year of Vehicle Here.." min="2000" max={new Date().getFullYear()} value={VehicleYear}  onChange={(e) => setVehicleYear(e.target.value)} required/>
        </div>
        <br/>
        <div className="form-group">
          <label htmlFor="exampleFormControlInput4"><h5>Cost Per Day: </h5></label>
          <input type="number" className="form-control" id="exampleFormControlInput1" placeholder="Enter Per Day Costing Here.." min="0" value={Cost} onChange={(e) => setCost(e.target.value)} required/>
        </div>
        <br/>
        <br/>
        <div style={{ justifyContent: "center", display: "flex", marginTop: "20px" }}>
          <button type="submit" class="btn btn-primary btn-lg">
            Confirm
          </button>
        </div>
      </form>
    </div>
  );
}

export default UpdateRentalVehicle;
