import React from 'react'
import { assets } from '../assets/mern-assets/assets'
import {useNavigate} from 'react-router-dom'
import { useContext } from 'react'
import { AppContext } from '../Context/AppContext'
import { toast } from 'react-toastify'
import axios from 'axios'

const Navbar = () => {

    const navigate=useNavigate()

    const{userData, backendUrl, setuserData , setisLoggedin} =useContext(AppContext)

// LOGOUT FUNCTIONALITY WHEN WE WILL CLICK ON TOP RIGHT CORNER AND CLICK LOGOUT
    const logout= async ()=>{
      try{
        axios.defaults.withCredentials=true 
        const{data} = await axios.post(backendUrl+ '/api/auth/logout')
        data.success && setisLoggedin(false)
        data.success && setuserData(false)
        navigate('/')
      }
      catch(error){
        toast.error(error.message)
      }
    }





//FUNCTION THAT WILL SEND VERIFICATION OTP WHEN CLICKED ON ERIFY EMAIL JB USER LOGGED IN HUA HO AND APNE ACCOUNT K UPAR HOVER KR K VERIFY EMAIL KO CLICK KRE
    const sendVerificationOtp=async ()=>{
      try{

        // Configure axios to send cookies with requests
         axios.defaults.withCredentials = true;

         const {data}= await axios.post(backendUrl + '/api/auth/send-verify-otp') //we have made this api in our backend

         if(data.success){
           navigate('/verify-email') //ye page hum ne bnaya hua hai is ka path daal diya .. app.jsx main b dala hua
           toast.success(data.message)
         }
         else{
            toast.error(data.message)
         }
      }

      catch(error){
         toast.error(data.message)

      }
    }





  return (
    <div className='w-full flex justify-between items-center p-4 sm:p-6 sm:px-24 absolute top-0'>

        <img src={assets.logo} alt=""  className='w-28 sm:w-32'/>

        {/* //agar user loggedin hai mean user data available hai to us k name ka first letter dikhao and verify email and logout ka option dikhao... agar login nhi to login button dikhao */}
         {userData ? 
            <div className='w-8 h-8 flex justify-center items-center rounded-full bg-black text-white relative group'> 
                {userData.name[0].toUpperCase()}
                <div className='absolute hidden group-hover:block top-0 right-0 z-10 text-black rounded pt-10'>

                      <ul className='list-none text-sm m-0 p-2 bg-gray-100'>

{/* agar account verified nhi hai tb hee verify email show kren ge */}
                        {!userData.isVerified &&  <li onClick={sendVerificationOtp} className='py-1 px-2 hover:bg-gray-400 cursor-pointer'> Verify Email </li>}  

                        <li onClick={logout} className='py-1 px-2 hover:bg-gray-400 cursor-pointer '> Logout </li>
                      </ul>

                </div>
            </div> :
             <button onClick={()=>navigate('/login')} className='flex items-center gap-2 border border-gray-500 rounded-full px-6 py-2 hover:bg-gray-100 transition-all cursor-pointer'>Login    <img src={assets.arrow_icon} alt="" />    </button>
 }
  
        {/* <button onClick={()=>navigate('/login')} className='flex items-center gap-2 border border-gray-500 rounded-full px-6 py-2 hover:bg-gray-100 transition-all cursor-pointer'>Login    <img src={assets.arrow_icon} alt="" />    </button> */}
    </div>
  )
}

export default Navbar