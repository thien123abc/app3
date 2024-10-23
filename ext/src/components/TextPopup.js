
import React, { useState } from 'react';
import Chatbox from './Chatbox'; // Nhập component Chatbox

const Popup = ({ selectedText, html, img, network, network2 }) => {
    const [activeTab, setActiveTab] = useState('info'); // Trạng thái tab hiện tại

    return (
        <div style={{ margin: '30px', width: '300px', fontFamily: 'Arial' }}>
            <div>
                <button onClick={() => setActiveTab('info')} style={{ marginRight: '5px' }}>
                    Info
                </button>
                <button onClick={() => setActiveTab('chat')}>
                    Chat
                </button>
            </div>
            {activeTab === 'info' && (
                <div>
                    {selectedText && <p>Text: {selectedText}</p>}
                    {img && <p>Image: <img src={img} alt="Selected" style={{ maxWidth: '100%' }} /></p>}
                    {html && <p>HTML: {html}</p>}
                    {network && <p>Network: {network}</p>}
                    {network2 && (
                        <>
                            <p>time:{network2?.time}</p>
                            <p>method:{network2?.method}</p>
                            <p>ip:{network2?.ip}</p>
                            <p>code:{network2?.statusCode}</p>
                        </>
                    )}
                </div>
            )}
            {activeTab === 'chat' && <Chatbox />}
        </div>
    );
};

export default Popup;