// App.js
import React, {Fragment} from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import PrivateRoute from './components/PrivateRoute';
import LoginSignup from './components/LoginSignup';
import HomePage from './components/HomePage';
import PickupAndDropService from './components/PickupAndDropService';
import AdminDashboard from './components/AdminDashboard';
import AdminPackage from './components/AdminPackage';
import TourPackages from './components/TourPackages';
import AdminManagePackage from './components/AdminManagePackages';
import UpdatePackage from './components/UpdatePackage';
import AdminVehicleRental from './components/AdminVehicleRental';
import RentVehicles from './components/RentVehicles';
import AdminManageRental from './components/AdminManageRentals';
import UpdateRentalVehicle from './components/UpdateRentalVehicle';
import AdminPackageRequest from './components/AdminPackageRequests';


const App = () => {
  return (
    <Router>
      <Fragment>
      <Routes>
        <Route path="/" element={<LoginSignup />} />
        <Route path="/AdminDashboard" element={<AdminDashboard />} />
        <Route path="/AdminPackage" element={<AdminPackage />} />
        <Route path="/AdminManagePackage" element={<AdminManagePackage />} />
        <Route path="/UpdatePackage/:id" element={<UpdatePackage/>} />
        <Route path="/AdminPackageRequest" element={<AdminPackageRequest />} />
        <Route path="/TourPackages" element={<TourPackages />} />
        <Route path="/AdminVehicleRental" element={<AdminVehicleRental />} />
        <Route path="/AdminManageRental" element={<AdminManageRental />} />
        <Route path="/RentVehicles" element={<RentVehicles />} />
        <Route path="/UpdateRentalVehicle/:id" element={<UpdateRentalVehicle/>} />
        {/* <Route path="/dashboard" element={<Dashboard/>}/> */}
        <Route path="/home" element={<PrivateRoute />}>
          <Route index element={<HomePage />} />
        </Route>
        {/* <Route path="/Admin" element={<PrivateRoute />}>
          <Route index element={<AdminDashboard />} />
        </Route> */}
        <Route path="/pick&drop" element={<PrivateRoute />}>
          <Route index element={<PickupAndDropService />} />
        </Route>
      </Routes>
      </Fragment>
    </Router>
  );
};


export default App;


/* 
// Corrected App.js
import React, { Fragment } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import PrivateRoute from './components/PrivateRoute';
import LoginSignup from './components/LoginSignup';
import HomePage from './components/HomePage';
import AdminDashboard from './components/AdminDashboard';

const App = () => {
  return (
    <Router>
      <Fragment>
        <Routes>
          <Route path="/" element={<PrivateRoute />} />
          <Route path="/home" element={<HomePage />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/login" element={<LoginSignup />} />
        </Routes>
      </Fragment>
    </Router>
  );
};

export default App;
*/

/* 
const app = () => {
  return (
    <router>
      <fragment>
        <routes>
          <route exact path='/' element={<privateroute/>}>
            <route exact path='/' element={<home/>}/>
          </route>
          <route exact path='/register' element={<register/>}/>
          <route exact path='/login' element={<login/>}/>
        </routes>
      </fragment>
    </router>
    
  );
}
*/