
// import './App.css';
// import Record from './Record';
// import Speech from './speech';

// function App() {
//   return (
//     <div className="App">
//       <Record/>
//     </div>
//   );
// }
// export default App;


import "./App.css"
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import {useState, useEffect, useRef} from "react";
import axios from "axios";
import { useSpeechSynthesis } from "react-speech-kit";

const App = () => {
    const [result, setResult] = useState(null);
    const [glow, setGlow] = useState(false);

    const [isSilence, setIsSilence] = useState(false);
    const silenceThreshold = 2000; // Time in milliseconds
    const { transcript, listening, resetTranscript, finalTranscript, browserSupportsSpeechRecognition } = useSpeechRecognition();
    const timeoutRef = useRef(null);
    const { speak, voices} = useSpeechSynthesis();
    const [isLoading, setIsLoading] = useState(false);


    if (!browserSupportsSpeechRecognition) {
      console.log("Browser does not support speech recognition") 
    }

    const startListening = () => {
      if(listening)return;
      setResult(null);
      SpeechRecognition.startListening({ continuous: true, language: 'en-IN' });
    }

    const stopListening = () => {
      if(!listening)return;
      SpeechRecognition.stopListening();
    }


    const sendData = async () => {
      if(!finalTranscript)return;
      setIsLoading(true);
      try {
        let totalWords = 0;
        await axios.post('https://botbackend-5f0k.onrender.com/assist', {question: finalTranscript})
        .then(response => {
          const res = response.data;
          console.log(res); 
          setResult(res);
          const words = res.split(" ");
          totalWords = words.length;
          speak({ text: res, voice: voices[4] })
        })
        .catch(error => {
          console.error('Error:', error);
        });

        await new Promise((resolve) => setTimeout(resolve, 1000*((totalWords + 4)/5)));

        setIsLoading(false);
      } catch (error) {
        setIsLoading(false);
      }
      resetTranscript();
    };

    const handleStartListening = () => {
      startListening();
      setIsSilence(false);
    };

    const handleStopListening = () => {
      stopListening();
      setIsSilence(false);
    };
  

    useEffect(() => {
      if (transcript) {
        setIsSilence(false);
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
        }
        timeoutRef.current = setTimeout(() => {
          setIsSilence(true);
        }, silenceThreshold);
      }
      return () => {
        clearTimeout(timeoutRef.current);
      };
  }, [transcript]);

    useEffect(() => {
      if (isSilence && listening) {
        sendData();
      }
    }, [isSilence, listening]);

    useEffect(() => {
      if (isLoading) {
        setGlow(true);
      } else {
        setGlow(false);
      }
    }, [isLoading]);

    return (
        <>
            <div className="container">
                <h2>PepeGPT</h2>
                <br/>
                <p>An application where you can speak into your microphone and it gives an answer by GPT</p><p> In the left there is PepeBot and in the right its you</p>

                <div className="main-container">
                  <div className="main-content">
                    <div className="pfp">
                    <div
                      className={glow ? 'circle glow' : 'circle'}
                    >
                      <div className="circle-container">
                        <img
                          src="data:image/jpeg;base64,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"
                          alt="AI Image"
                          className="circle-image"
                        />
                      </div>
                    </div>
                    </div>
                    <div className="chattext">{result}</div>   
                  </div>
                  <div className="main-content">
                  <div className="pfp">
                  <div
                      className={listening ? 'circle glow' : 'circle'}
                      onClick={() => setGlow(!glow)}
                    >
                      <div className="circle-container">
                        <img
                          src="https://i.imgur.com/RxcjVwP.png"
                          alt="AI Image"
                          className="circle-image"
                        />
                      </div>
                    </div>
                  </div>
                  <div className="chattext">{transcript}</div>   
                  </div>
                </div>

                <div className="btn-style">
                    <button onClick={handleStartListening}>Start </button>
                    <button onClick={handleStopListening}>Stop </button>
                </div>
            </div>

        </>
    );
};

export default App;