import React, {useState} from 'react';
import axios from 'axios';

function VehicleRentals() {
    const [VehicleName, setVehicleName] = useState();
    const [Description, setDescription] = useState();
    const [SeatingType, setSeatingType] = useState();
    const [VehicleYear, setVehicleYear] = useState();
    const [Cost, setCost] = useState();
    const [file, setFile] = useState([]);
 
const Submit = (e) => {
    e.preventDefault();

    // Check if a valid option is selected
    if (!SeatingType || SeatingType === 'default') {
        alert('Please select a valid seating configuration.');
        return; // Exit the function if the default value is selected
    }

    // console.log("successfully updated in database!!")

    const formData = new FormData();
    formData.append("VehicleName", VehicleName);
    formData.append("Description", Description);
    formData.append("SeatingType", SeatingType);
    formData.append("VehicleYear", VehicleYear);
    formData.append("Cost", Cost);
    formData.append("file", file);

    axios
      .post("http://localhost:3001/Rental",formData) 
      .then((result) => {
        console.log(result);
      })
      .catch((err) => console.log(err));
}

  return (
    <div style={{ marginBottom: '30px', marginTop: '30px'}}>
        <div style={{ backgroundColor: '#4682B4', color: '#fff', textAlign: 'center', padding: '10px', borderTopLeftRadius: '8px', borderTopRightRadius: '8px', width: '50%', margin: 'auto' }}>
          <h2 style={{ fontSize: '2rem', fontWeight: 'bold', margin: '0' }}>Add Vehicles for Rentals: </h2>
        </div> 
        <form  onSubmit={Submit} style={{ backgroundColor: '#f5f5f5', padding: '20px', borderBottomLeftRadius: '8px', borderBottomRightRadius: '8px', marginLeft: 'auto', marginRight: 'auto', width: '50%' }}>
        <div className="form-group">
          <label htmlFor="exampleFormControlInput1"><h5>Vehicle Name: </h5></label>
          <input type="text" className="form-control" id="exampleFormControlInput1" placeholder="Enter Vehicle Name Here.." onChange={(e) => setVehicleName(e.target.value)} required/>
        </div> 
        <br/>
        <div className="form-group">
          <label htmlFor="exampleFormControlTextarea1"><h5>Description: </h5></label>
          <textarea className="form-control" id="exampleFormControlTextarea1" rows="3" placeholder="Enter Vehicle Description Here.." onChange={(e) => setDescription(e.target.value)} required></textarea>
        </div> 
        <br/>
        <div className="form-group">
          <label htmlFor="exampleFormControlSelect1"><h5>Select Seating Configuration: </h5></label>
          <select className="form-control" id="exampleFormControlSelect1" onChange={(e) => setSeatingType(e.target.value)}>
            <option value="default">Select Seating Number</option>
            <option>4 Seater</option>
            <option>7 Seater</option>
          </select>
        </div>
        <br/>
        <div className="form-group">
          <label htmlFor="exampleFormControlInput4"><h5>Vehicle Model Year: </h5></label>
          <input type="number" className="form-control" id="VehicleYear" placeholder="Enter Make/Model Year of Vehicle Here.." min="2000" max={new Date().getFullYear()}  onChange={(e) => setVehicleYear(e.target.value)} required/>
        </div>
        <br/>
        <div className="form-group">
          <label htmlFor="exampleFormControlInput4"><h5>Cost Per Day: </h5></label>
          <input type="number" className="form-control" id="exampleFormControlInput1" placeholder="Enter Per Day Costing Here.." min="0" onChange={(e) => setCost(e.target.value)} required/>
        </div>
        <br/>
        <div className="form-group">
          <label htmlFor="exampleFormControlFile1"><h5>Vehicle Image: </h5></label>
          <br/><br/>
          <input type="file" className="form-control-file" id="exampleFormControlFile1" name="file" onChange={(e) => setFile(e.target.files[0])} required />

        </div>
        <br/><br/>
        <div style={{justifyContent:'center', display: 'flex'}}>
        <button type="submit" className="btn btn-primary btn-lg">Confirm</button> 
        </div>
      </form>
    </div>
  );
}

export default VehicleRentals;
 
