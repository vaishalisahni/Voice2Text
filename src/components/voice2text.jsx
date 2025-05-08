import { useState, useEffect } from 'react';
import { Mic, MicOff, Loader2 } from 'lucide-react';

export default function VoiceToTextArea() {
  const [text, setText] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [recognition, setRecognition] = useState(null);
  const [isMicAvailable, setIsMicAvailable] = useState(true);

  useEffect(() => {
    // Check if browser supports SpeechRecognition
    if ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognitionInstance = new SpeechRecognition();
      
      recognitionInstance.continuous = true;
      recognitionInstance.interimResults = true;
      
      recognitionInstance.onresult = (event) => {
        const transcript = Array.from(event.results)
          .map(result => result[0])
          .map(result => result.transcript)
          .join('');
        
        setText(prevText => {
          // Only append if this is a new chunk of text
          if (!prevText.endsWith(transcript)) {
            return prevText + ' ' + transcript;
          }
          return prevText;
        });
      };

      recognitionInstance.onerror = (event) => {
        console.error('Speech recognition error', event.error);
        setIsListening(false);
        if (event.error === 'not-allowed') {
          setIsMicAvailable(false);
        }
      };

      recognitionInstance.onend = () => {
        if (isListening) {
          recognitionInstance.start();
        }
      };

      setRecognition(recognitionInstance);
    } else {
      setIsMicAvailable(false);
      console.error('Speech recognition not supported in this browser');
    }

    return () => {
      if (recognition) {
        recognition.stop();
      }
    };
  }, []);

  const toggleListening = () => {
    if (!recognition) return;

    if (isListening) {
      recognition.stop();
      setIsListening(false);
    } else {
      recognition.start();
      setIsListening(true);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      <div className="bg-white rounded-lg shadow-md border border-gray-200">
        <div className="flex items-center justify-between px-4 py-2 bg-gray-50 border-b border-gray-200 rounded-t-lg">
          <h3 className="text-lg font-medium text-gray-700">Voice To Text</h3>
          <div className="flex items-center">
            {!isMicAvailable && (
              <span className="text-red-500 text-sm mr-2">Microphone access denied</span>
            )}
            <button
              onClick={toggleListening}
              disabled={!isMicAvailable}
              className={`p-2 rounded-full focus:outline-none ${
                isListening ? 'bg-red-100 text-red-600' : 'bg-blue-100 text-blue-600'
              } ${!isMicAvailable ? 'opacity-50 cursor-not-allowed' : 'hover:bg-opacity-80'}`}
              title={isListening ? "Stop listening" : "Start listening"}
            >
              {isListening ? <MicOff size={20} /> : <Mic size={20} />}
            </button>
          </div>
        </div>
        
        <div className="relative">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Your text will appear here..."
            className="w-full p-4 min-h-32 resize-y focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-b-lg"
            rows={6}
          />
          
          {isListening && (
            <div className="absolute bottom-4 right-4 flex items-center justify-center">
              <div className="relative">
                <Loader2 className="w-6 h-6 text-blue-500 animate-spin" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      
      <div className="mt-4 text-sm text-gray-500">
        {isListening ? (
          <p className="text-green-600 flex items-center">
            <span className="h-2 w-2 bg-green-600 rounded-full mr-2 animate-pulse"></span>
            Listening... Speak now
          </p>
        ) : (
          <p>Click the microphone icon to start voice recognition</p>
        )}
      </div>
    </div>
  );
}