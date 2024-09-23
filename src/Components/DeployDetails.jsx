
import axios from "axios";
import { useCallback, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
const Details=()=>{
    const { search } = useLocation();
    const navigate = useNavigate();
    const [Code,setCode]=useState("");
    useEffect(()=>{
        const func=async ()=>{
            const queryParams = new URLSearchParams(search);
            const code = queryParams.get('R');
            console.log("Got the code"+code);
            setCode(code);
    }
    func();
    })
    const [details,setDetails]=useState({buildCommand:"",buildDirectory:"",code:Code});
    const handleUpdate=useCallback((e)=>{
        const { name, value } = e.target;
        setDetails((prevFormData) => ({
            ...prevFormData,
            [name]: value
        }))},[setDetails]);
    const handleFinalDeploy=async()=>{
        const data=JSON.stringify(details);
        const res=await axios.post('https://admin.server.ddks.live/deploy',{
            body: data,
            credentials: "include",
            
        })
        

    }
    return(
        <div className="h-screen w-screen">
            <div className="w-full h-[15%] flex justify-center items-center text-3xl font-bold">Deployment Details</div>
                <div className="w-full h-[75%] flex items-center justify-center ">
                   <div className="w-[50%]">
                    <div className="w-1/2 h-16">
                            <span className="w-full"> Build Command</span>
                            <span className="w-full "><input  onChange={()=>handleUpdate(e)} name="buildCommand" className="w-full" type="text" placeholder="npm run build" /></span>
                        </div>
                        <div className="w-1/2 h-16">
                            <span className="w-full ">Build Directory</span>
                            <span className="w-full "><input  onChange={()=>handleUpdate(e)} name="buildDirectory" className="w-full" type="text" placeholder="build" /></span>
                        </div>
                   </div>
                </div>
            <div onClick={()=>handleFinalDeploy()} className="w-[10%] rounded-lg flex justify-center items-center h-8 bg-red-600 hover:bg-red-400">Submit</div>
        </div>
    )    
}

export default Details;