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
                // don't spam toast for expected unauthenticated state
                // (data.message may be 'Not Authorized' when no cookie/token present)
                console.debug('getUserData:', data.message);
            }
        }
        catch(error){
            // only show unexpected server errors
            const status = error?.response?.status;
            if(!status || status >= 500){
                toast.error(error.message);
            } else {
                console.debug('getUserData error:', error?.response?.data || error.message);
            }
        }
    }



    

    const getAuthState= async()=>{
        try{
            const {data} =await axios.get(backendUrl + '/api/auth/is-authenticated')

             if(data.success){
                setisLoggedin(true);
                getUserData();
            } else {
                console.debug('getAuthState:', data.message);
            }
            

        }
        catch(error){
            const status = error?.response?.status;
            if(!status || status >= 500){
                toast.error(error.message);
            } else {
                console.debug('getAuthState error:', error?.response?.data || error.message);
            }
        }
     }

 




    // Do not call getUserData on mount directly — only fetch after auth check


    
    //get authentication state on every reload
    useEffect(() => {
        getAuthState();
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