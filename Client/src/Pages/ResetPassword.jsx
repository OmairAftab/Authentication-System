import React, { useContext, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { assets } from '../assets/mern-assets/assets'
import { AppContext } from '../Context/AppContext'
import { toast } from 'react-toastify'
import axios from 'axios'


const ResetPassword = () => {
  const navigate =useNavigate()

  const[email,setEmail]=useState('')
  const inputRefs= React.useRef([]) //it is used to store references of multiple input boxes
  const[newPasssword,setnewPasssword]=useState('')
  const[isEmailSent,setisEmailSent]=useState('')
  const[otp,setOtp]=useState('')
  const[isOtpSubmitted,setisOtpSubmitted]=useState('')


  const {backendUrl}=useContext(AppContext)
  axios.defaults.withCredentials = true;







//FUNCTION THAT WILL HANDLE INPUT WHEN WE TYPE RESET OTP IN THOSE 6 BOXES
    const handleInput=(e,index)=>{
      if(e.target.value.length > 0 && index < inputRefs.current.length-1){ //If user typed something and this is not the last input, then move focus to the next box.
        inputRefs.current[index+1].focus() //jb hum aik field main number likh len ge to automatically next box pe focus ho jae ga and now we can type in next box
      }
    }






// FUNCTION THAT HANDLES IF USER PRESSES BACKSPACE ON AN EMPTY INPUT WHILE ENTERING RESET OTP, IT MOVES FOCUS TO THE PREVIOUS INPUT BOX (EXCEPT WHEN IT IS THE FIRST INPUT), AND THE LAST INPUT BEHAVES LIKE A NORMAL INPUT.
    const handleKeyDown=(e,index)=>{
      if(e.key==='Backspace' && e.target.value==='' && index>0){
        inputRefs.current[index-1].focus()
      }
    }




//FUNCTION JO HANDLE KRE GA PASTE FEATURE MEAN JB HUM CTRL+V KR DEN AND OTP COPY KIYA HO
    const handlePaste=(e)=>{
      const paste=e.clipboardData.getData('text')
      const pasteArray= paste.split('')
      pasteArray.forEach((char,index)=>{
          if(inputRefs.current[index]){
            inputRefs.current[index].value=char
          }
      })
    }






  // IS FUNCTION KO HUM NE 1ST FORM MEAN RESET PASSWORD WALE FORM MAIN USE KIYA HAQI JAHAN USER ANA EMAIL ID DETA HAI 
    const onSubmitEmail= async (e)=>{
      e.preventDefault();
      try{
          const {data}=await axios.post(backendUrl + '/api/auth/send-reset-otp', {email})

          data.success ? toast.success(data.message) : toast.error(data.message)
          data.success &&  setisEmailSent(true) 
      }
      catch(error){
          const msg = error?.response?.data?.message || error?.response?.data || error?.message || 'Request failed';
          toast.error(msg)
      }
    }





//YE FUNCTION 2ND FORM MAIN USE HOGA  JIS KA TITLE Reset Password otp HAI
    const onSubmitOtp= async(e)=>{
      e.preventDefault();
      const otpArray=inputRefs.current.map(e=>e.value)
      setOtp(otpArray.join(''))
      setisOtpSubmitted(true)
      
    }







//  FUNCTION FOR 3RD FORM
   const onSubmitNewPassword = async (e)=>{
    e.preventDefault();
    try{
      const {data}= await axios.post(backendUrl + '/api/auth/reset-password', { email, otp, newPassword: newPasssword })

      data.success ? toast.success(data.message) : toast.error(data.message)
      data.success && navigate('/login')
    }
    catch(error){
        const msg = error?.response?.data?.message || error?.response?.data || error?.message || 'Request failed';
        toast.error(msg)
      }
   }



  return (
    <div className="flex items-center justify-center min-h-screen px-6 sm:px-0 bg-[radial-gradient(circle_at_top,#ede9fe,#ffffff,#f5f3ff)]">
      <img src={assets.logo} onClick={()=>{navigate('/')}} alt=""  className='absolute left-5 sm:left-20 top-5 w-28 sm:w-32 cursor-pointer'/>
      


{/* AGAR EMAIL SENT NHI HUI TO YE WALA FORM DIKHAEN GE K WO EMAIL TYPE KR K SUBMIT KRE */}
{!isEmailSent && (
  <>
    {/* FORM #1 : Enter email id */}
    <form onSubmit={onSubmitEmail} className='bg-slate-800 p-8 rounded-lg w-96 text-sm'>
       <h1 className='text-white text-2xl font-semibold text-center mb-4'>Reset Password</h1>
       <p className='text-center mb-6 text-indigo-200'>Enter your Registered email address</p>
       
       <div className='flex mb-4 items-center bg-[#333A5C] gap-3 w-full px-2.5 py-2.5 rounded-full'>
         <img src={assets.mail_icon} />
         <input type="email" placeholder='Email id' className='text-white outline-none' value={email} onChange={e=>{setEmail(e.target.value)}}  required/>

       </div>

      <button className='w-full text-white py-3 rounded-full  bg-indigo-400 hover:bg-indigo-300 cursor-pointer'>Submit</button>

    </form>
  </>
)}








{/* JB EMAIL SEND HO JAE GI AND OTP SUBMIT NHI HUA HOGA TB US KO YE FORM DIKHAE GEN*/}
{!isOtpSubmitted && isEmailSent && (
<>
{/* Form to enter OTP */}
    <form onSubmit={onSubmitOtp} className='bg-slate-800 p-8 rounded-lg w-96 text-sm'>
        <h1 className='text-white text-2xl font-semibold text-center mb-4'>Reset Password otp</h1>
        <p className='text-center mb-6 text-indigo-200'>Enter a 6-digit code sent to your email id</p>
        <div className='flex justify-between mb-8' onPaste={handlePaste}>
            {Array(6).fill(0).map((_,index)=>(
                <input type="text" maxLength='1' key={index}  required
                  className='w-12 h-12 bg-slate-500 text-white text-center text-xl rounded-md'
                  ref={e=>inputRefs.current[index]=e}
                  onInput={(e)=> handleInput(e, index)}
                  onKeyDown={(e)=>handleKeyDown(e,index)}
                />
            ))}
        </div>
        <button className='w-full text-white py-3 rounded-full  bg-indigo-400 hover:bg-indigo-300 cursor-pointer'>Submit</button>
    </form>
</>
)}







{/* JB MTLB EMAIL B SEND HO CHUKI HO GI JIS MAIN OTP THA AND WO SUBMIT B KRDE GA ITP TB HUM US KO YE FORM DISPLAY KREN GE K NEW PASSWORD ENTER KRLO */}
{isEmailSent && isOtpSubmitted && (
<>
{/* FORM TO ENTER NEW PASSWORD */}
<form onSubmit={onSubmitNewPassword} className='bg-slate-800 p-8 rounded-lg w-96 text-sm'>
         <h1 className='text-white text-2xl font-semibold text-center mb-4'>New Password</h1>
         <p className='text-center mb-6 text-indigo-200'>Enter your new Password below</p>
         
         <div className='flex mb-4 items-center bg-[#333A5C] gap-3 w-full px-2.5 py-2.5 rounded-full'>
           <img src={assets.lock_icon} />
           <input type="password" placeholder='Password'className='text-white outline-none' value={newPasssword} onChange={e=>{setnewPasssword(e.target.value)}}  required/>

         </div>

        <button className='w-full text-white py-3 rounded-full  bg-indigo-400 hover:bg-indigo-300 cursor-pointer'>Submit</button>

      </form>
</>
)}



    </div>
  )
}

export default ResetPassword