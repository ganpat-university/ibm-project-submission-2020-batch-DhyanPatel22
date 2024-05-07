import './App.css'
import { BrowserRouter as Router, Route, Routes ,Navigate} from 'react-router-dom'
import Login from './Pages/Login'
import Signup from './Pages/Signup'
import Dashboard from './Pages/Dashboard'
import Report from './Pages/Report'
import Profile from './Pages/Profile'
import EditProfile from './Pages/EditProfile'
import Home from './Pages/Home'
import Admin from './Pages/Admin'
import Users from './Pages/Users'
import RecordById from './Components/RecordById'
import DetailedInfo from './Components/DetailedInfo'
import Logout from './Pages/Logout'
import OtpVerification from './Components/OtpVerification'
import NotFound from './Components/NotFound'
function App() {
  const token = localStorage.getItem('token')
  const isVerified = localStorage.getItem('isVerified')

  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/home" element={isVerified === "false" ? <Navigate to="/verification" /> : <Home />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/dashboard" element={isVerified === "false" ? <Navigate to="/verification" /> : <Dashboard />} />
          <Route path="/logout" element={<Logout />} />
          <Route path="/verification" element={isVerified === "false" ? <OtpVerification /> : <Navigate to="/dashboard"/>} />
          <Route path="/report" element={isVerified === "false" ? <Navigate to="/verification" /> : <Report />} />
          <Route path="/profile" element={isVerified === "false" ? <Navigate to="/verification" /> : <Profile />} />
          <Route path="/edit-profile" element={isVerified === "false" ? <Navigate to="/verification" /> : <EditProfile />} />
          <Route path="/admin/emotion" element={<Admin />} />
          <Route path="/admin/user" element={<Users />} />
          <Route path="/admin/user/:id" element={<RecordById />} />
          <Route path="/detailedInfo/:id" element={<DetailedInfo />} />
          <Route path="/404" element={<NotFound />} />
          <Route path="*" element={<Navigate to="/404" />} />
        </Routes>
      </Router>
    </>
  )
}

export default App
