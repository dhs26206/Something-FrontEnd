import React, { useState, useEffect, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { VscRocket, VscCode, VscFolder, VscLoading } from 'react-icons/vsc';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
export default function Details() {
  const { search } = useLocation();
  const navigate = useNavigate();
  const [credential, setCredential] = useState({ repo: "", owner: "" });
  const [details, setDetails] = useState({ buildCommand: "", buildDirectory: "" ,deploymentType: 'frontend'});
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [deploymentProgress, setDeploymentProgress] = useState(100);
  const [showProgress, setShowProgress] = useState(false);
  const  obj= {100:"Waiting for Deployment",200:"Cloning Repository",300:"Installing Dependencies",400:"Building Project",500:"Optimizing Assets",600:"Deployment Complete"}
  const [subDomain, setSubDomain] = useState('frontend');
  const [deployedOrNew, setDeployedOrNew] = useState('new');
  useEffect(() => {
    const func = async () => {
      const queryParams = new URLSearchParams(search);
      const repo = queryParams.get('R');
      const owner = queryParams.get('owner');
      setCredential({ repo, owner });
    };
    func();
  }, [search, navigate]);

  const handleInputChange = useCallback((e) => {
    const { name, value } = e.target;
    setDetails((prevFormData) => ({
      ...prevFormData,
      [name]: value
    }));
  }, []);
  const handleDeploymentTypeChange = (value) => {
    setDetails({ ...details, deploymentType: value })
  }
  const pollDeploymentStatus = useCallback((repoId) => {
    let progress = 0; // Initialize progress locally, not resetting it each time
  
    const intervalId = setInterval(async () => {
      try {
        const response = await axios.post(
          'https://admin.server.ddks.live/auth/status',
          { Id: repoId },
          { withCredentials: true }
        );
        
        progress = response.data.Status;
        setDeploymentProgress(progress);
  
        // Stop polling if progress reaches 600
        if (progress >= 600) {
          clearInterval(intervalId);
          setDeployedOrNew('deployed');
          setSubDomain(repoId)
          setShowProgress(false);
          // Optionally, handle success logic here
        }
      } catch (error) {
        console.error('Error polling deployment status:', error);
        setError('Failed to get deployment status. Please check manually.');
        clearInterval(intervalId); // Stop polling on error
        setShowProgress(false);
      }
    }, 1000); // Poll every 1 second
  }, []);
  
  const handleFinalDeploy = async () => {
    setIsLoading(true);
    setError(null);
    setShowProgress(true);
    setDeploymentProgress(0);
    try {
      const data = JSON.stringify(details);
      const res = await axios.post(
        `https://admin.server.ddks.live/auth/download/${credential.owner}/${credential.repo}`,
        data,
        {
          headers: {
            'Content-Type': 'application/json',
          },
          withCredentials: true,
        }
      );
      console.log('Response:',res.data.repoId);
      pollDeploymentStatus(res.data.repoId); // Start polling for status
    } catch (error) {
      console.error('Error during deployment:', error);
      setError('Deployment failed. Please try again.');
      setShowProgress(false);
    } finally {
      setIsLoading(false);
    }
  };

  const getProgressPercentage = (progress) => {
    return (progress / 600) * 100;
  };

  return (
    <div className="min-h-screen w-screen bg-gray-900 text-gray-100">
      <nav className="bg-gray-800 p-4 shadow-md border-b border-gray-700">
        <div className="container mx-auto flex items-center justify-between px-4">
          <div className="flex items-center space-x-2">
            <VscRocket className="text-3xl text-emerald-400" />
            <span className="text-2xl font-bold text-emerald-400">DeployHub</span>
          </div>
          <h1 className="text-xl font-semibold">Deployment Details</h1>
        </div>
      </nav>

      <main className="container mx-auto mt-10 p-4">
        <div className="max-w-4xl mx-auto bg-gray-800 rounded-lg shadow-lg p-8 border border-gray-700">
          <h2 className="text-2xl font-bold mb-6 text-center text-emerald-400">Configure Your Deployment</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label htmlFor="deploymentType" className="block text-sm font-medium text-gray-300">
                Deployment Type
              </label>
              <Select onValueChange={handleDeploymentTypeChange} defaultValue={details.deploymentType}>
                <SelectTrigger className="w-full bg-gray-700 border-gray-600 text-gray-200">
                  <SelectValue placeholder="Select deployment type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="frontend">Frontend</SelectItem>
                  <SelectItem value="backend">Backend</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label htmlFor="buildCommand" className="block text-sm font-medium text-gray-300">
                {details.deploymentType === 'backend' ? 'Start Script' : 'Build Command'}
              </label>
              <div className="relative">
                <VscCode className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  id="buildCommand"
                  name="buildCommand"
                  type="text"
                  placeholder={details.deploymentType === 'backend' ? 'npm start' : 'npm run build'}
                  value={details.buildCommand}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                />
              </div>
            </div>
            {details.deploymentType === 'frontend' && (
              <div className="space-y-2">
                <label htmlFor="buildDirectory" className="block text-sm font-medium text-gray-300">
                  Build Directory
                </label>
                <div className="relative">
                  <VscCode className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    id="buildDirectory"
                    name="buildDirectory"
                    type="text"
                    placeholder="build"
                    value={details.buildDirectory}
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  />
                </div>
              </div>
            )}
            
          </div>
          {details.deploymentType === 'backend' && (
              //Instruction to specify port number as process.env.PORT
              <div className='mt-4 w-full bg-[#7b11117a] py-4 px-2  border-2 border-red-200 rounded-xl'>
                <div>
                  Note : To Run Your Node Backend Application, Make Sure to Use <span onClick={() => window.open("https://developerport.medium.com/understanding-process-env-port-in-node-js-e09aef80384c", "_blank")}className='text-emerald-400 cursor-pointer'>process.env.PORT</span> as the Port Number in Your Application. Else, Your Application Will Not Run.
                </div>
              </div>
            )}
          {error && (
            <div className="mt-4 text-red-400 text-center">
              {error}
            </div>
          )}
          {showProgress && (
            <div className="mt-8 space-y-4">
              <div className="w-full bg-gray-700 rounded-full h-2.5">
                <div 
                  className="bg-emerald-600 h-2.5 rounded-full transition-all duration-500 ease-out" 
                  style={{ width: `${getProgressPercentage(deploymentProgress)}%` }}
                ></div>
              </div>
              <div className="flex justify-between">
                {[100, 200, 300, 400, 500, 600].map((stage) => (
                  <div 
                    key={stage} 
                    className={`w-4 h-4 rounded-full ${deploymentProgress >= stage ? 'bg-emerald-600' : 'bg-gray-600'}`}
                  ></div>
                ))}
              </div>
              <p className="text-center text-emerald-400 font-semibold">
                {obj[deploymentProgress]}
              </p>
            </div>
          )}
          <div className="mt-8 flex justify-center">
            <button
              onClick={handleFinalDeploy}
              disabled={isLoading || showProgress}
              className={`${deployedOrNew === 'new' ? '' : 'cursor-not-allowed hidden'} px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-md transition duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 focus:ring-offset-gray-800 disabled:opacity-50 disabled:cursor-not-allowed flex items-center`}
            >
              {isLoading ? (
                <>
                  <VscLoading className="animate-spin mr-2" />
                  Deploying...
                </>
              ) : (
                <>
                  <VscRocket className="mr-2" />
                  Submit Deployment Details
                </>
              )}
            </button>
          </div>
          <div key={deploymentProgress} className={`${deploymentProgress === 600 ? '' : 'hidden'}`}>
            <div className="mt-4 text-green-400 text-center">
              Deployment Successful <span id='Green Tick'>✔️</span>
            </div>
            <div className='cursor-pointer hover:text-green-500 text-green-200 text-center'>
              <a href={`https://${subDomain}.server.ddks.live`}>See Deployment</a>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}