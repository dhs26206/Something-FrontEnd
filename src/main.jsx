import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './index.css'
// import Home from './Components/Home.jsx'
// import Repo from './Components/Repo.jsx'
// import Details from './Components/DeployDetails.jsx'
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
   
  </StrictMode>,
)
