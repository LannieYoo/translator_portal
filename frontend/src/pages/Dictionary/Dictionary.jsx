import { useState } from 'react'
import './Dictionary.css'

function Dictionary() {
  const [searchTerm, setSearchTerm] = useState('')
  const [searchDirection, setSearchDirection] = useState('ko-en')
  const [results, setResults] = useState([])
  const [isSearching, setIsSearching] = useState(false)

  const directions = [
    { value: 'ko-en', label: 'Korean → English' },
    { value: 'en-ko', label: 'English → Korean' },
    { value: 'ko-zh', label: 'Korean → Chinese' },
    { value: 'zh-ko', label: 'Chinese → Korean' },
    { value: 'en-zh', label: 'English → Chinese' },
    { value: 'zh-en', label: 'Chinese → English' },
  ]

  const handleSearch = async () => {
    if (!searchTerm.trim()) return

    setIsSearching(true)
    try {
      // TODO: 무료 사전 API 연동
      // 현재는 Mock data
      await new Promise(resolve => setTimeout(resolve, 500))
      setResults([
        { word: searchTerm, translation: `[${searchDirection}] Translation result`, example: 'Example: This is an example sentence.' },
      ])
    } catch (error) {
      console.error('Dictionary search error:', error)
      setResults([])
    } finally {
      setIsSearching(false)
    }
  }

  return (
    <div className="dictionary">
      <div className="dictionary-container">
        <h1 className="page-title">Dictionary</h1>
        <p className="page-subtitle">Search for words using free dictionary service</p>

        <div className="dictionary-box">
          <div className="search-controls">
            <select
              value={searchDirection}
              onChange={(e) => setSearchDirection(e.target.value)}
              className="direction-select"
            >
              {directions.map(dir => (
                <option key={dir.value} value={dir.value}>{dir.label}</option>
              ))}
            </select>
            <div className="search-input-group">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                placeholder="Enter a word to search..."
                className="search-input"
              />
              <button
                onClick={handleSearch}
                disabled={isSearching || !searchTerm.trim()}
                className="search-btn"
              >
                {isSearching ? 'Searching...' : 'Search'}
              </button>
            </div>
          </div>

          <div className="results-section">
            {results.length > 0 ? (
              <div className="results-list">
                {results.map((result, index) => (
                  <div key={index} className="result-item">
                    <div className="result-word">{result.word}</div>
                    <div className="result-translation">{result.translation}</div>
                    {result.example && (
                      <div className="result-example">{result.example}</div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="no-results">
                {searchTerm ? 'No results found.' : 'Enter a search term.'}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dictionary

