import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Layout from './components/Layout/Layout'
import Home from './pages/Home/Home'
import Dictionary from './pages/Dictionary/Dictionary'
import TextToSpeech from './pages/TextToSpeech/TextToSpeech'
import SpeechToText from './pages/SpeechToText/SpeechToText'
import SpeechToRecording from './pages/SpeechToRecording/SpeechToRecording'
import Translator from './pages/Translator/Translator'

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/dictionary" element={<Dictionary />} />
          <Route path="/text-to-speech" element={<TextToSpeech />} />
          <Route path="/speech-to-text" element={<SpeechToText />} />
          <Route path="/speech-to-recording" element={<SpeechToRecording />} />
          <Route path="/translator" element={<Translator />} />
        </Routes>
      </Layout>
    </Router>
  )
}

export default App

