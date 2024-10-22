import React, { useState, useEffect, useRef } from 'react';
import '../index.css'

const Chatbox = () => {
    const [contacts, setContacts] = useState([
        { id: 1, name: 'Alice' },
        { id: 2, name: 'Bob' },
        { id: 3, name: 'Charlie' },
    ]);

    const [activeContact, setActiveContact] = useState(null);
    const [messages, setMessages] = useState(() => {
        const savedMessages = localStorage.getItem('messages');
        return savedMessages ? JSON.parse(savedMessages) : {};
    });
    const [inputMessage, setInputMessage] = useState('');
    const [isChatVisible, setIsChatVisible] = useState(false);
    const chatboxRef = useRef(null); // Tạo ref cho chatbox

    const handleToggleChat = () => {
        setIsChatVisible(prev => !prev);
    };

    const handleContactClick = (contact) => {
        setActiveContact(contact);
        setIsChatVisible(true);
    };

    const handleSendMessage = () => {
        if (inputMessage.trim() === '' || !activeContact) return;

        const newMessage = {
            sender: 'me',
            text: inputMessage,
            type: 'text'
        };

        setMessages(prevMessages => {
            const updatedMessages = {
                ...prevMessages,
                [activeContact.id]: [...(prevMessages[activeContact.id] || []), newMessage]
            };
            localStorage.setItem('messages', JSON.stringify(updatedMessages));
            return updatedMessages;
        });

        setInputMessage('');
    };

    const handleBlur = (e) => {
        // Kiểm tra nếu nhấp ra ngoài chatbox
        if (chatboxRef.current && !chatboxRef.current.contains(e.relatedTarget)) {
            setIsChatVisible(false);
        }
    };

    const handlePaste = (e) => {
        e.preventDefault();
        const items = e.clipboardData.items;
    
        for (let i = 0; i < items.length; i++) {
            const item = items[i];
    
            // Kiểm tra xem item có phải là hình ảnh không
            if (item.kind === 'file' && item.type.startsWith('image/')) {
                const file = item.getAsFile();
                const reader = new FileReader();
    
                reader.onload = (event) => {
                    const imageUrl = event.target.result;
                    setMessages(prevMessages => {
                        const updatedMessages = {
                            ...prevMessages,
                            [activeContact.id]: [
                                ...(prevMessages[activeContact.id] || []),
                                { sender: 'me', text: imageUrl, type: 'image' }
                            ]
                        };
                        localStorage.setItem('messages', JSON.stringify(updatedMessages));
                        return updatedMessages;
                    });
                    // Reset ô nhập tin nhắn sau khi dán hình
                    setInputMessage('');
                };
    
                reader.readAsDataURL(file);
            } else if (item.kind === 'string') {
                // Nếu là văn bản, thêm vào ô nhập tin nhắn
                item.getAsString((text) => {
                    setInputMessage(prev => prev + text);
                });
            }
        }
    };

    return (
        <div ref={chatboxRef} className="popup-chatbox" onBlur={handleBlur} tabIndex={0}>
            <div style={{ width: '30%', borderRight: '1px solid #ccc', padding: '10px' }}>
                <h3>Contacts</h3>
                <ul style={{ listStyle: 'none', padding: 0 }}>
                    {contacts.map(contact => (
                        <li key={contact.id} onClick={() => handleContactClick(contact)} style={{ cursor: 'pointer', padding: '5px', border: activeContact?.id === contact.id ? '1px solid blue' : 'none' }}>
                            {contact.name}
                        </li>
                    ))}
                </ul>
            </div>

            <div style={{ width: '70%', padding: '10px' }}>
                <button onClick={handleToggleChat} style={{ marginBottom: '10px' }}>
                    {isChatVisible ? 'Hide Chat' : 'Show Chat'}
                </button>
                {isChatVisible && activeContact ? (
                    <>
                        <h3>Chat with {activeContact.name}</h3>
                        <div className="chat-messages">
                            {messages[activeContact.id]?.map((msg, index) => (
                                <div key={index} style={{ marginBottom: '10px', textAlign: msg.sender === 'me' ? 'right' : 'left' }}>
                                    <span style={{ backgroundColor: msg.sender === 'me' ? '#dcf8c6' : '#f1f0f0', padding: '8px', borderRadius: '5px', display: 'inline-block' }}>
                                    {msg.type === 'text' ? msg.text : <img src={msg.text} alt="sent" style={{ maxWidth: '200px', borderRadius: '5px' }} />}
                                    </span>
                                </div>
                            ))}
                        </div>
                        <div className="input-area">
                            <input
                                type="text"
                                value={inputMessage}
                                onChange={(e) => setInputMessage(e.target.value)}
                                onPaste={handlePaste}
                                placeholder="Type a message..."
                                className="input-message"
                            />
                            <button onClick={handleSendMessage} className="send-button">
                                Send
                            </button>
                        </div>
                    </>
                ) : (
                    <h3>Please select a contact to start chatting.</h3>
                )}
            </div>
        </div>
    );
};

export default Chatbox;