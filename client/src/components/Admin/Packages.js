import React, {useState} from 'react';
import axios from 'axios';

function Packages() {
    const [PackageName, setPackageName] = useState();
    const [Description, setDescription] = useState();
    const [Duration, setDuration] = useState();
    const [VehicleName, setVehicleName] = useState();
    const [VehicleType, setVehicleType] = useState();
    const [Cost, setCost] = useState();
    const [file, setFile] = useState([]);
 
const Submit = (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("PackageName", PackageName);
    formData.append("Description", Description);
    formData.append("Duration", Duration);
    formData.append("VehicleName", VehicleName);
    formData.append("VehicleType", VehicleType);
    formData.append("Cost", Cost);
    formData.append("file", file);

    axios
      .post("http://localhost:3001/Package",formData) 
      .then((result) => {
        console.log(result);
      })
      .catch((err) => console.log(err));
}

  return (
    <div>
      <form  onSubmit={Submit} style={{ backgroundColor: '#f5f5f5', padding: '20px', borderRadius: '8px', marginTop: '20px', marginLeft: 'auto', marginRight: 'auto', width: '50%' }}>
        <div className="form-group">
          <label htmlFor="exampleFormControlInput1"><h5>Package Name: </h5></label>
          <input type="text" className="form-control" id="exampleFormControlInput1" placeholder="Enter Package Name Here.." onChange={(e) => setPackageName(e.target.value)}/>
        </div> 
        <br/>
        <div className="form-group">
          <label htmlFor="exampleFormControlTextarea1"><h5>Description: </h5></label>
          <textarea className="form-control" id="exampleFormControlTextarea1" rows="3" placeholder="Enter Package Description Here.." onChange={(e) => setDescription(e.target.value)}></textarea>
        </div> 
        <br/>
        <div className="form-group">
          <label htmlFor="exampleFormControlInput3"><h5>Duration: </h5></label>
          <input type="text" className="form-control" id="exampleFormControlInput1" placeholder="Enter No. of Days for Travel Here.." onChange={(e) => setDuration(e.target.value)} />
        </div>
        <br/>
        <div className="form-group">
          <label htmlFor="exampleFormControlInput4"><h5>Vehicle Name: </h5></label>
          <input type="text" className="form-control" id="exampleFormControlInput1" placeholder="Enter Name of Vehicle Here.." onChange={(e) => setVehicleName(e.target.value)}/>
        </div>
        <br/>
        <div className="form-group">
          <label htmlFor="exampleFormControlSelect1"><h5>Select Seating Type </h5></label>
          <select className="form-control" id="exampleFormControlSelect1" onChange={(e) => setVehicleType(e.target.value)}>
            <option defaultValue>Select no of Seats: </option>
            <option>4 Seater</option>
            <option>7 Seater</option>
            <option>9 Seater</option>
            <option>12 Seater</option>
          </select>
        </div>
        <br/>
        <div className="form-group">
          <label htmlFor="exampleFormControlInput4"><h5>Cost: </h5></label>
          <input type="number" className="form-control" id="exampleFormControlInput1" placeholder="Enter Specific Package Costing Here.." onChange={(e) => setCost(e.target.value)}/>
        </div>
        <br/>
        <div className="form-group">
          <label htmlFor="exampleFormControlFile1"><h5>Package's Reference Image: </h5></label>
          <br/><br/>
          {/* <input type="file" className="form-control-file" id="exampleFormControlFile1" name='file' onChange={(e) => setFile(e.target.files[0])} /> */}
          <input type="file" className="form-control-file" id="exampleFormControlFile1" name="file" onChange={(e) => setFile(e.target.files[0])} />

        </div>
        <br/><br/>
        <div style={{justifyContent:'center', display: 'flex'}}>
        <button type="submit" class="btn btn-primary btn-lg">Confirm</button> 
        </div>
      </form>
    </div>
  );
}

export default Packages;
 