import { createContext, useState, useEffect } from "react";
import { toast } from "react-toastify";
import axios from "axios";

export const AppContext=createContext();

export const AppContextProvider=(props)=>{

    const backendUrl=import.meta.env.VITE_BACKEND_URL;
    const[isLoggedin,setisLoggedin]=useState(false);
    const[userData,setuserData]=useState(false);

    // Configure axios to send cookies with requests
    axios.defaults.withCredentials = true;

    const getUserData=async ()=>{
        try{
            const {data} =await axios.get(backendUrl + '/api/user/data')

            if(data.success){
                setuserData(data.userData);
                setisLoggedin(true);
            } else {
                toast.error(data.message);
            }
        }
        catch(error){
            toast.error(error.message);
        }
    }

    // Fetch user data on component mount
    useEffect(() => {
        getUserData();
    }, []);



    const value={
        backendUrl,
        isLoggedin,setisLoggedin,
        userData,setuserData,
        getUserData
    }

    return (
        <AppContext.Provider value={value}>
            {props.children}
        </AppContext.Provider>
    )
}