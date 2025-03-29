
import React, { useState, useEffect } from "react";
import useVoiceInput from "./Voiceinput"; 

const SpeechToText = () => {
  const [chats, setChats] = useState([]);
  const [currentChat, setCurrentChat] = useState([]);
  const [currentChatIndex, setCurrentChatIndex] = useState(null);
  const [inputText, setInputText] = useState("");
  const [language, setLanguage] = useState("en-US"); 

  const onVoiceResult = (transcript) => {
    addMessage({ type: "user", text: transcript });
  };

  const { listening, startListening } = useVoiceInput(onVoiceResult, language);

  // Load chat history from local storage
  useEffect(() => {
    const savedChats = JSON.parse(localStorage.getItem("chats")) || [];
    setChats(savedChats);
    if (savedChats.length > 0) {
      setCurrentChat(savedChats[0]);
      setCurrentChatIndex(0);
    }
  }, []);

  // Save chat history whenever chats change
  useEffect(() => {
    localStorage.setItem("chats", JSON.stringify(chats));
  }, [chats]);

  const addMessage = (message) => {
    const updatedChat = [...currentChat, message];
    setCurrentChat(updatedChat);

    const updatedChats = [...chats];
    if (currentChatIndex !== null) {
      updatedChats[currentChatIndex] = updatedChat;
    } else {
      updatedChats.push(updatedChat);
      setCurrentChatIndex(updatedChats.length - 1);
    }
    setChats(updatedChats);
  };

  const handleSendMessage = () => {
    if (inputText.trim()) {
      addMessage({ type: "user", text: inputText });
      setInputText("");
    }
  };

  const startNewChat = () => {
    const newChats = [...chats, []];
    setChats(newChats);
    setCurrentChat([]);
    setCurrentChatIndex(newChats.length - 1);
  };

  const loadChat = (index) => {
    setCurrentChat(chats[index]);
    setCurrentChatIndex(index);
  };

  const deleteChat = (index) => {
    const updatedChats = chats.filter((_, i) => i !== index);
    setChats(updatedChats);

    if (currentChatIndex === index) {
      setCurrentChat(updatedChats.length > 0 ? updatedChats[0] : []);
      setCurrentChatIndex(updatedChats.length > 0 ? 0 : null);
    }
  };

  const clearAllChats = () => {
    setChats([]);
    setCurrentChat([]);
    setCurrentChatIndex(null);
    localStorage.removeItem("chats");
  };

  return (
    <div className="chat-container">
      <div className="sidebar">
        <h2>Chat History</h2>
        <button onClick={startNewChat} className="btn new-chat">➕ New Chat</button>
        <ul>
          {chats.map((chat, index) => (
            <li
              key={index}
              className={`chat-item ${index === currentChatIndex ? "active" : ""}`}
            >
              <span onClick={() => loadChat(index)}>Chat {index + 1}</span>
              <button className="btn delete" onClick={() => deleteChat(index)}>🗑️</button>
            </li>
          ))}
        </ul>
        {chats.length > 0 && (
          <button onClick={clearAllChats} className="btn clear-all">🗑️ Clear All Chats</button>
        )}
      </div>
      <div className="chat-window">
        <h1>Python Tutor</h1>
        <div className="chat-box">
          {currentChat.length === 0 ? (
            <p className="placeholder">Start speaking or typing...</p>
          ) : (
            currentChat.map((msg, index) => (
              <div key={index} className={`message ${msg.type}`}>
                {msg.text}
              </div>
            ))
          )}
        </div>

        <div className="input-box">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            className="input"
            placeholder="Type your message..."
          />
          <button onClick={handleSendMessage} className="btn send">Send</button>
          <button onClick={startListening} className={`btn mic ${listening ? "active" : ""}`}>
            {listening ? "Listening..." : "🎤"}
          </button>
          <select value={language} onChange={(e) => setLanguage(e.target.value)} className="language-select">
            <option value="en-US">English</option>
            <option value="ml-IN">Malayalam</option>
          </select>
        </div>
      </div>
    </div>
  );
};

export default SpeechToText;

