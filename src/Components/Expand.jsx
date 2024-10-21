import React, { useEffect, useState } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { VscRocket, VscCode, VscTerminal, VscTrash } from 'react-icons/vsc'
import { useParams } from 'react-router-dom'
import axios from 'axios'

function convertToIST(utcTime) {
    // Create a Date object from the UTC time string
    const date = new Date(utcTime);
  
    // Specify options to format the date in IST
    const options = {
      timeZone: 'Asia/Kolkata', // IST timezone
      year: 'numeric',
      month: 'short', // 'short' gives the month name like 'Oct'
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      hour12: true // To get 12-hour format with AM/PM
    };
  
    // Format the date according to the options
    const formattedDate = date.toLocaleString('en-IN', options);
  
    return formattedDate;
  }
export default function ExpandSection() {
    const { id } = useParams();
  const [deploymentDetails, setDeploymentDetails] = useState({
    repoName: 'My Awesome Project',
    type: 0, // 0 for Frontend, 1 for Backend
    buildCommand: 'npm run build',
    buildDirectory: 'build',
    htmlURL:"https://github.com",
    private:true,
    createdDate:"2021-09-01",
    updatedDate:"2021-09-01",
    owner:"Undefined"
  })
  const [logs, setLogs] = useState(["Building...", "Build successful", "Deploying..."])
  useEffect(() => {
    // Fetch deployment details from the server
    const fetchDeploymentDetails = async () => {
      try {
        // First API call to fetch deployment details
        const response = await axios.get(
          `https://admin.server.ddks.live/auth/details/${id}`,
          { withCredentials: true }
        );
        
        // Set deployment details
        setDeploymentDetails(response.data);
  
        // Extract necessary fields for the second API call
        const { owner, repoName } = response.data;
  
        try {
          // Second API call to fetch deployment logs
          const responseLogs = await axios.post(
            `https://admin.server.ddks.live/auth/logs/${owner}/${repoName}`,
            { type: 1, Id:id, index: 0 },
            {withCredentials: true},
            
          );
  
          // Update logs state with new logs, splitting by newline
          setLogs(responseLogs.data.newLogs.split('\n'));
        } catch (error) {
          console.error('Error fetching deployment logs:', error);
        }
      } catch (error) {
        console.error('Error fetching deployment details:', error);
      }
    };
  
    fetchDeploymentDetails();
  }, [id]); // Added `id` in the dependency array to re-fetch when the `id` changes
  
  const handleRedeploy = () => {
    console.log('Redeploying...')
    window.location.href = `/deploy?R=${deploymentDetails.repoName}&owner=${deploymentDetails.owner}`
    // Add redeploy logic here
  }

  const handleDelete = () => {
    console.log('Deleting...')
    const deleteDeployment = async () => {
        try {
            const response = await axios.delete(`https://admin.server.ddks.live/auth/delete/${id}`, { withCredentials: true })
            console.log(response.data)
            window.location.href = '/'
        } catch (error) {
            console.error('Error deleting deployment:', error)
        }
        }
    // Add delete logic here
  }

  return (
    <div className="flex h-[calc(100vh-4rem)] w-screen bg-gray-900">
      <Tabs defaultValue="details" className="flex w-full" orientation="vertical">
        <TabsList className="w-64 h-full bg-gray-900 text-gray-100 flex flex-col items-stretch">
          <TabsTrigger value="details" className="justify-start px-4 py-2 data-[state=active]:bg-emerald-600 "  >
            <VscCode className="mr-2" />
            Details
          </TabsTrigger>
          <TabsTrigger value="logs" className="justify-start px-4 py-2 data-[state=active]:bg-emerald-600 ">
            <VscTerminal className="mr-2" />
            Logs
          </TabsTrigger>
          <TabsTrigger value="edit" className="justify-start px-4 py-2 data-[state=active]:bg-emerald-600 ">
            <VscRocket className="mr-2" />
            Edit/Delete
          </TabsTrigger>
        </TabsList>
        <div className="flex-1 p-6 ">
          <Card className="w-full h-full">
            <CardContent className="p-6">
              <TabsContent value="details" className="mt-0 ">
                <ScrollArea className="h-[calc(100vh-8rem)] flex flex-col ">
                  <h1 className="text-3xl font-bold w-full flex justify-center  text-emerald-600 mb-4"><span className='text-gray-900'>Repo Name :</span> {deploymentDetails.repoName}</h1>
                  <h2 className="text-xl font-semibold mb-2">
                    Type: {deploymentDetails.type === 0 ? 'Frontend' : 'Backend'}
                  </h2>
                  <div className="space-y-2">
                    <p>
                      <strong>{deploymentDetails.type === 0 ? 'Build Command:' : 'Start Command:'}</strong>{' '}
                      {deploymentDetails.buildCommand}
                    </p>
                    {deploymentDetails.type === 0 && (
                      <p>
                        <strong>Build Directory:</strong> {deploymentDetails.buildDirectory}
                      </p>
                    )}
                    <p>
                      <strong>HTML URL:</strong> <a href={`${deploymentDetails.htmlURL}`} target='_blank' rel='noopener noreferrer'> {deploymentDetails.htmlURL}</a>    
                    </p>
                    <p>
                      <strong>Private:</strong> {deploymentDetails.private?'Yes':'No'}
                    </p>
                    <p>
                      <strong>Created Date:</strong> {convertToIST(deploymentDetails.createdDate)}
                    </p>
                    <p>
                      <strong>Updated Date:</strong> {convertToIST(deploymentDetails.updatedDate)}    
                    </p>

                  </div>
                </ScrollArea>
              </TabsContent>
              <TabsContent value="logs" className="mt-0">
                <ScrollArea className="h-[calc(100vh-8rem)] bg-gray-900 text-emerald-400 p-4 rounded-lg font-mono">
                  <div className="flex items-center mb-2">
                    <VscTerminal className="mr-2" />
                    <span className="font-semibold">Deployment Logs</span>
                  </div>
                  {logs.map((log, index) => (
                    <div key={index} className="text-sm">{log}</div>
                  ))}
                </ScrollArea>
              </TabsContent>
              <TabsContent value="edit" className="mt-0">
                <ScrollArea className="h-[calc(100vh-8rem)]">
                  <p className="text-gray-600 mb-4">
                    Currently, we don't have a feature for editing. You have to delete in order to change commands.
                  </p>
                  <div className="flex gap-4">
                    <Button onClick={handleRedeploy} className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white">
                      <VscRocket className="mr-2" /> Redeploy
                    </Button>
                    <Button onClick={handleDelete} variant="destructive" className="flex-1">
                      <VscTrash className="mr-2" /> Delete
                    </Button>
                  </div>
                </ScrollArea>
              </TabsContent>
            </CardContent>
          </Card>
        </div>
      </Tabs>
    </div>
  )
}