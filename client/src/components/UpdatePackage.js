import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

function UpdatePackage() {
  const { id } = useParams();
  const [PackageName, setPackageName] = useState();
  const [Description, setDescription] = useState();
  const [Duration, setDuration] = useState();
  const [VehicleName, setVehicleName] = useState();
  const [VehicleType, setVehicleType] = useState();
  const [Cost, setCost] = useState();
  const [Recommended, setRecommended] = useState();

  // const [file, setFile] = useState([]);
  const navigate = useNavigate();
  const [refresh, setRefresh] = useState(false);

  useEffect(() => {
    axios
      .get("http://localhost:3001/ViewPackage/" + id)
      .then((result) => {
        console.log("hey", result);
        setPackageName(result.data.PackageName);
        setDescription(result.data.Description);
        setDuration(result.data.Duration);
        setVehicleName(result.data.VehicleName);
        setVehicleType(result.data.VehicleType);
        setCost(result.data.Cost);
        setRecommended(result.data.Recommended);
      })
      .catch((err) => console.log(err));
  }, [id]);

  const Update = (e) => {
    e.preventDefault();
    axios
      .put("http://localhost:3001/UpdatePackage/" + id, {
        PackageName,
        Description,
        Duration,
        VehicleName,
        VehicleType,
        Cost,
        Recommended,
      })
      .then((result) => {
        console.log(result);
        navigate("/AdminManagePackage"); // Providing the absolute path
      })
      .catch((err) => console.log(err));
  };
  return (
    <div
      style={{
        backgroundColor: "rgba(0, 0, 0, 0.1)",
        backdropFilter: "blur(8px)",
        padding: "20px",
        borderRadius: "8px",
        height: "100vh",
      }}
    >
      <div
        style={{
          backgroundColor: "#4682B4",
          color: "#fff",
          textAlign: "center",
          padding: "10px",
          borderTopLeftRadius: "8px",
          borderTopRightRadius: "8px",
          width: "50%",
          margin: "auto",
          marginTop: "50px",
        }}
      >
        <h2 style={{ fontSize: "2rem", fontWeight: "bold", margin: "0" }}>
          Edit Package:{" "}
        </h2>
      </div>
      <form
        onSubmit={Update}
        style={{
          backgroundColor: "#f5f5f5",
          padding: "20px",
          borderBottomLeftRadius: "8px",
          borderBottomRightRadius: "8px",
          marginLeft: "auto",
          marginRight: "auto",
          width: "50%",
        }}
      >
        <div className="form-group">
          <label htmlFor="exampleFormControlInput1">
            <h5>Package Name: </h5>
          </label>
          <input
            type="text"
            className="form-control"
            id="exampleFormControlInput1"
            placeholder="Enter Package Name Here.."
            value={PackageName}
            onChange={(e) => setPackageName(e.target.value)}
          />
        </div>
        <br />
        <div className="form-group">
          <label htmlFor="exampleFormControlTextarea1">
            <h5>Description: </h5>
          </label>
          <textarea
            className="form-control"
            id="exampleFormControlTextarea1"
            rows="3"
            placeholder="Enter Package Description Here.."
            value={Description}
            onChange={(e) => setDescription(e.target.value)}
          ></textarea>
        </div>
        <br />
        <div className="form-group">
          <label htmlFor="exampleFormControlInput3">
            <h5>Duration: </h5>
          </label>
          <input
            type="text"
            className="form-control"
            id="exampleFormControlInput1"
            placeholder="Enter No. of Days for Travel Here.."
            value={Duration}
            onChange={(e) => setDuration(e.target.value)}
          />
        </div>
        <br />
        <div className="form-group">
          <label htmlFor="exampleFormControlInput4">
            <h5>Vehicle Name: </h5>
          </label>
          <input
            type="text"
            className="form-control"
            id="exampleFormControlInput1"
            placeholder="Enter Name of Vehicle Here.."
            value={VehicleName}
            onChange={(e) => setVehicleName(e.target.value)}
          />
        </div>
        <br />
        <div className="form-group">
          <label htmlFor="exampleFormControlSelect1">
            <h5>Select Seating Type </h5>
          </label>
          <select
            className="form-control"
            id="exampleFormControlSelect1"
            value={VehicleType}
            onChange={(e) => setVehicleType(e.target.value)}
          >
            <option defaultValue>Select no of Seats: </option>
            <option>4 Seater</option>
            <option>7 Seater</option>
            <option>9 Seater</option>
            <option>12 Seater</option>
          </select>
        </div>
        <br />
        <div className="form-group">
          <label htmlFor="exampleFormControlInput4">
            <h5>Cost: </h5>
          </label>
          <input
            type="number"
            className="form-control"
            id="exampleFormControlInput1"
            placeholder="Enter Specific Package Costing Here.."
            value={Cost}
            onChange={(e) => setCost(e.target.value)}
          />
        </div>
        <br />
        <div className="form-group">
          <label htmlFor="recommended">
            <h5>Recommended Activities: </h5>
          </label>
          <input
            type="text"
            className="form-control"
            id="recommended"
            placeholder="Enter recommended activities separated by commas"
            value={Recommended}
            onChange={(e) => setRecommended(e.target.value)}
          />
        </div>
        <br />
        <div
          style={{
            justifyContent: "center",
            display: "flex",
            marginTop: "20px",
          }}
        >
          <button type="submit" class="btn btn-primary btn-lg">
            Confirm
          </button>
        </div>
      </form>
    </div>
  );
}

export default UpdatePackage;
