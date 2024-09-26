import { useEffect, useState } from "react"

const Repo=()=>{
    const[Repos,setRepos]=useState([]);
    useEffect(() => {
        const fetchRepos = async () => {
          try {
            const resp = await fetch('https://admin.server.ddks.live/auth/repos', {
              credentials: 'include'
            });
            const response = await resp.json();
            setRepos(response);
          } catch (error) {
            console.error('Error fetching repositories:', error);
          }
        };
      
        fetchRepos(); // Call the async function
      }, []);

    const handleDeploy=(e,k)=>{
        window.location.href="/deploy?R="+e+'&owner='+k;
    }
    return(
        <div className="h-screen w-screen">
            <div className="w-full h-[15%] flex items-center justify-center text-3xl font-bold bg-gray-800">Your Repos</div>
            <div className="w-full h-[85%] overflow-y-scroll flex justify-center">
                <div className="h-[90%] w-[90%] flex gap-4 flex-wrap overflow-y-scroll">
                    {Repos.map((element,index)=>{
                        return(
                            <div id={index} onClick={()=>handleDeploy(element.repo,element.owner)} className=" cursor-pointer w-[19%] h-[19%] border-2 text-2xl font-white border-white shadow-lg hover:bg-green-900">
                                {element.name}
                            </div>
                        )
                    })}
                </div>
            </div>
        </div>
    )
}

export default Repo;