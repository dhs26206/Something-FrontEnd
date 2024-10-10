import React from 'react';
// import './Home.css'; // Make sure to create a CSS file for styling
import axios from 'axios';
'use client'

import { useState, useEffect } from 'react'
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
        <h1 className="text-xl font-bold text-emerald-400">DeployHub</h1>
        <VscGlobe className="text-2xl" />
      </nav>
      <main className="flex-1 flex flex-col justify-center items-center p-8 text-center">
        <div className="space-y-4 mb-8">
          <h2 className="text-4xl font-bold text-emerald-400">Welcome to DeployHub</h2>
          <p className="text-xl max-w-2xl h-20">
            {displayText}
          </p>
        </div>
        <div className="flex justify-center gap-8 mb-8">
          <VscCode className="text-5xl text-emerald-400 hover:scale-110 transition-transform" />
          <VscServer className="text-5xl text-emerald-400 hover:scale-110 transition-transform" />
        </div>
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
      </main>
    </div>
  )
}