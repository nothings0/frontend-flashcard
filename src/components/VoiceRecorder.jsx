import React, { useState } from "react";
import { ReactMic } from "react-mic";

const VoiceRecorder = () => {
  const [record, setRecord] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [loading, setLoading] = useState(false);

  const startRecording = () => setRecord(true);
  const stopRecording = () => setRecord(false);

  const onData = (recordedBlob) => {
    // bạn có thể xử lý realtime ở đây nếu muốn
  };

  const onStop = async (recordedBlob) => {
    setLoading(true);
    const formData = new FormData();
    formData.append("audio", recordedBlob.blob, "audio.webm");

    try {
      const res = await fetch("http://localhost:5000/transcribe", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      setTranscript(data.text);
    } catch (err) {
      console.error("Lỗi gửi voice:", err);
      setTranscript("Đã xảy ra lỗi.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="text-center">
      <h2 className="mb-4 text-xl font-bold">🎤 Voice to AI</h2>

      <ReactMic
        record={record}
        className="sound-wave"
        onStop={onStop}
        onData={onData}
        mimeType="audio/webm"
        strokeColor="#000000"
        backgroundColor="#FF4081"
      />

      <div className="my-4">
        <button
          onClick={startRecording}
          className="px-4 py-2 bg-green-500 text-white rounded mr-2"
        >
          Bắt đầu ghi
        </button>
        <button
          onClick={stopRecording}
          className="px-4 py-2 bg-red-500 text-white rounded"
        >
          Dừng ghi
        </button>
      </div>

      {loading ? <p>Đang xử lý...</p> : <p className="mt-4">📝 Kết quả: {transcript}</p>}
    </div>
  );
};

export default VoiceRecorder;
