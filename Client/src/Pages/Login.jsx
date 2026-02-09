import React, { useContext, useState } from 'react'
import { assets } from '../assets/mern-assets/assets'
import {useNavigate} from 'react-router-dom'
import { AppContext } from '../Context/AppContext'
import axios from 'axios';
import {toast } from 'react-toastify';


const Login = () => {

  const navigate=useNavigate()

  const {backendUrl,setisLoggedin }= useContext(AppContext)

  const [state,setState] =useState('Sign Up') //default signup page
  const[name,setName]=useState('')
  const[email,setEmail]=useState('')
  const[password,setPassword]=useState('')

//FUNCTION THAT WILL RUN WHEN WE WILL SUBMIT FORMA
  const onSubmitHandler=async (e)=>{
    try{

      e.preventDefault();

      axios.defaults.withCredentials=true; //SEND COOKIES AS WELL

        if(state==='Sign Up'){
          const {data}= await axios.post(backendUrl + '/api/auth/register' , {name,email,password})
          
          if(data.success){
            setisLoggedin(true);
            navigate('/')
          }else{
            toast.error(data.message);
          }
        }
        else{
          const {data}= await axios.post(backendUrl + '/api/auth/login' , {email,password})
          
          if(data.success){
            setisLoggedin(true);
            navigate('/')
          }else{
            toast.error(data.message);
          }
        }
    }
    catch(err){
      toast.error(err.response?.data?.message || err.message || 'An error occurred');
    }
  }


  return (

      <div className="flex items-center justify-center min-h-screen px-6 sm:px-0 bg-[radial-gradient(circle_at_top,#ede9fe,#ffffff,#f5f3ff)]">

         <img src={assets.logo} onClick={()=>{navigate('/')}} alt=""  className='absolute left-5 sm:left-20 top-5 w-28 sm:w-32 cursor-pointer'/>
    
       <div className='bg-slate-900 p-10 rounded-lg shadow-lg w-full sm:w-96 text-indigo-300 text-sm'>

          <h2 className='text-3xl font-semibold text-white text-center mb-3 '> {state === 'Sign Up' ? 'Create account' : 'Login'}</h2> 

          <p className='text-center text-sm mb-6'>{state === 'Sign Up' ? 'Create your account' : 'Login to your Accout'}</p>


{/* FORM */}
          <form action="" onSubmit={onSubmitHandler}>

            {/* jb state signup ho gi tab hee fullname required hoga nhi to agar login krna a to bs email and password hee chahiyen             */}
            
            {state === 'Sign Up' &&  (<div className='flex items-center gap-3 mb-4 w-full px-5 py-2.5 rounded-full bg-[#333A5C]'>
              <img src={assets.person_icon} alt="" />
              <input onChange={e=>setName(e.target.value)} value={name}
              className='bg-transparent outline-none' type="text" name="" placeholder='Full Name' id="" required/>

            </div>) }


            <div className='flex items-center gap-3 mb-4 w-full px-5 py-2.5 rounded-full bg-[#333A5C]'>
              <img src={assets.mail_icon} alt="" />
              <input onChange={e=>setEmail(e.target.value)} value={email} 
              className='bg-transparent outline-none' type="email" name="" placeholder='Email ' id="" required/>

            </div>

            <div className='flex items-center gap-3 mb-4 w-full px-5 py-2.5 rounded-full bg-[#333A5C]'>
              <img src={assets.lock_icon} alt="" />
              <input onChange={e=>setPassword(e.target.value)} value={password} 
              className='bg-transparent outline-none' type="password" name="" placeholder='Password' id="" required/>

            </div>


            <p onClick={()=>{navigate('/reset-password')}} className='mb-4 text-indigo-500 cursor-pointer'>Forgot Password?</p>

            <button className='rounded-full py-2.5 w-full bg-linear-to-r from-indigo-500 to-indigo-900 text-white font-medium cursor-pointer'> { state }</button>
          </form>
          

{/* AGAR STATE SIGNUP HOGI TO YE WALA SHOW HOGA K ALREADY HAVE AN ACCOUNT NHI TO AGAR STATE SIGNUP NA HUI TO SHOW HOGA ALREADY ACCAOUNT HAI?  {state==='Sign Up' ? () : ()} */}
          {state === 'Sign Up' ? (<p className='text-gray-400 text-center text-xs mt-4'>Already have an account?{'  '}
             <span onClick={()=>setState('Login')}  className='cursor-pointer text-blue-300 underline'>Login Here</span>
          </p>)  : 
          (<p className='text-gray-400 text-center text-xs mt-4'>Don't have an account?{'  '}
             <span onClick={()=>setState('Sign Up')} className='cursor-pointer text-blue-300 underline'>Sign Up</span>
          </p>)}
          


          



       </div>

    </div>
  )
}

export default Login