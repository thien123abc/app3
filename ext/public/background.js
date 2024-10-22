
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "showPopup") {
        sendResponse({ success: true });
    }
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "showPopup") {
        sendResponse({ success: true });
    }

    // Xử lý khi có yêu cầu lấy dữ liệu mạng
    else if (request.action === "getNetworkData") {
        let networkData = [];

        // Sử dụng chrome.webRequest để theo dõi tất cả các request đã hoàn thành
        chrome.webRequest.onCompleted.addListener((details) => {
            // Lưu trữ thông tin của các yêu cầu mạng đã hoàn thành
            networkData.push({
                url: details.url,
                method: details.method,
                statusCode: details.statusCode,
                type: details.type
            });
        }, { urls: ["<all_urls>"] });

        // Gửi dữ liệu mạng về content script
        sendResponse({ networkData });
    }

    // Return true để giữ kênh kết nối mở trong khi sendResponse được xử lý không đồng bộ
    return true;
});

let lastSelectedText = '';
let img = '';
let html = '';
let network = '';

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "sendSelectedText") {
        lastSelectedText = request.text; // Lưu trữ văn bản đã bôi đen
        img = request.img;
        html = request.html;
        network = request.network;
        sendResponse({ success: true });
    }

    // Nếu bạn muốn gửi dữ liệu này đến app.js, bạn có thể sử dụng một cách như sau:
    else if (request.action === "getLastSelectedText") {
        sendResponse({ text: lastSelectedText, img, html,network });
    }

    return true; // Giữ kênh kết nối mở
});