import React, { useCallback, useEffect, useState } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import { VscRocket, VscCode, VscFolder, VscLoading } from "react-icons/vsc";

export default function Details() {
  const { search } = useLocation();
  const navigate = useNavigate();
  const [credential, setCredential] = useState({ repo: "", owner: "" });
  const [details, setDetails] = useState({ buildCommand: "", buildDirectory: "" });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

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

  const handleFinalDeploy = async () => {
    setIsLoading(true);
    setError(null);
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
      console.log('Response:', res.data);
      // You might want to navigate to a success page or show a success message here
    } catch (error) {
      console.error('Error during deployment:', error);
      setError('Deployment failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
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
              <label htmlFor="buildCommand" className="block text-sm font-medium text-gray-300">
                Build Command
              </label>
              <div className="relative">
                <VscCode className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  id="buildCommand"
                  name="buildCommand"
                  type="text"
                  placeholder="npm run build"
                  value={details.buildCommand}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                />
              </div>
            </div>
            <div className="space-y-2">
              <label htmlFor="buildDirectory" className="block text-sm font-medium text-gray-300">
                Build Directory
              </label>
              <div className="relative">
                <VscFolder className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
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
          </div>
          {error && (
            <div className="mt-4 text-red-400 text-center">
              {error}
            </div>
          )}
          <div className="mt-8 flex justify-center">
            <button
              onClick={handleFinalDeploy}
              disabled={isLoading}
              className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-md transition duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 focus:ring-offset-gray-800 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
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
        </div>
      </main>
    </div>
  );
}