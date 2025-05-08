import { useState } from 'react'
import VoiceToTextArea from './components/voice2text'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <VoiceToTextArea />
  )
}

export default App
