'use client'

import { useEffect, useState } from "react"
import { VscGithub, VscError, VscLoading, VscRocket } from "react-icons/vsc"

export default function Component() {
  const [repos, setRepos] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchRepos = async () => {
      try {
        const resp = await fetch('https://admin.server.ddks.live/auth/repos', {
          credentials: 'include'
        })
        if (!resp.ok) throw new Error('Failed to fetch repositories')
        const response = await resp.json()
        setRepos(response)
      } catch (error) {
        console.error('Error fetching repositories:', error)
        setError('Failed to load repositories. Please try again.')
      } finally {
        setLoading(false)
      }
    }

    fetchRepos()
  }, [])

  const handleDeploy = (repo, owner) => {
    window.location.href = `/deploy?R=${repo}&owner=${owner}`
  }

  return (
    <div className="min-h-screen w-screen bg-gray-900 text-gray-100">
      <header className="w-full h-24 flex items-center justify-center bg-gray-800 border-b border-gray-700">
        <h1 className="text-3xl font-bold text-emerald-400 flex items-center">
          <VscGithub className="mr-2" /> Your Repositories
        </h1>
      </header>
      <main className="container mx-auto px-4 py-8">
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <VscLoading className="animate-spin text-4xl text-emerald-400" />
          </div>
        ) : error ? (
          <div className="flex justify-center items-center h-64">
            <p className="text-red-400 flex items-center">
              <VscError className="mr-2" /> {error}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {repos.map((repo, index) => (
              <div
                key={index}
                onClick={() => handleDeploy(repo.repo, repo.owner)}
                className="bg-gray-800 border border-gray-700 rounded-lg p-4 cursor-pointer transition-all duration-300 hover:bg-gray-700 hover:shadow-lg hover:-translate-y-1">
                <h2 className="text-xl font-semibold mb-2 text-emerald-400">{repo.name}</h2>
                <p className="text-sm text-gray-400 mb-4">Owner: {repo.owner}</p>
                <button className={`w-full ${repo.deployed=='yes'?'text-emerald-600 border-2 border-emerald-600':'bg-emerald-600'}  text-white py-2 px-4 rounded flex items-center justify-center hover:bg-emerald-500 transition-colors`}>
                  <VscRocket className="mr-2" /> {repo.deployed=='yes'?'ReDeploy':'Deploy'}
                </button>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}