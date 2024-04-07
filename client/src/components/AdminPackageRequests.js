import React from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import Sidebar from './Admin/Sidebar';
import PackageRequests from './Admin/PackageRequests';

function AdminManagePackage() {
  return (
    <div className='container-fluid bg-secondary min-vh-100 '>
      <div className='row '>
          <div className='col-4 col-md-2 bg-white vh-100 position-fixed'>
            <Sidebar />
          </div>
        <div className='col-4 col-md-2'></div>
        <div className='col'>
          <div className='scrollable-content' style={{ maxHeight: 'calc(100vh)', overflowY: 'auto', paddingTop: '50px', paddingBottom: '50px' }}>
            <PackageRequests />
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminManagePackage;
