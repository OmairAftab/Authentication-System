import React, { useContext } from 'react'
import { assets } from '../assets/mern-assets/assets'
import { AppContext } from '../Context/AppContext'

const Header = () => {

  const {userData} =useContext(AppContext)

  return (
    <div className='flex flex-col items-center text-center text-gray-800'> 

        <img src={assets.header_img} alt="" className='w-36 h-36 rounded-full mt-4' />

        <h1 className='flex gap-1 text-xl sm:text-3xl font-medium mb-3'>Hey {userData   ? userData.name : 'Developer'}
            
            <img src={assets.hand_wave} alt="" className='w-8 aspect-square'/>
        
        </h1>

        <h2 className='text-3xl sm:text-5xl mb-4 font-semibold'>Welcome to our app</h2>

        <p className='mb-8 max-w-md text-2xl'>This is an authentication app where users can register, login , verify email and reset password.</p>

        <button className='border border-gray-500 rounded-full px-8 py-3 hover:bg-gray-100 transition-all cursor-pointer'>Get Started</button>
    </div>
  )
}

export default Header