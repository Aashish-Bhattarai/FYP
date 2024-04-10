import React from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import DriverSidebar from './Driver/DriverSidebar';
import History from './Driver/History';


function DriverHistory() {
  return (
    <div className='container-fluid bg-secondary min-vh-100 '>
      <div className='row '>
          <div className='col-4 col-md-2 bg-white vh-100 position-fixed'>
            <DriverSidebar />
          </div>
        <div className='col-4 col-md-2'></div>
        <div className='col'>
          <div className='scrollable-content' style={{ maxHeight: 'calc(100vh)', overflowY: 'auto', paddingTop: '50px', paddingBottom: '50px' }}>
            <History /> 
          </div>
        </div>
      </div>
    </div>
  )
}

export default DriverHistory;
