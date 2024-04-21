import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Chart from 'chart.js/auto';
import './adminui.css';
import jsPDF from 'jspdf';

function Dashboard() {
    const [totalUsers, setTotalUsers] = useState(0);
    const [totalDrivers, setTotalDrivers] = useState(0);
    const [totalEarnings, setTotalEarnings] = useState(0);
    const [totalPickupDropServices, setTotalPickupDropServices] = useState(0);
    const [totalRentalServices, setTotalRentalServices] = useState(0);
    const [totalPackageServices, setTotalPackageServices] = useState(0);
    const [totalPickupDropServicesPending, setTotalPickupDropServicesPending] = useState(0);
    const [totalPickupDropServicesAccepted, setTotalPickupDropServicesAccepted] = useState(0);
    const [totalRentalServicesPending, setTotalRentalServicesPending] = useState(0);
    const [totalRentalServicesAccepted, setTotalRentalServicesAccepted] = useState(0);
    const [totalPackageServicesPending, setTotalPackageServicesPending] = useState(0);
    const [totalPackageServicesAccepted, setTotalPackageServicesAccepted] = useState(0);
    const [driverPerformance, setDriverPerformance] = useState([]);
    const [selectedMonth, setSelectedMonth] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        // Fetch driver ratings from the DriverRatingModel
        axios.get('http://localhost:3001/driver-ratings')
            .then(response => {
                setDriverPerformance(response.data.averageRatings);
            })
            .catch(error => {
                console.error('Error fetching driver performance:', error);
            });
    }, []);

    useEffect(() => {
        // Fetch number of users
        axios.get('http://localhost:3001/users')
            .then(response => {
                setTotalUsers(response.data.totalUsers);
            })
            .catch(error => {
                console.error('Error fetching total users:', error);
            });

        // Fetch number of drivers
        axios.get('http://localhost:3001/drivers')
            .then(response => {
                setTotalDrivers(response.data.totalDrivers);
            })
            .catch(error => {
                console.error('Error fetching total drivers:', error);
            });

        // Fetch total earnings
        axios.get('http://localhost:3001/earnings')
            .then(response => {
                setTotalEarnings(response.data.totalEarnings);
            })
            .catch(error => {
                console.error('Error fetching total earnings:', error);
            });

        // Fetch total number of services
        axios.get('http://localhost:3001/services')
            .then(response => {
                setTotalPickupDropServices(response.data.totalPickupDropServices);
                setTotalRentalServices(response.data.totalRentalServices);
                setTotalPackageServices(response.data.totalPackageServices);
                setTotalPickupDropServicesPending(response.data.totalPendingPickupDropServices);
                setTotalRentalServicesPending(response.data.totalPendingRentalServices);
                setTotalPackageServicesPending(response.data.totalPendingPackageServices);
                setTotalPickupDropServicesAccepted(response.data.totalAcceptedPickupDropServices);
                setTotalRentalServicesAccepted(response.data.totalAcceptedRentalServices);
                setTotalPackageServicesAccepted(response.data.totalAcceptedPackageServices);
            })
            .catch(error => {
                console.error('Error fetching total services:', error);
            });
    }, []);

    const removeDriver = (driverId) => {
        // Send a DELETE request to the server to remove the driver
        axios.delete(`http://localhost:3001/api/dashboard/remove-driver/${driverId}`)
            .then(response => {
                // Handle success response
                console.log(response.data.message); // Log success message
                // Implement any additional logic after removing the driver
            })
            .catch(error => {
                // Handle error response
                console.error('Error removing driver:', error);
                // Implement any error handling logic
            });
    };

    // Function to render the pie chart for ratio of users to drivers
    const renderPieChart = () => {
        const ctx = document.getElementById('pieChart').getContext('2d');
        if (window.pieChartInstance) {
            window.pieChartInstance.destroy();
        }
        window.pieChartInstance = new Chart(ctx, {
            type: 'pie',
            data: {
                labels: ['Users', 'Drivers'],
                datasets: [{
                    data: [totalUsers, totalDrivers],
                    backgroundColor: ['rgba(0, 123, 255, 0.6)', 'rgba(40, 167, 69, 0.6)'],
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
            }
        });
    };

    // Function to render the bar chart for services
    const renderBarChart = () => {
        const ctx = document.getElementById('barChart').getContext('2d');
        if (window.barChartInstance) {
            window.barChartInstance.destroy();
        }
        window.barChartInstance = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: ['Pickup & Drop', 'Rental', 'Package'],
                datasets: [{
                    label: 'Total Services Booked',
                    data: [totalPickupDropServices, totalRentalServices, totalPackageServices],
                    backgroundColor: ['rgba(0, 123, 255, 0.6)', 'rgba(40, 167, 69, 0.6)', 'rgba(255, 193, 7, 0.6)'],
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });
    };

    const handleDownloadReport = () => {
        if (!selectedMonth) {
            alert('Please select a month');
            return;
        }
        setLoading(true);
        axios.get(`http://localhost:3001/reports/${selectedMonth}`)
            .then(response => {
                const { totalEarnings, mostPopularService, mostBookedVehicle, mostBookedPackage, mostRatedDrivers } = response.data;
    
                // Create a new jsPDF instance
                const doc = new jsPDF();
    
                // Set title and month name
                const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
                const monthName = months[selectedMonth - 1];
                doc.setFontSize(18);
                doc.text("YatraSathi - Monthly Report", 105, 15, null, null, "center");
                doc.setFontSize(14);
                doc.text(`${monthName} Month`, 105, 25, null, null, "center");
    
                // Add content to the PDF
                doc.setFontSize(12);
                doc.setFont(undefined, "bold");
                doc.text("Total Earnings:", 10, 40);
                doc.setFont(undefined, "normal");
                doc.text(`Rs. ${totalEarnings}`, 10, 50);
                doc.setFont(undefined, "bold");
                doc.text("Most Popular Service:", 10, 60);
                doc.setFont(undefined, "normal");
                doc.text(`${mostPopularService || 'Not available'}`, 10, 70);
                doc.setFont(undefined, "bold");
                doc.text("Most Booked Vehicle:", 10, 80);
                doc.setFont(undefined, "normal");
                doc.text(`${mostBookedVehicle || 'Not available'}`, 10, 90);
                doc.setFont(undefined, "bold");
                doc.text("Most Booked Package:", 10, 100);
                doc.setFont(undefined, "normal");
                doc.text(`${mostBookedPackage || 'Not available'}`, 10, 110);
    
                // Add spacing between sections
                doc.text('', 10, 120);
    
                // Handle most rated drivers
                if (mostRatedDrivers.length > 0) {
                    doc.setFont(undefined, "bold");
                    doc.text('Most Rated Drivers:', 10, 130);
                    mostRatedDrivers.forEach((driver, index) => {
                        doc.setFont(undefined, "normal");
                        doc.text(`${index + 1}. Driver Name: ${driver.DriverName}, Rating: ${driver.Rating}`, 10, 140 + (index * 20));
                    });
                } else {
                    doc.text('Rated drivers not found!!', 10, 130);
                }
    
                // Save the PDF
                doc.save('report.pdf');
    
                setLoading(false);
            })
            .catch(error => {
                console.error('Error downloading report:', error);
                setLoading(false);
                // Handle error
            });
    };
    
    
    
    
    
    // Call the functions to render the charts
    useEffect(() => {
        renderPieChart();
        renderBarChart();
    }, [totalUsers, totalDrivers, totalPickupDropServices, totalRentalServices, totalPackageServices]);

    return (
        <div className='px-3' style={{ overflow: 'auto', maxHeight: 'calc(100vh - 20px)' }}>
            <div style={{marginTop: '30px'}}> 
            <label htmlFor="selectMonth" style={{ marginRight: '10px', marginLeft: '15px', color: 'maroon', fontSize: '20px' }}>Select Month:</label>
            <select
                id="selectMonth"
                value={selectedMonth}
                onChange={e => setSelectedMonth(e.target.value)}
                style={{
                    padding: '8px',
                    borderRadius: '5px',
                    border: '1px solid #ccc',
                    marginRight: '10px'
                }}
            >
                <option value="">Select Here</option>
                <option value="1">January</option>
                <option value="2">February</option>
                <option value="3">March</option>
                <option value="4">April</option>
                <option value="5">May</option>
                <option value="6">June</option>
                <option value="7">July</option>
                <option value="8">August</option>
                <option value="9">September</option>
                <option value="10">October</option>
                <option value="11">November</option>
                <option value="12">December</option>
            </select>
            <button
                onClick={handleDownloadReport}
                disabled={loading}
                style={{
                    padding: '8px 16px',
                    borderRadius: '5px',
                    border: 'none',
                    backgroundColor: loading ? '#ccc' : '#007bff',
                    color: '#fff',
                    cursor: loading ? 'not-allowed' : 'pointer',
                    transition: 'background-color 0.3s ease'
                }}
            >
                {loading ? 'Downloading...' : 'Download Report'}
            </button>
            </div>
            <div className='container-fluid'>
                <div className='row g-3 my-2'>
                    <div className='col-md-4 p-1'>
                        <div className='p-3 bg-white shadow-sm d-flex justify-content-around align-items-center rounded'>
                            <div>
                                <h3 className='fs-2'>{totalUsers}</h3>
                                <p className='fs-5'>Users</p>
                            </div>
                            <i className='bi bi-person p-3 fs-1'></i>
                        </div>
                    </div>
                    <div className='col-md-4 p-1'>
                        <div className='p-3 bg-white shadow-sm d-flex justify-content-around align-items-center rounded'>
                            <div>
                                <h3 className='fs-2'>{totalDrivers}</h3>
                                <p className='fs-5'>Drivers</p>
                            </div>
                            <i className='bi bi-car-front-fill p-3 fs-1'></i>
                        </div>
                    </div>
                    <div className='col-md-4 p-1'>
                        <div className='p-3 bg-white shadow-sm d-flex justify-content-around align-items-center rounded'>
                            <div>
                                <h3 className='fs-2'> Rs. {totalEarnings}</h3>
                                <p className='fs-5'>Total Earnings</p>
                            </div>
                            <i className='bi bi-cash p-3 fs-1'></i>
                        </div>
                    </div>
                </div>
                <div style={{backgroundColor: 'whitesmoke', padding: '20px', marginTop: '40px', marginBottom: '40px', borderRadius: '8px'}}>
                    <div className='row my-2'>
                        <div className='col-md-6'>
                            <canvas id='pieChart'></canvas>
                        </div>
                        <div className='col-md-6'>
                            <canvas id='barChart'></canvas>
                        </div>
                    </div>
                </div>
                <div className='row my-2'>
                    <div className='col-md-4'>
                        <div className='bg-white p-3 shadow-sm rounded'>
                            <h4 className="service-heading" style={{ textAlign: 'center', marginBottom: '15px', color: '#0056b3' }}>Pickup & Drop Services</h4>
                            <div className="service-info" style={{fontSize: '20px'}}>
                                <p style={{ color: '#000', marginBottom: '10px' }}>Total Bookings: {totalPickupDropServices}</p>
                                <div style={{ marginBottom: '10px' }}>
                                    <p style={{ color: '#28a745', marginBottom: '0' }}>Accepted: {totalPickupDropServicesAccepted}</p>
                                    <p style={{ color: 'red', marginBottom: '5px' }}>Pending: {totalPickupDropServicesPending}</p>  
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className='col-md-4'>
                        <div className='bg-white p-3 shadow-sm rounded'>
                            <h4 className="service-heading" style={{ textAlign: 'center', marginBottom: '15px', color: '#0056b3' }}>Rental Services</h4>
                            <div className="service-info" style={{fontSize: '20px'}}>
                                <p style={{ color: '#000', marginBottom: '10px' }}>Total Bookings: {totalRentalServices}</p>
                                <div style={{ marginBottom: '10px' }}>
                                    <p style={{ color: '#28a745', marginBottom: '0' }}>Accepted: {totalRentalServicesAccepted}</p>
                                    <p style={{ color: 'red', marginBottom: '5px' }}>Pending: {totalRentalServicesPending}</p>   
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className='col-md-4'>
                        <div className='bg-white p-3 shadow-sm rounded'>
                            <h4 className="service-heading" style={{ textAlign: 'center', marginBottom: '15px', color: '#0056b3' }}>Package Services</h4>
                            <div className="service-info" style={{fontSize: '20px'}}>
                                <p style={{ color: '#000', marginBottom: '10px' }}>Total Bookings: {totalPackageServices}</p>
                                <div style={{ marginBottom: '10px' }}>
                                    <p style={{ color: '#28a745', marginBottom: '0' }}>Accepted: {totalPackageServicesAccepted}</p>
                                    <p style={{ color: 'red', marginBottom: '5px' }}>Pending: {totalPackageServicesPending}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                </div>

            </div>
            <div className='row my-2'>
                <div className='col-md-12' style={{marginTop: '30px', marginBottom: '30px'}}>
                    <div className='bg-white p-3 shadow-sm rounded'>
                    <h2 style={{ color: '#0056b3', textAlign: 'center', fontFamily: 'monospace'}}>Driver Performance</h2>
                    {driverPerformance && driverPerformance.length > 0 ? (
                        driverPerformance.map(driver => (
                            <div key={driver.DriverId}>
                                <h5>{driver.DriverName}</h5>
                                <p>Rating: {driver.Rating}</p>
                                {driver.Rating <= 2 && (
                                    <button onClick={() => removeDriver(driver.DriverId)}>Remove Driver</button>
                                )}
                            </div>
                        ))
                    ) : (
                        <p>No driver performance data available.</p>
                    )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Dashboard;
