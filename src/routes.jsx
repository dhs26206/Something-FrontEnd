import Details from "./Components/DeployDetails"
import Expand from "./Components/Expand"
import Home from "./Components/Home"
import Repo from "./Components/Repo"

const routes=[
    { path: '/', element: <Home/> },
    { path: '/Repo', element: <Repo/> },
    { path: '/Deploy', element: <Details/> },
    { path: '/Expand/:id', element: <Expand/> },

]

export default routes;
