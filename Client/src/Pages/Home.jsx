import React from 'react'
import Navbar from '../Components/Navbar'
import Header from '../Components/Header'


const Home = () => {
  return (
    <div className='flex flex-col items-center justify-center min-h-screen bg-[url("bg_img.png")] bg-center bg-cover'>

    <Navbar />
    <Header />


    </div>
  )
}

export default Home