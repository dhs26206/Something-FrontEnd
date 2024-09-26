import React from 'react';
// import './Home.css'; // Make sure to create a CSS file for styling
import axios from 'axios';
const Home = () => {
    const handleClick=()=>{
        // axios.get('https://admin.server.ddks.live')
        window.location.href="https://admin.server.ddks.live/auth/github"
    }

    return (
        <div>
            <nav className="navbar">
                <h1>My App</h1>
            </nav>
            <div className="home-container">
                <button onClick={()=>handleClick()} className="github-button">
                    <img src="https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png" alt="GitHub Logo" className="github-logo" />
                    Sign In With Github
                </button>
            </div>
        </div>
    );
};

export default Home;