import React, { useState, useEffect } from 'react';
import axios from 'axios';

function RentVehicles() {
    const [rental, setrental] = useState([]);
    const [showModal, setShowModal] = useState(false)
    const [selectedVehicle, setSelectedVehicle] = useState(null);
    const [selectedDays, setSelectedDays] = useState(1); // Default to 1 day

    useEffect(() => {
        axios
            .get("http://localhost:3001/ViewRentalVehicle")
            .then((result) => {
                setrental(result.data);
            })
            .catch((err) => console.log(err));
    }, []);


    const handleBookNow = (vehicle) => {
        setSelectedVehicle(vehicle);
        setShowModal(true);
    };


    const handleConfirmBooking = () => {
        // Perform booking confirmation logic here
        setShowModal(false);
        // Assuming some logic to update the UI after booking confirmation
    };

    
    return (
        <main className="main-container">
            <style>{`
                .package-container {
                    max-height: calc(100vh - 100px);
                    overflow-y: auto;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: flex-start;
                    margin-top: 20px; 
                }
    
                .card {
                    margin-top: 50px;
                    padding: 20px;
                    background-color: #f9f9f9;
                    border-radius: 10px;
                    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
                    width: 60%; 
                }
    
                .card-content {
                    flex: 1;
                }
    
                .card-buttons {
                    display: flex;
                    justify-content: flex-end;
                    align-items: center;
                }
    
                .btn {
                    padding: 8px 16px;
                    font-size: 16px;
                    border: none;
                    border-radius: 5px;
                    background-color: #007bff;
                    color: #fff;
                    cursor: pointer;
                }
    
                .btn:hover {
                    background-color: #0056b3;
                }
            `}</style>
            <div>
                <div className="package-container">
                    <h2 style={{ 
                        textAlign: 'center', 
                        color: '#515d69', 
                        fontSize: '3.5rem', 
                        fontWeight: 'bold',
                        marginBottom: '25px',
                        fontFamily: 'Montserrat, sans-serif',
                        textShadow: '1px 1px 2px rgba(0, 0, 0, 0.7)', 
                        borderBottom: '3px solid #293642', 
                        paddingBottom: '10px' }}>Discover Your Ride: Explore Now</h2>
                    {rental.map((rentalDetails, index) => (
                        <div className="card" key={index}>
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
                                    <div className="rental-image" style={{float: 'right', width: '35%', marginTop: '15px', marginBottom: '40px'}}>
                                        <img
                                            src={`http://localhost:3001/images/${rentalDetails.Image}`}
                                            className="img-fluid"
                                            style={{width:'300px', height:'220px', borderRadius: '8px'}}
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="card-buttons" style={{marginTop:'30px'}}>
                                <button className="btn btn-primary" style ={{padding:'10px', paddingLeft:'20px', paddingRight:'20px', marginRight:'30px', marginBottom:'8px', fontSize:'20px'}}>Book Now</button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </main>
    );
    
}

export default RentVehicles;


