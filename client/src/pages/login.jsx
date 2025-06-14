import React, { useState,useContext } from 'react'
import axios from 'axios'
import {toast} from 'react-toastify'
import { assets } from '../assets/assets'
import {useNavigate} from 'react-router-dom'
import { AppContent } from '../context/AppContext'

const Login = () => {
  const navigate = useNavigate();
  const {backendUrl,setIsLoggedin,getUserData} = useContext(AppContent)
    const [state,setState] = useState('sign UP')
    const [name,setName] = useState('');
    const [email,setEmail] = useState('')
    const [password,setPassword] = useState('')
    const onSubmitHandler = async(e)=>{
      try{
       e.preventDefault();
     //  console.log('jijkn')
        axios.defaults.withCredentials = true
        if(state === 'sign UP'){
         const {data} = await axios.post(backendUrl + '/api/auth/register',{name,email,password})
         if(data.success){
          setIsLoggedin(true)
          getUserData()
          navigate('/')
         }else{
          toast.error(data.message)
         }
        }
        else{
          const {data} = await axios.post(backendUrl+'/api/auth/login',{email,password})
          if(data.success){
          setIsLoggedin(true)
          getUserData()
          navigate('/')
         }else{
          toast.error(data.message)
         }

        }
      } catch(error){
        toast.error(error.message);
    }
    }
  return (
    <div className='flex items-center justify-center min-h-screen px-6 sm:px-0 bg-gradient-to-br from-blue-200 to-purple-400'>
      <img onClick={()=>{navigate('/')}} src={assets.logo} alt="" className='absolute left-5 sm:left-20 top-5 w-28 sm:w-32 cursor-pointer'/>
      <div className='bg-slate-900 p-10 rounded-lg shadow-lg w-full sm:w-96 text-indigo-300 text-sm'>
        <h2 className='text-3xl font-semibold text-white text-center mb-3'>{state === 'sign UP' ? 'Create account':'Login'}</h2>
        <p className='text-center text-sm mb-6'>{state === 'sign UP'?'Create your account':'Login to your acount!'}</p>
        <form onSubmit={onSubmitHandler}>
            {state === 'sign UP' ? ( <div className=' mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#333A5C]'>
                <img src={assets.person_icon} alt="" />
                <input onChange={(e)=>{setName(e.target.value)}} 
                value = {name}
                type="text" placeholder='Full Name' required/>
            </div>):(<></>)}
           
             <div className=' mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#333A5C]'>
                <img src={assets.mail_icon} alt="" />
                <input onChange={(e)=>{setEmail(e.target.value)}} 
                value = {email}
                 type="email" placeholder='email id' required/>
            </div>
             <div className=' mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#333A5C]'>
                <img src={assets.lock_icon} alt="" />
                <input onChange={(e)=>{setPassword(e.target.value)}} 
                value = {password}
                type="password" placeholder='password' required/>
            </div>
            <p onClick={()=>{navigate('/reset-password')}}
            className='mb-4 cursor-pointer text-indigo-500'>forgot password?</p>
            <button type="submit" className='w-full py-2.5 rounded-full bg-gradient-to-br from-indigo-500 to-indigo-900 text-white font-medium'>{state}</button>
        </form>
        {state === 'sign UP' ? ( <p className='text-gray-400 text-center text-xs mt-4'>Already have an account?{' '}<span onClick={()=>{setState('login')}} className='text-blue-400 cursor-pointer underline'>Login here</span></p>):(
             <p className='text-gray-400 text-center text-xs mt-4'>don't have an account?{' '}<span onClick={()=>{setState('sign UP')}}  className='text-blue-400 cursor-pointer underline'>SignUp here</span></p>
        )}
      
      </div>
    </div>
  )
}

export default Login
