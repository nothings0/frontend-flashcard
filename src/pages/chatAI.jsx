import { useState, useRef, useEffect } from "react";
import { aiChat, aiVoiceChat } from "../redux/apiRequest";
import { useSelector } from "react-redux";
import { handleVoice } from "../util/speech";
import Search from "../components/Search";

export default function VoiceChatPage() {
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [inputMode, setInputMode] = useState("text");
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const mediaRecorderRef = useRef(null);
  const messagesEndRef = useRef(null);
  const accessToken = useSelector(
    (state) => state.user.currentUser?.accessToken
  );

  // Cuộn xuống cuối tin nhắn
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
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
        const blob = new Blob(chunks, { type: "audio/mp3" });
        setIsLoading(true);

        const userId = Date.now();
        const aiId = userId + 1;
        try {
          const reversed = [...messages].reverse();
          const context = [];
          let userCount = 0;

          for (let i = 0; i < reversed.length && userCount < 3; i++) {
            const msg = reversed[i];
            if (msg.role === "ai") {
              context.unshift({ sender: "ai", message: msg.content });
            } else if (msg.role === "user") {
              context.unshift({ sender: "user", message: msg.content });
              userCount++;
            }
          }

          const response = await aiVoiceChat({
            accessToken,
            audioFile: blob,
            context,
          });

          const { user, reply, cardLink } = response;

          // Thêm user message và AI reply
          setMessages((prev) => [
            ...prev,
            { id: userId, role: "user", content: user },
            { id: aiId, role: "ai", content: reply, cardLink },
          ]);

          // Phát giọng song song
          speakText(reply);

          typeWriterEffect(
            reply,
            30,
            (chunk) => {
              setMessages((prev) =>
                prev.map((msg) =>
                  msg.id === aiId ? { ...msg, content: chunk, cardLink } : msg
                )
              );
            },
            () => {}
          );

          setTranscript("");
        } catch (error) {
          console.error("Error:", error);
          setMessages((prev) => [
            ...prev,
            { id: Date.now(), role: "ai", content: error.message },
          ]);
        } finally {
          setIsLoading(false);
        }
      };

      mediaRecorderRef.current.start();
      setIsRecording(true);
      setInputMode("voice");
    } catch (error) {
      console.error("Recording error:", error);
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now(),
          role: "ai",
          content: "Hihi, không mở được micro nè! 😿 Kiểm tra quyền micro nha!",
        },
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
    await handleVoice(text, "en-UK");
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    const isText = inputMode === "text" && input.trim();
    if (!isText) return;

    const userMessage = input;
    setIsLoading(true);

    // Hiển thị tin nhắn người dùng
    const userId = Date.now();
    setMessages((prev) => [
      ...prev,
      { id: userId, role: "user", content: userMessage },
    ]);

    setInput("");

    // Tạo placeholder AI (rỗng ban đầu)
    const aiId = Date.now() + 1;
    setMessages((prev) => [...prev, { id: aiId, role: "ai", content: "" }]);

    try {
      const reversed = [...messages].reverse();
      const context = [];
      let userCount = 0;

      for (let i = 0; i < reversed.length && userCount < 3; i++) {
        const msg = reversed[i];
        if (msg.role === "ai") {
          context.unshift({ sender: "ai", message: msg.content });
        } else if (msg.role === "user") {
          context.unshift({ sender: "user", message: msg.content });
          userCount++;
        }
      }

      const res = await aiChat({ accessToken, userMessage, context });
      const reader = res.getReader();
      const decoder = new TextDecoder();
      let done = false;
      let responseText = "";

      // Stream phản hồi từng phần
      while (!done) {
        const { value, done: doneReading } = await reader.read();
        done = doneReading;
        const chunk = decoder.decode(value, { stream: true });
        responseText += chunk;

        // Cập nhật tin nhắn AI theo từng chunk
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === aiId ? { ...msg, content: responseText } : msg
          )
        );
      }
    } catch (error) {
      console.error("Error:", error);
      setMessages((prev) => [
        ...prev,
        { id: Date.now(), role: "ai", content: error.message },
      ]);
    } finally {
      setIsLoading(false);
      setInput("");
      setTranscript("");
    }
  };

  const typeWriterEffect = (text, delay, onUpdate, onDone) => {
    let index = 0;
    const interval = setInterval(() => {
      if (index < text.length) {
        onUpdate(text.slice(0, index + 1));
        index++;
      } else {
        clearInterval(interval);
        if (onDone) onDone();
      }
    }, delay);
  };

  const handleInputChange = (e) => {
    setInput(e.target.value);
    setInputMode("text");
  };

  return (
    <div className="voiceChatContainer">
      <Search />
      <div className="chatCard">
        <div className="chatHeader">
          <h1>Flux AI</h1>
        </div>

        <div className="chatMessages">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`messageContainer ${
                message.role === "user" ? "userMessage" : "aiMessage"
              }`}
            >
              <div className="messageBubble">
                {message.content}
                {message.cardLink && (
                  <a
                    href={message.cardLink}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {message.cardLink}
                  </a>
                )}
              </div>
            </div>
          ))}
          {isLoading && (
            <>
              <div className="messageContainer userMessage loading-dots">
                <span>.</span>
                <span>.</span>
                <span>.</span>
              </div>
              <div className="messageContainer aiMessage loading-dots">
                <span>.</span>
                <span>.</span>
                <span>.</span>
              </div>
            </>
          )}
          <div ref={messagesEndRef} />
        </div>

        <div className="inputArea">
          <button
            className={`controlButton ${isRecording ? "active" : ""}`}
            onClick={toggleRecording}
            type="button"
            aria-label={isRecording ? "Stop recording" : "Start recording"}
            disabled={isLoading} // Disable button during loading
          >
            <i
              className={
                isRecording ? "fas fa-microphone-slash" : "fas fa-microphone"
              }
            />
          </button>
          {inputMode === "voice" && isRecording ? (
            <div className="voiceInputDisplay">
              <div className="recordingIndicator">
                <span className="recordingDot"></span>
                Recording...
              </div>
              <p>{transcript || "Speak now..."}</p>
            </div>
          ) : (
            <form onSubmit={handleSendMessage} className="inputForm">
              <input
                type="text"
                value={input}
                onChange={handleInputChange}
                placeholder="Type a message or click the mic to speak..."
                className="textInput"
                disabled={isLoading} // Disable input during loading
              />
            </form>
          )}
          <button
            className="sendButton"
            onClick={handleSendMessage}
            disabled={
              (inputMode === "text" && !input.trim()) ||
              (inputMode === "voice" && !transcript.trim()) ||
              isLoading
            }
            type="submit"
            aria-label="Send message"
          >
            <i className="fas fa-paper-plane" />
          </button>
        </div>

        <i class="fa-solid fa-robot ai-bg"></i>
      </div>
    </div>
  );
}
