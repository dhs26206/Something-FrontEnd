import React from "react";
import axios from "axios";
import { useCallback, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
// import { Package2 } from "lucide-react";
const Details=()=>{
    const { search } = useLocation();
    const navigate = useNavigate();
    const [Credential,setCode]=useState({repo:"",owner:""});
    useEffect(()=>{
        const func=async ()=>{
            const queryParams = new URLSearchParams(search);
            const repo = queryParams.get('R');
            const owner=queryParams.get('owner');
            setCode({repo,owner})
            // console.log("Got the code"+code);
            // setCode(code);
            // console.log(Credential.repo,Credential.owner)
    }
    func();
    },[navigate])
    const [details,setDetails]=useState({buildCommand:"",buildDirectory:""});
    const handleInputChange=useCallback((e)=>{
        const { name, value } = e.target;
        setDetails((prevFormData) => ({
            ...prevFormData,
            [name]: value
        }))},[setDetails]);
    const handleFinalDeploy = async () => {
        try {
            const data = JSON.stringify(details);
            const res = await axios.post(
            `https://admin.server.ddks.live/auth/download/${Credential.owner}/${Credential.repo}`,
            data, // The body (payload) goes here
            {
                headers: {
                'Content-Type': 'application/json', // Set the content type to JSON
                },
                withCredentials: true, // Include credentials like cookies
                }
              );
              console.log('Response:', res.data);
            } catch (error) {
              console.error('Error during deployment:', error);
            }
          };    
    return (
        <div className="min-h-screen w-full bg-gray-800 text-gray-200">
          {/* Navbar */}
          <nav className="bg-gray-900 p-4 shadow-md">
            <div className="container mx-auto flex items-center justify-between px-4 md:px-8 lg:px-12">
              <div className="flex items-center space-x-2">
                <span className="text-2xl font-bold text-gray-300">SampleLogo</span>
              </div>
              <h1 className="text-xl font-semibold text-gray-300">Deployment Details</h1>
            </div>
          </nav>
      
          {/* Main Content */}
          <main className="container mx-auto mt-10 p-4 md:p-8 lg:p-12">
            <div className="max-w-4xl mx-auto bg-gray-700 rounded-lg shadow-lg p-8 md:p-12">
              <h2 className="text-2xl font-bold mb-6 text-center text-gray-300">Configure Your Deployment</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label htmlFor="buildCommand" className="block text-sm font-medium text-gray-400">
                    Build Command
                  </label>
                  <input
                    id="buildCommand"
                    name="buildCommand"
                    type="text"
                    placeholder="npm run build"
                    value={details.buildCommand}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 bg-gray-600 border border-gray-500 rounded-md text-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-400"
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="buildDirectory" className="block text-sm font-medium text-gray-400">
                    Build Directory
                  </label>
                  <input
                    id="buildDirectory"
                    name="buildDirectory"
                    type="text"
                    placeholder="build"
                    value={details.buildDirectory}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 bg-gray-600 border border-gray-500 rounded-md text-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-400"
                  />
                </div>
              </div>
              <div className="mt-8 flex justify-center">
                <button
                  onClick={() => handleFinalDeploy()}
                  className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-md transition duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-700"
                >
                  Submit Deployment Details
                </button>
              </div>
            </div>
          </main>
        </div>
      );
}
      
export default Details;