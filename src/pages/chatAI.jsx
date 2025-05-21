import { useState, useRef, useEffect } from 'react';
import { aiVoiceChat } from '../redux/apiRequest';
import { useSelector } from 'react-redux';

export default function VoiceChatPage() {
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [inputMode, setInputMode] = useState('text');
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const mediaRecorderRef = useRef(null);
  const messagesEndRef = useRef(null);
  const accessToken = useSelector(state => state.user.currentUser?.accessToken);

  // Cuộn xuống cuối tin nhắn
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const toggleRecording = async () => {
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      const chunks = [];

      mediaRecorderRef.current.ondataavailable = (e) => chunks.push(e.data);
      mediaRecorderRef.current.onstop = async () => {
        const blob = new Blob(chunks, { type: 'audio/mp3' });
        setIsLoading(true);
        try {
          setMessages((prev) => [
            ...prev,
            { id: Date.now(), role: 'user', content: transcript },
          ]);

          const stream = await aiVoiceChat({
            accessToken,
            audioFile: blob,
          });

          let responseText = '';
          let cardLink = null;
          const reader = stream.getReader();
          const decoder = new TextDecoder();

          while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            const chunk = decoder.decode(value);
            try {
              const json = JSON.parse(chunk);
              responseText = json.responseText;
              cardLink = json.cardLink;
            } catch {
              responseText += chunk;
              setMessages((prev) => {
                const last = prev[prev.length - 1];
                if (last && last.role === 'ai') {
                  return [...prev.slice(0, -1), { ...last, content: responseText }];
                }
                return [...prev, { id: Date.now(), role: 'ai', content: responseText, cardLink }];
              });
            }
          }

          if (responseText) {
            setMessages((prev) => {
              const last = prev[prev.length - 1];
              if (last && last.role === 'ai') {
                return [...prev.slice(0, -1), { ...last, content: responseText, cardLink }];
              }
              return [...prev, { id: Date.now(), role: 'ai', content: responseText, cardLink }];
            });
            await speakText(responseText);
          }

          setTranscript('');
          setInput('');
        } catch (error) {
          console.error('Error:', error);
          setMessages((prev) => [
            ...prev,
            { id: Date.now(), role: 'ai', content: error.message },
          ]);
        } finally {
          setIsLoading(false);
        }
      };

      mediaRecorderRef.current.start();
      setIsRecording(true);
      setInputMode('voice');
    } catch (error) {
      console.error('Recording error:', error);
      setMessages((prev) => [
        ...prev,
        { id: Date.now(), role: 'ai', content: 'Hihi, không mở được micro nè! 😿 Kiểm tra quyền micro nha!' },
      ]);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
    }
    setIsRecording(false);
  };

  const speakText = async (text) => {
    try {
      setIsSpeaking(true);
      const response = await fetch('https://texttospeech.googleapis.com/v1/text:synthesize', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${process.env.REACT_APP_GOOGLE_CLOUD_TOKEN}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          input: { text },
          voice: { languageCode: 'vi-VN', name: 'vi-VN-Standard-A' },
          audioConfig: { audioEncoding: 'MP3' },
        }),
      });

      if (!response.ok) {
        throw new Error('TTS API error');
      }

      const { audioContent } = await response.json();
      const audioBlob = new Blob([Buffer.from(audioContent, 'base64')], { type: 'audio/mp3' });
      const audioUrl = URL.createObjectURL(audioBlob);
      const audio = new Audio(audioUrl);
      audio.onended = () => setIsSpeaking(false);
      audio.play();
    } catch (error) {
      console.error('TTS error:', error);
      setMessages((prev) => [
        ...prev,
        { id: Date.now(), role: 'ai', content: 'Hihi, không phát được âm thanh nè! 😿 Thử lại nha!' },
      ]);
      setIsSpeaking(false);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (inputMode === 'voice' && transcript.trim()) {
      setMessages((prev) => [
        ...prev,
        { id: Date.now(), role: 'user', content: transcript },
      ]);
      setIsLoading(true);
      try {
        const stream = await aiVoiceChat({
          accessToken,
          userMessage: transcript,
        });

        let responseText = '';
        let cardLink = null;
        const reader = stream.getReader();
        const decoder = new TextDecoder();

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value);
          try {
            const json = JSON.parse(chunk);
            responseText = json.responseText;
            cardLink = json.cardLink;
          } catch {
            responseText += chunk;
            setMessages((prev) => {
              const last = prev[prev.length - 1];
              if (last && last.role === 'ai') {
                return [...prev.slice(0, -1), { ...last, content: responseText }];
              }
              return [...prev, { id: Date.now(), role: 'ai', content: responseText, cardLink }];
            });
          }
        }

        if (responseText) {
          setMessages((prev) => {
            const last = prev[prev.length - 1];
            if (last && last.role === 'ai') {
              return [...prev.slice(0, -1), { ...last, content: responseText, cardLink }];
            }
            return [...prev, { id: Date.now(), role: 'ai', content: responseText, cardLink }];
          });
          await speakText(responseText);
        }

        setTranscript('');
        setInput('');
      } catch (error) {
        console.error('Error:', error);
        setMessages((prev) => [
          ...prev,
          { id: Date.now(), role: 'ai', content: error.message },
        ]);
      } finally {
        setIsLoading(false);
      }
    } else if (inputMode === 'text' && input.trim()) {
      setMessages((prev) => [
        ...prev,
        { id: Date.now(), role: 'user', content: input },
      ]);
      setIsLoading(true);
      try {
        const stream = await aiVoiceChat({
          accessToken,
          userMessage: input,
        });

        let responseText = '';
        let cardLink = null;
        const reader = stream.getReader();
        const decoder = new TextDecoder();

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value);
          try {
            const json = JSON.parse(chunk);
            responseText = json.responseText;
            cardLink = json.cardLink;
          } catch {
            responseText += chunk;
            setMessages((prev) => {
              const last = prev[prev.length - 1];
              if (last && last.role === 'ai') {
                return [...prev.slice(0, -1), { ...last, content: responseText }];
              }
              return [...prev, { id: Date.now(), role: 'ai', content: responseText, cardLink }];
            });
          }
        }

        if (responseText) {
          setMessages((prev) => {
            const last = prev[prev.length - 1];
            if (last && last.role === 'ai') {
              return [...prev.slice(0, -1), { ...last, content: responseText, cardLink }];
            }
            return [...prev, { id: Date.now(), role: 'ai', content: responseText, cardLink }];
          });
          await speakText(responseText);
        }

        setInput('');
      } catch (error) {
        console.error('Error:', error);
        setMessages((prev) => [
          ...prev,
          { id: Date.now(), role: 'ai', content: error.message },
        ]);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleInputChange = (e) => {
    setInput(e.target.value);
    setInputMode('text');
  };

  return (
    <div className="voiceChatContainer">
      <div className="chatCard">
        <div className="chatHeader">
          <h1>Voice Chat with AI</h1>
        </div>

        <div className="chatMessages">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`messageContainer ${message.role === 'user' ? 'userMessage' : 'aiMessage'}`}
            >
              <div className="messageBubble">
                {message.content}
                {message.cardLink && (
                  <a href={message.cardLink} target="_blank" rel="noopener noreferrer">
                    {message.cardLink}
                  </a>
                )}
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        <div className="inputArea">
          {inputMode === 'voice' && isRecording ? (
            <div className="voiceInputDisplay">
              <div className="recordingIndicator">
                <span className="recordingDot"></span>
                Recording...
              </div>
              <p>{transcript || 'Speak now...'}</p>
            </div>
          ) : (
            <form onSubmit={handleSendMessage} className="inputForm">
              <input
                type="text"
                value={input}
                onChange={handleInputChange}
                placeholder="Type a message or click the mic to speak..."
                className="textInput"
              />
            </form>
          )}

          <div className="controls">
            <button
              className={`controlButton ${isRecording ? 'active' : ''}`}
              onClick={toggleRecording}
              type="button"
              aria-label={isRecording ? 'Stop recording' : 'Start recording'}
            >
              <i className={isRecording ? 'fas fa-microphone-slash' : 'fas fa-microphone'} />
            </button>

            <button
              className={`controlButton ${isSpeaking ? 'active' : ''}`}
              onClick={
                isSpeaking
                  ? () => setIsSpeaking(false)
                  : () => {
                      if (messages.length > 0) {
                        speakText(messages[messages.length - 1].content);
                      }
                    }
              }
              disabled={messages.length === 0}
              type="button"
              aria-label={isSpeaking ? 'Stop speaking' : 'Play last message'}
            >
              <i className={isSpeaking ? 'fas fa-volume-mute' : 'fas fa-volume-up'} />
            </button>

            <button
              className="sendButton"
              onClick={handleSendMessage}
              disabled={
                (inputMode === 'text' && !input.trim()) ||
                (inputMode === 'voice' && !transcript.trim()) ||
                isLoading
              }
              type="submit"
              aria-label="Send message"
            >
              <i className="fas fa-paper-plane" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}