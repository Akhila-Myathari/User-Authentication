import {Routes,Route} from 'react-router-dom'
import {React} from 'react'
import { ToastContainer} from 'react-toastify';
import EmailVerify from './pages/EmailVerify'
import Home from './pages/Home'
import Login from './pages/login'
import ResetPassword from './pages/resetPassword'

const App = () => {

  return (
    <div>
      <ToastContainer />
      <Routes>
        <Route path='/' element={<Home/>}></Route>
        <Route path='/login' element={<Login/>}></Route>
        <Route path='/email-verify' element={<EmailVerify/>}></Route>
        <Route path='/reset-password' element={<ResetPassword/>}></Route>
      </Routes>
  
    </div>
  )
}

export default App
