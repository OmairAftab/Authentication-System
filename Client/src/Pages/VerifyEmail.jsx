import React from 'react'
import { assets } from '../assets/mern-assets/assets'
import {useNavigate} from 'react-router-dom'
import { useContext } from 'react'
import { AppContext } from '../Context/AppContext'
import { toast } from 'react-toastify'
import axios from 'axios'
import { useEffect } from 'react'


const VerifyEmail = () => {

    const navigate=useNavigate()
    const inputRefs= React.useRef([]) //it is used to store references of multiple input boxes
    const {backendUrl,isLoggedin,userData,getUserData}=useContext(AppContext)
    axios.defaults.withCredentials = true;




//FUNCTION THAT WILL HANDLE INPUT WHEN WE TYPE OTP IN THOSE 6 BOXES
    const handleInput=(e,index)=>{
      if(e.target.value.length > 0 && index < inputRefs.current.length-1){ //If user typed something and this is not the last input, then move focus to the next box.
        inputRefs.current[index+1].focus() //jb hum aik field main number likh len ge to automatically next box pe focus ho jae ga and now we can type in next box
      }
    }




// FUNCTION THAT HANDLES IF USER PRESSES BACKSPACE ON AN EMPTY INPUT, IT MOVES FOCUS TO THE PREVIOUS INPUT BOX (EXCEPT WHEN IT IS THE FIRST INPUT), AND THE LAST INPUT BEHAVES LIKE A NORMAL INPUT.
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




//FUNCTIONLITY APPLY ON "VERIFY EMAIL BUTTON" TO VERIFY THE OTP 

    const onSubmitHandler= async (e)=>{
      try{
        e.preventDefault();
        const otpArray=inputRefs.current.map(e=>e.value)
        const otp=otpArray.join('')

        //now send this otp to backend to verify otp
        const {data} = await axios.post(backendUrl + '/api/auth/verify-account' , {otp})
        
        if(data.success){ //if this run mean otp is correct and account is verified
          toast.success(data.message)
          getUserData()
          navigate('/')
        }
        else{
          toast.error(data.message)
        }

      }
      catch(error){
        const message = error?.response?.data?.message || error?.message || 'Something went wrong'
        toast.error(message)
      }
    }







//AGAR USER KA EMAIL VERIFIED HO AND WO /verify-email WALA ROUTE ACCESS KRNA CHAHE TO NA KRNE DO and HOME PAGE PE REDIRECT KRDO
    useEffect(()=>{
      isLoggedin && userData && userData.isVerified && navigate('/')
    },[isLoggedin,userData])






  return (
    <div className="flex items-center justify-center min-h-screen px-6 sm:px-0 bg-[radial-gradient(circle_at_top,#ede9fe,#ffffff,#f5f3ff)]">

      <img src={assets.logo} onClick={()=>{navigate('/')}} alt=""  className='absolute left-5 sm:left-20 top-5 w-28 sm:w-32 cursor-pointer'/>
      
      <form onSubmit={onSubmitHandler} className='bg-slate-800 p-8 rounded-lg w-96 text-sm'>
        <h1 className='text-white text-2xl font-semibold text-center mb-4'>Verify Email otp</h1>
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
        <button className='w-full text-white py-3 rounded-full  bg-indigo-400 hover:bg-indigo-300 cursor-pointer'>Verify Email</button>
      </form>
    </div>
  )
}

export default VerifyEmail