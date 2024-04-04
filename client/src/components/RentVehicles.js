import React, { useState, useEffect } from 'react';
import axios from 'axios';

function RentVehicles() {
    const [pkg, setPkg] = useState([]);

    useEffect(() => {
        axios
            .get("http://localhost:3001/ViewRentalVehicle")
            .then((result) => {
                setPkg(result.data);
            })
            .catch((err) => console.log(err));
    }, []);

    return (
        <main className="main-container">
            <style>{`
                .package-container {
                    max-height: 100vh;
                    overflow-y: auto;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                }

                .card {
                    width: 60%;
                    margin-top: 50px;
                    padding: 20px;
                    background-color: #f9f9f9;
                    border-radius: 10px;
                    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
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
                    <h2 style={{textAlign:'center'}}>Available Vehicles:</h2>
                    {pkg.map((rentalDetails, index) => (
                        <div className="card" key={index}>
                            <div className="card-content">
                                <h6>Vehicle Name: {rentalDetails.VehicleName}</h6>
                                <p>Description: {rentalDetails.Description}</p>
                                <p>No. of Seats: {rentalDetails.SeatingType}</p>
                                <p>Vehicle Make Year: {rentalDetails.VehicleYear}</p>
                                <p>Cost:<b> Rs.</b> {rentalDetails.Cost}</p>
                            </div>
                            <div className="card-buttons">
                                <button className="btn btn-primary">Book Now</button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </main>
    );
}

export default RentVehicles;
