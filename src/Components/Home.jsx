'use client'

import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { FaGithub } from 'react-icons/fa'
import { VscCode, VscGlobe, VscServer } from 'react-icons/vsc'

const typingTexts = [
  "Deploy your frontend and backend with ease.",
  "Streamline your development workflow.",
  "Take control of your deployments."
]

export default function Component() {
  const [typingIndex, setTypingIndex] = useState(0)
  const [displayText, setDisplayText] = useState('')
  const [isDeleting, setIsDeleting] = useState(false)
  const [user, setUser] = useState(null)
  const [repos, setRepos] = useState([])

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await axios.get('https://admin.server.ddks.live/auth/check', { withCredentials: true })
        if (response.data.user !== "undefined") {
          setUser(response.data.user)
          const repoResponse = await axios.get('https://admin.server.ddks.live/auth/list', { withCredentials: true })
          setRepos(repoResponse.data)
          console.log('Repos:', repoResponse.data)
        }
      } catch (error) {
        console.error('Error checking auth:', error)
      }
    }

    checkAuth()
  }, [])

  useEffect(() => {
    const typingInterval = setInterval(() => {
      const currentText = typingTexts[typingIndex]
      if (!isDeleting && displayText === currentText) {
        setIsDeleting(true)
        return
      }
      if (isDeleting && displayText === '') {
        setIsDeleting(false)
        setTypingIndex((prevIndex) => (prevIndex + 1) % typingTexts.length)
        return
      }
      setDisplayText((prevText) => 
        isDeleting 
          ? prevText.slice(0, -1) 
          : currentText.slice(0, prevText.length + 1)
      )
    }, isDeleting ? 50 : 100)

    return () => clearInterval(typingInterval)
  }, [typingIndex, isDeleting, displayText])

  const handleClick = () => {
    window.location.href = "https://admin.server.ddks.live/auth/github"
  }

  return (
    <div className="bg-gray-900 w-screen text-gray-100 min-h-screen flex flex-col font-sans">
      <nav className="bg-gray-800 px-4 py-3 flex justify-between items-center">
        <h1 className="text-xl font-bold text-emerald-400">Dipola</h1>
        <VscGlobe className="text-2xl" />
      </nav>
      <main className="flex-1 flex flex-col justify-center items-center p-8 text-center">
        <div className="space-y-4 mb-8">
          <h2 className="text-4xl font-bold text-emerald-400">Welcome to Dipola</h2>
          {user ? (
            <p className="text-xl">Hi, {user}</p>
          ) : (
            <p className="text-xl max-w-2xl h-20">{displayText}</p>
          )}
        </div>
        <div className="flex justify-center gap-8 mb-8">
          <VscCode className="text-5xl text-emerald-400 hover:scale-110 transition-transform" />
          <VscServer className="text-5xl text-emerald-400 hover:scale-110 transition-transform" />
        </div>
        {!user && (
          <>
            <blockquote className="italic mb-8 max-w-2xl text-blue-400">
              "The best way to predict the future is to create it." - Peter Drucker
            </blockquote>
            <button
              onClick={handleClick}
              className="bg-emerald-500 text-gray-900 px-6 py-3 rounded-md font-bold text-lg flex items-center gap-2 hover:bg-emerald-400 transition-colors"
            >
              <FaGithub className="text-2xl" />
              Sign In With GitHub
            </button>
          </>
        )}
        {user && repos.length > 0 && (
          <div className="w-full overflow-x-auto">
            <div className="flex space-x-4 p-4">
              {repos.map((repo) => (
                <div key={repo._id} className="flex-shrink-0 w-64 bg-gray-800 p-4 rounded-lg">
                  <h3 className="text-lg font-semibold mb-2">{repo.repoName}</h3>
                  <a
                    href={`https://${repo.uniqueId}.server.ddks.live`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-emerald-500 text-gray-900 px-4 py-2 rounded-md font-bold text-sm inline-block hover:bg-emerald-400 transition-colors"
                  >
                    View
                  </a>
                </div>
              ))}
            </div>
            
          </div>
          
        )}
        {user &&(
          <button
          onClick={()=>{window.location.href = "https://frontend.server.ddks.live/repo"}}
          className="bg-emerald-500 text-gray-900 px-6 py-3 rounded-md font-bold text-lg flex items-center gap-2 hover:bg-emerald-400 transition-colors"
        >
          <FaGithub className="text-2xl" />
          Deploy New
        </button>
        )}
      </main>
    </div>
  )
}