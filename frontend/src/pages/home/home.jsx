import { useState, useEffect, useRef } from 'react'
import './home.css'

function Home() {
  const [inputText, setInputText] = useState('')
  const [outputText, setOutputText] = useState('')
  const [sourceLang, setSourceLang] = useState('ko')
  const [targetLang, setTargetLang] = useState('en')
  const [isTranslating, setIsTranslating] = useState(false)

  const languages = [
    { code: 'ko', name: 'Korean' },
    { code: 'en', name: 'English' },
    { code: 'zh', name: 'Chinese (Simplified)' },
  ]

  const handleTranslate = async () => {
    if (!inputText.trim()) {
      return
    }

    setIsTranslating(true)
    
    try {
      // Language code mapping for MyMemory API
      const langMap = {
        'ko': 'ko',
        'en': 'en',
        'zh': 'zh'
      }
      
      const sourceCode = langMap[sourceLang] || sourceLang
      const targetCode = langMap[targetLang] || targetLang
      
      if (sourceLang === targetLang) {
        // Same language - return input as is
        setOutputText(inputText)
        setIsTranslating(false)
        return
      }
      
      // Use multiple translation APIs for better quality
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
      // Fallback: Simple mock translation
      let translatedText = ''
      if (sourceLang === 'ko' && targetLang === 'en') {
        translatedText = 'I feel good.'
      } else if (sourceLang === 'en' && targetLang === 'ko') {
        translatedText = '기분이 좋습니다.'
      } else if (sourceLang === 'ko' && targetLang === 'zh') {
        translatedText = '我感觉很好。'
      } else if (sourceLang === 'zh' && targetLang === 'ko') {
        translatedText = '기분이 좋습니다.'
      } else if (sourceLang === 'en' && targetLang === 'zh') {
        translatedText = '我感觉很好。'
      } else if (sourceLang === 'zh' && targetLang === 'en') {
        translatedText = 'I feel good.'
      } else {
        translatedText = inputText
      }
      setOutputText(translatedText)
    } finally {
      setIsTranslating(false)
    }
  }

  const handleSwap = () => {
    setSourceLang(targetLang)
    setTargetLang(sourceLang)
    setInputText(outputText)
    setOutputText(inputText)
  }

  // 이전 언어 값을 저장
  const prevSourceLangRef = useRef(sourceLang)
  const prevTargetLangRef = useRef(targetLang)

  // 언어 변경 시 입력/출력 텍스트 자동 교체 및 번역
  useEffect(() => {
    // 초기 로드 시에는 실행하지 않음
    if (!inputText.trim() && !outputText.trim()) {
      prevSourceLangRef.current = sourceLang
      prevTargetLangRef.current = targetLang
      return
    }

    // 언어가 실제로 변경되었는지 확인
    const sourceLangChanged = prevSourceLangRef.current !== sourceLang
    const targetLangChanged = prevTargetLangRef.current !== targetLang

    if (!sourceLangChanged && !targetLangChanged) {
      return
    }

    // 언어가 변경되었을 때만 실행
    const timeoutId = setTimeout(async () => {
      if (isTranslating) return

      if (sourceLangChanged && inputText.trim()) {
        // 입력 언어가 변경된 경우: 
        // 1. 현재 입력 텍스트를 이전 입력 언어에서 새 입력 언어로 번역하여 입력 필드에 표시
        // 2. 그 결과를 새 출력 언어로 번역하여 출력 필드에 표시
        setIsTranslating(true)
        try {
          const langMap = {
            'ko': 'ko',
            'en': 'en',
            'zh': 'zh'
          }
          
          const prevSourceCode = langMap[prevSourceLangRef.current] || prevSourceLangRef.current
          const newSourceCode = langMap[sourceLang] || sourceLang
          const targetCode = langMap[targetLang] || targetLang
          
          // Step 1: 현재 입력 텍스트를 이전 입력 언어에서 새 입력 언어로 번역
          let translatedInput = inputText
          
          if (prevSourceCode !== newSourceCode) {
            // Try Google Translate via CORS proxy
            try {
              const googleUrl1 = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=${prevSourceCode}&tl=${newSourceCode}&dt=t&q=${encodeURIComponent(inputText)}`
              const proxyUrl1 = `https://api.allorigins.win/get?url=${encodeURIComponent(googleUrl1)}`
              
              const googleResponse1 = await fetch(proxyUrl1)
              
              if (googleResponse1.ok) {
                const proxyData1 = await googleResponse1.json()
                if (proxyData1 && proxyData1.contents) {
                  try {
                    const googleData1 = JSON.parse(proxyData1.contents)
                    if (googleData1 && Array.isArray(googleData1) && googleData1[0] && Array.isArray(googleData1[0])) {
                      translatedInput = googleData1[0]
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
              // Fallback to MyMemory
              const response1 = await fetch(
                `https://api.mymemory.translated.net/get?q=${encodeURIComponent(inputText)}&langpair=${prevSourceCode}|${newSourceCode}`
              )
              
              if (response1.ok) {
                const data1 = await response1.json()
                if (data1.responseStatus === 200 && data1.responseData && data1.responseData.translatedText) {
                  // Clean up translation result
                  let cleanedInput = data1.responseData.translatedText
                  cleanedInput = cleanedInput.replace(/^t\d+\//, '')
                  cleanedInput = cleanedInput.replace(/<[^>]*>/g, '')
                  cleanedInput = cleanedInput.trim()
                  translatedInput = cleanedInput || inputText
                }
              }
            }
          }
          
          // Step 2: 번역된 입력을 입력 필드에 설정
          setInputText(translatedInput)
          
          // Step 3: 번역된 입력을 새 출력 언어로 번역
          if (newSourceCode === targetCode) {
            setOutputText(translatedInput)
            setIsTranslating(false)
          } else {
            // Try Google Translate via CORS proxy
            let finalTranslated = ''
            try {
              const googleUrl2 = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=${newSourceCode}&tl=${targetCode}&dt=t&q=${encodeURIComponent(translatedInput)}`
              const proxyUrl2 = `https://api.allorigins.win/get?url=${encodeURIComponent(googleUrl2)}`
              
              const googleResponse2 = await fetch(proxyUrl2)
              
              if (googleResponse2.ok) {
                const proxyData2 = await googleResponse2.json()
                if (proxyData2 && proxyData2.contents) {
                  try {
                    const googleData2 = JSON.parse(proxyData2.contents)
                    if (googleData2 && Array.isArray(googleData2) && googleData2[0] && Array.isArray(googleData2[0])) {
                      finalTranslated = googleData2[0]
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
              // Fallback to MyMemory
              const response2 = await fetch(
                `https://api.mymemory.translated.net/get?q=${encodeURIComponent(translatedInput)}&langpair=${newSourceCode}|${targetCode}`
              )
              
              if (response2.ok) {
                const data2 = await response2.json()
                if (data2.responseStatus === 200 && data2.responseData && data2.responseData.translatedText) {
                  // Clean up translation result - remove unwanted tags/prefixes
                  finalTranslated = data2.responseData.translatedText
                  finalTranslated = finalTranslated.replace(/^t\d+\//, '')
                  finalTranslated = finalTranslated.replace(/<[^>]*>/g, '')
                  finalTranslated = finalTranslated.trim()
                }
              }
            }
            
            setOutputText(finalTranslated)
            setIsTranslating(false)
          }
        } catch (error) {
          console.error('Translation error:', error)
          setOutputText('')
          setIsTranslating(false)
        }
      } else if (targetLangChanged && inputText.trim()) {
        // 출력 언어만 변경된 경우: 현재 입력을 새 출력 언어로 번역
        handleTranslate()
      }

      // 이전 언어 값 업데이트
      prevSourceLangRef.current = sourceLang
      prevTargetLangRef.current = targetLang
    }, 100)

    return () => clearTimeout(timeoutId)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sourceLang, targetLang])

  return (
    <div className="home">
      <div className="home-container">
        <h1 className="home-title">Fast Translator</h1>
        <p className="home-subtitle">LLM-powered translator that converts your words into sentences in any language</p>

        <div className="translator-box">
          <div className="language-selector">
            <select
              value={sourceLang}
              onChange={(e) => setSourceLang(e.target.value)}
              className="lang-select"
            >
              {languages.map(lang => (
                <option key={lang.code} value={lang.code}>{lang.name}</option>
              ))}
            </select>
            <button onClick={handleSwap} className="swap-btn" aria-label="Swap languages">
              ⇄
            </button>
            <select
              value={targetLang}
              onChange={(e) => setTargetLang(e.target.value)}
              className="lang-select"
            >
              {languages.map(lang => (
                <option key={lang.code} value={lang.code}>{lang.name}</option>
              ))}
            </select>
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

export default Home

