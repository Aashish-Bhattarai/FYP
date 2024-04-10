import React, { useState } from 'react';
import axios from 'axios';

function AddDriver() {
    const [driverName, setDriverName] = useState('');
    const [driverEmail, setDriverEmail] = useState('');
    const [driverPhone, setDriverPhone] = useState('');
    const [driverPassword, setDriverPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    

    const handleSubmit = (e) => {
        e.preventDefault();
    
        const driverData = {
            name: driverName,
            email: driverEmail,
            phone: driverPhone,
            password: driverPassword,
            role: "driver" // Set the role to "driver"
        };
    
        axios.post('http://localhost:3001/signup', driverData)
            .then((response) => {
                console.log(response);
                // Clear input fields
                setDriverName('');
                setDriverEmail('');
                setDriverPhone('');
                setDriverPassword('');
                setShowPassword(false); // Reset show password state
            })
            .catch((error) => {
                console.error(error);
                // Optionally, you can handle error response here
            });
    };

    return (
        <div style={{ marginBottom: '30px', marginTop: '30px', height: 'calc(100vh - 100px)', overflow: 'auto' }}>
            <div style={{ backgroundColor: '#4682B4', color: '#fff', textAlign: 'center', padding: '10px', borderTopLeftRadius: '8px', borderTopRightRadius: '8px', width: '50%', margin: 'auto' }}>
                <h2 style={{ fontSize: '2rem', fontWeight: 'bold', margin: '0' }}>Add Driver</h2> <br/>
            </div>
            <form onSubmit={handleSubmit} style={{ backgroundColor: '#f5f5f5', padding: '20px', borderBottomLeftRadius: '8px', borderBottomRightRadius: '8px', marginLeft: 'auto', marginRight: 'auto', width: '50%' }}>
                <div className="form-group">
                    <label style={{ marginBottom: '15px' }} htmlFor="driverName"><h5>Driver Name:</h5></label>
                    <input type="text" className="form-control" id="driverName" placeholder="Enter Driver Name" value={driverName} onChange={(e) => setDriverName(e.target.value)} required />
                </div>
                <br />
                <div className="form-group">
                    <label style={{ marginBottom: '15px' }} htmlFor="driverEmail"><h5>Driver Email:</h5></label> 
                    <input type="email" className="form-control" id="driverEmail" placeholder="Enter Driver Email" value={driverEmail} onChange={(e) => setDriverEmail(e.target.value)} required />
                </div>
                <br />
                <div className="form-group">
                    <label style={{ marginBottom: '15px' }} htmlFor="driverPhone"><h5>Driver Phone No:</h5></label> 
                    <input type="text" className="form-control" id="driverPhone" placeholder="Enter Driver Phone" value={driverPhone} onChange={(e) => setDriverPhone(e.target.value)} required />
                </div>
                <br />
                <div className="form-group">
                    <label style={{ marginBottom: '15px' }} htmlFor="driverPassword"><h5> Password:</h5></label> 
                    <div className="input-group">
                        <input type={showPassword ? "text" : "password"} className="form-control" id="driverPassword" placeholder="Enter Driver Password" value={driverPassword} onChange={(e) => setDriverPassword(e.target.value)} required /> &ensp;
                        <div className="input-group-append">
                            <button className="btn btn-outline-secondary" type="button" onClick={() => setShowPassword(!showPassword)}>
                                <i className={showPassword ? "bi bi-eye-slash" : "bi bi-eye"}></i>
                            </button>
                        </div>
                    </div>
                </div>
                <br />
                <div style={{ justifyContent: 'center', display: 'flex' }}>
                    <button type="submit" className="btn btn-primary btn-lg">Add Driver</button>
                </div>
            </form>
        </div>
    );
}

export default AddDriver;
