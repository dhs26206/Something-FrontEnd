import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { VscRocket, VscCode, VscFolder, VscLoading, VscTerminal } from 'react-icons/vsc';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function Details() {
  const { search } = useLocation();
  const navigate = useNavigate();
  const [credential, setCredential] = useState({ repo: "", owner: "" });
  const [details, setDetails] = useState({ buildCommand: "", buildDirectory: "", deploymentType: 'frontend' });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [deploymentProgress, setDeploymentProgress] = useState(100);
  const [showProgress, setShowProgress] = useState(false);
  const [subDomain, setSubDomain] = useState('frontend');
  const [deployedOrNew, setDeployedOrNew] = useState('new');
  const [logs, setLogs] = useState([]);
  const [showLogs, setShowLogs] = useState(false);

  const positionRef = useRef(0);
  const logsEndRef = useRef(null);

  const obj = {
    100: "Waiting for Deployment",
    200: "Cloning Repository",
    300: "Installing Dependencies",
    400: "Building Project",
    500: "Optimizing Assets",
    600: "Deployment Complete"
  };

  useEffect(() => {
    const func = async () => {
      const queryParams = new URLSearchParams(search);
      const repo = queryParams.get('R');
      const owner = queryParams.get('owner');
      setCredential({ repo, owner });
    };
    func();
  }, [search, navigate]);

  useEffect(() => {
    if (logsEndRef.current) {
      logsEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [logs]);

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
   
  
    const statusIntervalIdStatus = setInterval(async () => {
      try {
        const response = await axios.post(
          'https://admin.server.ddks.live/auth/status',
          { Id: repoId },
          { withCredentials: true }
        );
        
        const { Status} = response.data;
        console.log("Received Status "+Status); 
        setDeploymentProgress(Status);
        console.log("Updated Status "+deploymentProgress);
        if (Status >= 600) {
          clearInterval(statusIntervalIdStatus);
          setDeployedOrNew('deployed');
          setSubDomain(repoId);
          setShowProgress(false);
        }
      } catch (error) {
        console.error('Error polling deployment status:', error);
        setError('Failed to get deployment status. Please check manually.');
        clearInterval(statusIntervalIdStatus);
        setShowProgress(false);
      }
    }, 1000);

    return () => {
      clearInterval(statusIntervalIdStatus);
    };
  }, []);

  const pollDeploymentLogs = (repoId)=>{
    let url=`https://admin.server.ddks.live/auth/logs/${credential.owner}/${credential.repo}`;
    console.log(url+" "+credential.owner+" "+credential.repo); 
    const statusIntervalId = setInterval(async () => {
      try {
        const response = await axios.post(
          url,
          { Id: repoId,index:positionRef.current,type:0 },  //type 0 means only current logs
          { withCredentials: true }
        );
        
        const { newLogs ,newPosition,Status} = response.data;
      
        positionRef.current=newPosition;
        
        if (newLogs) {
          setLogs(prevLogs => [...prevLogs, ...newLogs.split('\n')]);
        }
  
        if (Status >= 600) {
          clearInterval(statusIntervalId);
          setDeployedOrNew('deployed');
          setSubDomain(repoId);
          setShowProgress(false);
        }
      } catch (error) {
        console.error('Error polling deployment status:', error);
        setError('Failed to get deployment status. Please check manually.');
        clearInterval(statusIntervalId);
        setShowProgress(false);
      }
    }, 5000);

    return () => {
      clearInterval(statusIntervalId);
    };
  };

  const handleFinalDeploy = async () => {
    setIsLoading(true);
    setError(null);
    setShowProgress(true);
    setDeploymentProgress(0);
    setLogs([]);
    setShowLogs(true);
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
      console.log('Response:', res.data.repoId);
      pollDeploymentLogs(res.data.repoId);
      pollDeploymentStatus(res.data.repoId);
    } catch (error) {
      console.error('Error during deployment:', error);
      setError('Deployment failed. Please try again.');
      setDeploymentProgress(630);
      setShowProgress(false);
      setShowLogs(false);
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
            <span className="text-2xl font-bold text-emerald-400">Dipola</span>
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
            <div className='mt-4 w-full bg-[#7b11117a] py-4 px-2  border-2 border-red-200 rounded-xl'>
              <div>
                Note : To Run Your Node Backend Application, Make Sure to Use <span onClick={() => window.open("https://developerport.medium.com/understanding-process-env-port-in-node-js-e09aef80384c", "_blank")} className='text-emerald-400 cursor-pointer'>process.env.PORT</span> as the Port Number in Your Application. Else, Your Application Will Not Run.
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
          {showLogs && (
           <div className="mt-8 bg-black p-4 rounded-lg overflow-auto h-64 flex flex-col">
           <div className="flex items-center mb-2">
             <VscTerminal className="mr-2 text-emerald-400" />
             <span className="text-emerald-400 font-semibold">Deployment Logs</span>
           </div>
           <div className="flex-grow overflow-auto">
             {logs.map((log, index) => (
               <div key={index} className="text-gray-300 font-mono text-sm">
                 {log}
               </div>
             ))}
             <div ref={logsEndRef} />
           </div>
         </div>
          )}
          <div key={logsEndRef.current} className={`${deploymentProgress === 600 ? '' : 'hidden'}`}>
            <div className="mt-4 text-green-400 text-center">
              Deployment Successful <span id='Green Tick'>✔️</span>
            </div>
            <div className='cursor-pointer hover:text-green-500 text-green-200 text-center'>
              <a href={`https://${subDomain}.server.ddks.live`} target='_blank' rel='noopener noreferrer'>See Deployment</a>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}