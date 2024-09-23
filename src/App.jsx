import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import routes from './routes';
import { useEffect } from 'react';


function App() {
  
  return (
    <Router>
      <Routes>
        {/* <Route path="/" element={<Layout />}> */}
          {routes.map((route, index) => (
            <Route key={index} path={route.path} element={route.element} />
          ))}
        {/* </Route> */}
      </Routes>
    </Router>
  );
}

export default App
