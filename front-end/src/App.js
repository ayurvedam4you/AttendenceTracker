
import './App.css';
import AdminLogin from './components/Admin/AdminLogin';
import { Routes, Route} from "react-router-dom";
import AdminRegister from './components/Admin/AdminRegister';
import AdminDashboard from './components/Admin/AdminDashboard';
import AdminEditProfile from './components/Admin/AdminEditProfile';
import AdminAddMember from './components/Admin/AdminAddMember';
import Login from './components/Login';
import Dashboard from './components/Dashboard';

import AdminOTP from './components/Admin/AdminOTP';
import AdminResetPassword from './components/Admin/AdminResetPassword';
import AdminImportData from './components/Admin/AdminImportData';
import AdminEditMember from './components/Admin/AdminEditMember';
import ApplyLeave from './components/ApplyLeave';
import AdminLeaveApplications from './components/Admin/AdminLeaveApplications';
import AllLeaves from './components/AllLeaves';
function App() {
  
  return (
<Routes>
  <Route path='/' element={<Login/>}/>

  <Route path='/dashboard' element={<Dashboard/>}/>
  <Route path='/apply-leave' element={<ApplyLeave/>}/>
  <Route path='/leaves' element={<AllLeaves/>}/>
  <Route path='/admin/login' element={<AdminLogin/>}/>
  <Route path='/admin/register' element={<AdminRegister/>}/>
  <Route path='/admin/dashboard' element={<AdminDashboard/>}/>
  <Route path='/admin/edit-profile' element={<AdminEditProfile/>}/>
  <Route path='/admin/add-member' element={<AdminAddMember/>}/>
  <Route path='/admin/edit-member/:email/:designation' element={<AdminEditMember/>}/>
  <Route path='/admin/send-otp/:email' element={<AdminOTP/>}/>
  <Route path='/admin/reset-password' element={<AdminResetPassword/>}/>
  <Route path='/admin/export-data' element={<AdminImportData/>}/>
  <Route path='/admin/leave-applications' element={<AdminLeaveApplications/>}/>
  
</Routes>
  );
}

export default App;
