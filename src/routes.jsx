import Details from "./Components/DeployDetails"
import Home from "./Components/Home"
import Repo from "./Components/Repo"

const routes=[
    { path: '/', element: <Home/> },
    { path: '/Repo', element: <Repo/> },
    { path: '/Details', element: <Details/> },

]

export default routes;
