import { useState } from 'react'

function App() {
  const [originalUrl, setOriginalUrl] = useState('')
  const [shortUrl, setShortUrl] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [copied, setCopied] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setShortUrl('')
    setLoading(true)

    try {
      const response = await fetch('http://localhost:8080/api/shorten', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ originalUrl }),
      })

      if (!response.ok) {
        throw new Error('Something went wrong')
      }

      const data = await response.json()
      setShortUrl(data.shortUrl)
    } catch (err) {
      setError('Failed to shorten URL. Try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(shortUrl)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 flex items-center justify-center px-4">
      <div className="w-full max-w-xl">
        <h1 className="text-5xl font-bold text-white text-center mb-2">
          Snippy
        </h1>
        <p className="text-gray-300 text-center mb-8">
          Shorten your long URLs in seconds
        </p>

        <form onSubmit={handleSubmit} className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 shadow-xl">
          <div className="flex flex-col sm:flex-row gap-3">
            <input
              type="url"
              required
              placeholder="Paste your long URL here..."
              value={originalUrl}
              onChange={(e) => setOriginalUrl(e.target.value)}
              className="flex-1 px-4 py-3 rounded-lg bg-white/90 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-400"
            />
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-lg transition disabled:opacity-50"
            >
              {loading ? 'Shortening...' : 'Shorten'}
            </button>
          </div>
        </form>

        {error && (
          <p className="text-red-400 text-center mt-4">{error}</p>
        )}

        {shortUrl && (
          <div className="mt-6 bg-white/10 backdrop-blur-lg rounded-2xl p-6 shadow-xl flex items-center justify-between gap-4">
            
             <a href={shortUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-purple-300 font-medium text-lg truncate hover:underline"
            >
              {shortUrl}
            </a>
            <button
              onClick={handleCopy}
              className="px-4 py-2 bg-white/20 hover:bg-white/30 text-white rounded-lg transition whitespace-nowrap"
            >
              {copied ? 'Copied' : 'Copy'}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default App