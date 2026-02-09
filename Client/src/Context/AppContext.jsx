import { createContext, useState } from "react";

export const AppContext=createContext();

export const AppContextProvider=(props)=>{

    const backendUrl=import.meta.env.VITE_BACKEND_URL;
    const[isLoggedin,setisLoggedin]=useState(false);
    const[userData,setuserData]=useState(false);


    const value={
        backendUrl,
        isLoggedin,setisLoggedin,
        userData,setuserData
    }

    return (
        <AppContext.Provider value={value}>
            {props.children}
        </AppContext.Provider>
    )
}