import { useState, useEffect, useRef } from 'react';
import { aiChat } from '../redux/apiRequest';
import { marked } from 'marked';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

export default function ChatWidget() {
    const [open, setOpen] = useState(false);
    const [input, setInput] = useState('');
    const [messages, setMessages] = useState([
        { sender: 'ai', message: 'Chào bạn! Tôi là trợ lý học tập của bạn. Bạn cần giúp gì hôm nay?' }
    ]);
    const [loading, setLoading] = useState(false);
    const [streamingMessage, setStreamingMessage] = useState('');
    const [showUpgradePopup, setShowUpgradePopup] = useState(false); // Trạng thái popup nâng cấp
    const popupRef = useRef(null);
    const buttonRef = useRef(null);
    const textareaRef = useRef(null);
    const chatBodyRef = useRef(null);

    const plan = useSelector(
        (state) => state.user.currentUser?.user.plan
    );
    const accessToken = useSelector(
        (state) => state.user.currentUser?.accessToken
    );

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

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [open]);

    // Tự động điều chỉnh chiều cao textarea
    useEffect(() => {
        const textarea = textareaRef.current;
        if (textarea) {
            textarea.style.height = 'auto';
            textarea.style.height = `${Math.min(textarea.scrollHeight, 120)}px`;
        }
    }, [input]);

    // Cuộn xuống tin nhắn mới nhất
    useEffect(() => {
        const chatBody = chatBodyRef.current;
        if (chatBody) {
            chatBody.scrollTop = chatBody.scrollHeight;
        }
    }, [messages, streamingMessage]);

    // Kiểm tra trạng thái Plus khi nhấn nút chat
    const handleChatButtonClick = async () => {
        setOpen(true);
        if (!["MONTHLY", "YEARLY"].includes(plan?.type)) {
            setShowUpgradePopup(true); // Hiện popup nâng cấp
        }
    };

    const handleSend = async () => {
        if (!input.trim()) return;

        setMessages((prevMessages) => [
            ...prevMessages,
            { sender: 'user-chat', message: input },
        ]);

        setInput('');
        setLoading(true);
        setStreamingMessage('');

        try {
            const res = await aiChat({accessToken, userMessage: input}); // Gửi token
            
            const reader = res.getReader();
            const decoder = new TextDecoder();
            let done = false;
            let responseText = '';

            while (!done) {
                const { value, done: doneReading } = await reader.read();
                done = doneReading;
                const chunk = decoder.decode(value, { stream: true });
                responseText += chunk;
                setStreamingMessage((prev) => prev + chunk);
            }

            setMessages((prevMessages) => [
                ...prevMessages,
                { sender: 'ai', message: responseText },
            ]);
            setStreamingMessage('');
        } catch (err) {
            console.error('Lỗi khi gọi API:', err);
            setMessages((prevMessages) => [
                ...prevMessages,
                { sender: 'ai', message: '[Lỗi] Không thể truy xuất AI.' },
            ]);
            setStreamingMessage('');
        }

        setLoading(false);
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
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
                <i class="far fa-comment"></i>
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
                                    <div className="upgrade-header">
                                        <span>✨ Nâng cấp lên Plus ✨</span>
                                    </div>
                                    <div className="upgrade-body">
                                        <p>Hì hì, để chat với mình, bạn cần nâng cấp lên Plus trước nha! 🌟</p>
                                        <p>Với Plus, bạn sẽ được hỏi thả ga và nhiều tính năng xịn khác!</p>
                                        <Link to="/pricing" className="upgrade-button" onClick={() => { setShowUpgradePopup(false); setOpen(false); }}>
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
                                        dangerouslySetInnerHTML={{
                                            __html: marked(msg.message),
                                        }}
                                    />
                                ))}
                                {loading && !streamingMessage && (
                                    <div className="chat-message ai loading-dots">
                                        <span>.</span><span>.</span><span>.</span>
                                    </div>
                                )}
                                {streamingMessage && (
                                    <div
                                        className="chat-message ai"
                                        dangerouslySetInnerHTML={{
                                            __html: marked(streamingMessage),
                                        }}
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
                            {loading ? 'Đang trả lời...' : 'Gửi'}
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}