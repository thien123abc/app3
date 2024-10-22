import React, { useEffect, useState } from 'react';
import Popup from './components/TextPopup';

function App() {
    const [selectedText, setSelectedText] = useState('');
    const [html, setHtml] = useState('');
    const [img, setImg] = useState('');
    const [nw, setNw] = useState('');

    useEffect(() => {
        // Lắng nghe thông điệp từ background.js
        // window.chrome.runtime?.onMessage.addListener((request, sender, sendResponse) => {
        //     if (request.action === "sendSelectedText") {
        //         console.log('dataget',request.text);
                
        //         setSelectedText(request.text); // Cập nhật trạng thái với văn bản đã bôi đen
        //     }
        // });

        // Yêu cầu dữ liệu đã bôi đen khi app khởi động
        window.chrome.runtime?.sendMessage({ action: "getLastSelectedText" }, (response) => {
            if (response.text) {
                setSelectedText(response.text);
            }
            if(response.html){
                setHtml(response.html)
            }
            if(response.img){
                setImg(response.img)
            }
            if(response.network){
                setNw(response.network)
            }
        });

    }, []);

    return <Popup selectedText={selectedText} html={html} img={img} network={nw}/>;
}

export default App;