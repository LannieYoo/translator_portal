import { useState } from 'react'
import './translator.css'

function Translator() {
  const [inputText, setInputText] = useState('')
  const [outputText, setOutputText] = useState('')
  const [sourceLang, setSourceLang] = useState('en-CA')
  const [targetLang, setTargetLang] = useState('ko')
  const [isTranslating, setIsTranslating] = useState(false)

  const sourceLanguages = [
    { code: 'en-CA', name: 'English (Canada)' },
    { code: 'en-US', name: 'English (US)' },
    { code: 'en-IN', name: 'English (India)' },
    { code: 'en-GB', name: 'English (UK)' },
    { code: 'zh', name: 'Chinese (Simplified)' },
    { code: 'ko', name: 'Korean' },
  ]

  const targetLanguages = [
    { code: 'ko', name: 'Korean' },
    { code: 'en-CA', name: 'English (Canada)' },
    { code: 'en-US', name: 'English (US)' },
    { code: 'en-IN', name: 'English (India)' },
    { code: 'en-GB', name: 'English (UK)' },
    { code: 'zh', name: 'Chinese (Simplified)' },
  ]

  const handleTranslate = async () => {
    if (!inputText.trim()) return

    setIsTranslating(true)
    try {
      // Language code mapping for MyMemory API
      const langMap = {
        'ko': 'ko',
        'en-CA': 'en',
        'en-US': 'en',
        'en-GB': 'en',
        'en-IN': 'en',
        'zh': 'zh'
      }
      
      const sourceCode = langMap[sourceLang] || 'en'
      const targetCode = langMap[targetLang] || 'ko'
      
      if (sourceCode === targetCode) {
        setOutputText(inputText)
        setIsTranslating(false)
        return
      }
      
      // Use Google Translate API for better quality (free, no API key)
      let translatedText = ''
      
      // Try Google Translate via CORS proxy
      try {
        const googleUrl = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=${sourceCode}&tl=${targetCode}&dt=t&q=${encodeURIComponent(inputText)}`
        // Using CORS proxy to bypass CORS restrictions
        const proxyUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(googleUrl)}`
        
        const googleResponse = await fetch(proxyUrl)
        
        if (googleResponse.ok) {
          const proxyData = await googleResponse.json()
          if (proxyData && proxyData.contents) {
            try {
              const googleData = JSON.parse(proxyData.contents)
              if (googleData && Array.isArray(googleData) && googleData[0] && Array.isArray(googleData[0])) {
                // Extract translated text from Google's response format
                translatedText = googleData[0]
                  .filter((item) => item && Array.isArray(item) && item[0] && typeof item[0] === 'string')
                  .map((item) => item[0])
                  .join('')
                  .trim()
              }
            } catch (parseError) {
              console.log('Failed to parse Google Translate response:', parseError)
            }
          }
        }
      } catch (googleError) {
        console.log('Google Translate failed, trying MyMemory...', googleError)
      }
      
      // Fallback to MyMemory if Google Translate fails
      if (!translatedText) {
        const response = await fetch(
          `https://api.mymemory.translated.net/get?q=${encodeURIComponent(inputText)}&langpair=${sourceCode}|${targetCode}`
        )
        
        if (!response.ok) {
          throw new Error('Translation API error')
        }
        
        const data = await response.json()
        
        if (data.responseStatus === 200 && data.responseData && data.responseData.translatedText) {
          // Clean up translation result - remove unwanted tags/prefixes
          translatedText = data.responseData.translatedText
          // Remove common unwanted prefixes like "t0/", "t1/", etc.
          translatedText = translatedText.replace(/^t\d+\//, '')
          // Remove HTML tags if any
          translatedText = translatedText.replace(/<[^>]*>/g, '')
          // Trim whitespace
          translatedText = translatedText.trim()
        } else {
          throw new Error('Translation failed')
        }
      }
      
      if (translatedText) {
        setOutputText(translatedText)
      } else {
        throw new Error('Translation failed')
      }
    } catch (error) {
      console.error('Translation error:', error)
      setOutputText('An error occurred during translation. Please try again.')
    } finally {
      setIsTranslating(false)
    }
  }

  return (
    <div className="translator">
      <div className="translator-container">
        <h1 className="page-title">Translator</h1>
        <p className="page-subtitle">Translate between various English dialects, Chinese (Simplified), and Korean</p>

        <div className="translator-box">
          <div className="language-selectors">
            <div className="lang-select-group">
              <label>Source Language</label>
              <select
                value={sourceLang}
                onChange={(e) => setSourceLang(e.target.value)}
                className="lang-select"
              >
                {sourceLanguages.map(lang => (
                  <option key={lang.code} value={lang.code}>{lang.name}</option>
                ))}
              </select>
            </div>
            <div className="arrow">→</div>
            <div className="lang-select-group">
              <label>Target Language</label>
              <select
                value={targetLang}
                onChange={(e) => setTargetLang(e.target.value)}
                className="lang-select"
              >
                {targetLanguages.map(lang => (
                  <option key={lang.code} value={lang.code}>{lang.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="input-section">
            <textarea
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.ctrlKey && !e.shiftKey) {
                  e.preventDefault()
                  if (inputText.trim() && !isTranslating) {
                    handleTranslate()
                  }
                }
              }}
              placeholder="Enter text to translate... (Press Enter to translate, Ctrl+Enter for new line)"
              className="input-textarea"
              rows={8}
            />
          </div>

          <button
            onClick={handleTranslate}
            disabled={isTranslating || !inputText.trim()}
            className="translate-btn"
          >
            {isTranslating ? 'Translating...' : 'Translate'}
          </button>

          <div className="output-section">
            <textarea
              value={outputText}
              readOnly
              placeholder="Translation result will appear here..."
              className="output-textarea"
              rows={8}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default Translator

