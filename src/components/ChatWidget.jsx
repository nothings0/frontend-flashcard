import { useState, useEffect, useRef } from "react";
import { aiChat } from "../redux/apiRequest";
import { marked } from "marked";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([
    {
      sender: "ai",
      message: "Chào bạn! Tôi là trợ lý học tập của bạn. Bạn cần giúp gì hôm nay?",
    },
  ]);
  const [loading, setLoading] = useState(false);
  const [streamingMessage, setStreamingMessage] = useState("");
  const [showUpgradePopup, setShowUpgradePopup] = useState(false);

  const popupRef = useRef(null);
  const buttonRef = useRef(null);
  const textareaRef = useRef(null);
  const chatBodyRef = useRef(null);

  const plan = useSelector((state) => state.user.currentUser?.user.plan);
  const accessToken = useSelector((state) => state.user.currentUser?.accessToken);

  // Đóng popup khi click ra ngoài
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        open &&
        popupRef.current &&
        !popupRef.current.contains(event.target) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target)
      ) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [open]);

  // Tự động điều chỉnh chiều cao textarea
  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "auto";
      textarea.style.height = `${Math.min(textarea.scrollHeight, 120)}px`;
    }
  }, [input]);

  // Tự động cuộn xuống cuối khi có tin nhắn mới
  useEffect(() => {
    const chatBody = chatBodyRef.current;
    if (chatBody) {
      chatBody.scrollTop = chatBody.scrollHeight;
    }
  }, [messages, streamingMessage]);

  // Mở chat và kiểm tra plan
  const handleChatButtonClick = () => {
    setOpen(true);
    if (!["MONTHLY", "YEARLY"].includes(plan?.type)) {
      setShowUpgradePopup(true);
    }
  };

  const handleSend = async () => {
  if (!input.trim()) return;

  const userMessage = input;
  setMessages((prev) => [...prev, { sender: "user-chat", message: userMessage }]);
  setInput("");
  setStreamingMessage("");
  setLoading(true);

  try {
    // 👉 Tạo context: lấy 3 cặp gần nhất (user-chat + ai)
    const reversed = [...messages].reverse();
    const context = [];
    let userCount = 0;

    for (let i = 0; i < reversed.length && userCount < 3; i++) {
      const msg = reversed[i];
      if (msg.sender === "ai") {
        context.unshift({ sender: "ai", message: msg.message });
      } else if (msg.sender === "user-chat") {
        context.unshift({ sender: "user", message: msg.message });
        userCount++;
      }
    }

    // 🟢 Gửi context + userMessage lên server
    const res = await aiChat({ accessToken, userMessage, context });

    const reader = res.getReader();
    const decoder = new TextDecoder();
    let done = false;
    let responseText = "";

    while (!done) {
      const { value, done: doneReading } = await reader.read();
      done = doneReading;
      const chunk = decoder.decode(value, { stream: true });
      responseText += chunk;
      setStreamingMessage((prev) => prev + chunk);
    }

    setMessages((prev) => [...prev, { sender: "ai", message: responseText }]);
    setStreamingMessage("");
  } catch (err) {
    console.error("Lỗi khi gọi API:", err);
    setMessages((prev) => [
      ...prev,
      { sender: "ai", message: "[Lỗi] Không thể truy xuất AI." },
    ]);
    setStreamingMessage("");
  }

  setLoading(false);
};


  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="chat-widget">
      <div
        className="chat-button"
        onClick={handleChatButtonClick}
        title="Chat với AI"
        ref={buttonRef}
      >
        <i className="far fa-comment"></i>
      </div>

      {open && (
        <div className="chat-popup" ref={popupRef}>
          <div className="chat-header">
            <span>🎓 Trợ lý học tập</span>
            <button onClick={() => setOpen(false)}>✖</button>
          </div>

          <div className="chat-body" ref={chatBodyRef}>
            {showUpgradePopup ? (
              <>
                <div className="overlay" />
                <div className="upgrade-popup">
                  <div className="upgrade-header">✨ Nâng cấp lên Plus ✨</div>
                  <div className="upgrade-body">
                    <p>Hì hì, để chat với mình, bạn cần nâng cấp lên Plus trước nha! 🌟</p>
                    <p>Với Plus, bạn sẽ được hỏi thả ga và nhiều tính năng xịn khác!</p>
                    <Link
                      to="/pricing"
                      className="upgrade-button"
                      onClick={() => {
                        setShowUpgradePopup(false);
                        setOpen(false);
                      }}
                    >
                      Nâng cấp ngay
                    </Link>
                  </div>
                </div>
              </>
            ) : (
              <>
                {messages.map((msg, index) => (
                  <div
                    key={index}
                    className={`chat-message ${msg.sender}`}
                    dangerouslySetInnerHTML={{ __html: marked(msg.message) }}
                  />
                ))}

                {loading && !streamingMessage && (
                  <div className="chat-message ai loading-dots">
                    <span>.</span>
                    <span>.</span>
                    <span>.</span>
                  </div>
                )}

                {streamingMessage && (
                  <div
                    className="chat-message ai"
                    dangerouslySetInnerHTML={{ __html: marked(streamingMessage) }}
                  />
                )}
              </>
            )}
          </div>

          <div className="chat-input">
            <textarea
              ref={textareaRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              rows={3}
              placeholder="Nhập câu hỏi..."
            />
            <button onClick={handleSend} disabled={loading || !input.trim()}>
              {loading ? "Đang trả lời..." : "Gửi"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
