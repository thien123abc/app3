let currentPopup = null; // Biến toàn cục để lưu trữ popup hiện tại
let targetElement = null;
let flag = false;



document.addEventListener('mouseup', function (event) {
  // Lấy tọa độ của con trỏ chuột
  const mouseX = event.clientX;
  const mouseY = event.clientY;

  if (!flag) {
    // Lấy phần tử tại tọa độ chuột
    targetElement = document.elementFromPoint(mouseX, mouseY);
    console.log('point', targetElement);
    const selectedText = window.getSelection().toString().trim() || 'img';
    flag = true
    if (selectedText) {
      console.log('selected', selectedText);

      createIcon(selectedText);
    }
  }




});

function createIcon(selectedText) {
  const existingIcon = document.getElementById('highlight-icon');
  if (existingIcon) existingIcon.remove();

  const icon = document.createElement('div');
  icon.id = 'highlight-icon';
  icon.innerHTML = '💧'; // Biểu tượng giọt nước
  icon.style.position = 'absolute';
  icon.style.backgroundColor = 'white';
  icon.style.border = '1px solid #ccc';
  icon.style.padding = '5px';
  icon.style.zIndex = '9999';
  icon.style.cursor = 'pointer';

  const rect = window.getSelection().getRangeAt(0).getBoundingClientRect();
  console.log('react', rect);

  icon.style.top = `${rect.bottom + window.scrollY + 5}px`;
  icon.style.left = `${rect.left + window.scrollX}px`;

  document.body.appendChild(icon);

  icon.addEventListener('click', () => {
    // Đóng popup trước nếu có
    // if (currentPopup) {
    //   currentPopup.remove();
    // }
    // Gửi dữ liệu đã bôi đen đến background.js
    // chrome.runtime.sendMessage({ action: "sendSelectedText", text: selectedText });

    currentPopup = showPopup(selectedText || 'img', rect);
    console.log('clicked icon');
    icon.remove();
  });
}

function showPopup(selectedText, rect) {

  const popup = document.createElement('div');
  popup.style.position = 'absolute';
  popup.style.top = `${rect.bottom + window.scrollY + 10}px`;
  popup.style.left = `${rect.left + window.scrollX}px`;
  popup.style.backgroundColor = 'white';
  popup.style.border = '1px solid #ccc';
  popup.style.padding = '10px';
  popup.style.zIndex = '99999';
  popup.style.boxShadow = '0 0 10px rgba(0,0,0,0.5)';
  popup.style.borderRadius = '5px'; // Thêm bo góc
  popup.style.width = '200px'; // Chiều rộng cố định của popup  

  // Thêm nội dung text vào giữa
  const textElement = document.createElement('div');
  textElement.style.textAlign = 'center'; // Canh giữa text
  textElement.style.margin = '20px'; // Khoảng cách giữa text và close icon
  popup.appendChild(textElement);


  // Kiểm tra nếu phần tử là hình ảnh
  if (selectedText === 'img') {

    // Hiển thị nút lấy link ảnh
    const imgSrc = targetElement.src;
    console.log('this is img', imgSrc);
    chrome.runtime.sendMessage({ action: "sendSelectedText", img: imgSrc });
    textElement.innerText = 'Image selected.';

    // Thêm nút lấy link ảnh
    const linkButton = document.createElement('button');
    linkButton.innerText = 'link';
    linkButton.onclick = function () {
      alert(`Img link: ${imgSrc}`);
    };
    popup.appendChild(linkButton);
  } else {
    // Nếu là văn bản, hiển thị văn bản đã chọn
    textElement.innerText = selectedText;

    chrome.runtime.sendMessage({ action: "sendSelectedText", text: selectedText });
    // Thêm button copy
    const copyButton = document.createElement('button');
    copyButton.innerText = 'Copy';
    copyButton.style.marginBottom = '10px';
    copyButton.style.position = 'absolute';
    copyButton.style.top = '5px';
    copyButton.style.left = '10px';
    copyButton.onclick = function () {
      navigator.clipboard.writeText(selectedText).then(() => {
        alert('Copied to clipboard!');
      });
    };
    popup.appendChild(copyButton);
  }

  // Thêm button lấy HTML
  const htmlCssButton = document.createElement('button');
  htmlCssButton.innerText = 'html/css';
  htmlCssButton.style.marginBottom = '10px';
  htmlCssButton.style.position = 'absolute';
  htmlCssButton.style.top = '5px';
  htmlCssButton.style.left = '50px';
  htmlCssButton.onclick = function () {

    const elementTag = targetElement.tagName.toLowerCase();
    const elementHTML = targetElement.outerHTML;

    if (selectedText === 'img') {
      chrome.runtime.sendMessage({ action: "sendSelectedText", html: elementHTML, img: targetElement.src });

    } else {
      chrome.runtime.sendMessage({ action: "sendSelectedText", html: elementHTML, text: selectedText });

    }


    // Lấy CSS của phần tử
    const computedStyle = window.getComputedStyle(targetElement);
    let cssText = '';

    // Lặp qua các thuộc tính CSS và thêm vào cssText
    for (let i = 0; i < computedStyle.length; i++) {
      const prop = computedStyle[i];
      cssText += `${prop}: ${computedStyle.getPropertyValue(prop)};\n`;
    }

    alert(`Phần tử bao bọc: ${elementTag}\nHTML: ${elementHTML}\n\nCSS:${cssText}`);

  };
  popup.appendChild(htmlCssButton);

  popup.appendChild(textElement);


  // Thêm button lấy Network Data
  if (selectedText === 'img') {
    const networkButton = document.createElement('button');
    networkButton.innerText = 'Network';
    networkButton.style.marginBottom = '10px';
    htmlCssButton.style.position = 'absolute';
    htmlCssButton.style.top = '5px';
    htmlCssButton.style.left = '80px';
    networkButton.onclick = function () {
      const networkData = getNetworkRequestsForImage(targetElement);
      displayNetworkData(networkData);
      chrome.runtime.sendMessage({ action: "sendSelectedText", html: targetElement.outerHTML, img: targetElement.src,network:JSON.stringify(networkData) });
    }

    popup.appendChild(networkButton);
  };




  // Thêm biểu tượng "X" đỏ ở góc trên bên phải
  const closeButton = document.createElement('span');
  closeButton.innerHTML = '&times;';
  closeButton.style.color = 'red';
  closeButton.style.fontSize = '20px';
  closeButton.style.position = 'absolute';
  closeButton.style.cursor = 'pointer';
  closeButton.style.right = '8px';
  closeButton.style.top = '0px';
  closeButton.onclick = function () {
    flag = false
    popup.remove();
    currentPopup = null; // Đặt lại biến khi popup bị đóng
  };
  popup.appendChild(closeButton);

  document.body.appendChild(popup);

  // Cập nhật biến toàn cục
  currentPopup = popup; // Lưu trữ popup hiện tại

  return popup; // Trả về popup để có thể xóa sau này
}


// Lọc các yêu cầu mạng liên quan đến ảnh
function getNetworkRequestsForImage(imageElement) {
  const imageUrl = imageElement.src;
  const resources = window.performance.getEntriesByType("resource");
  let networkData = [];

  resources.forEach((resource) => {
    // Kiểm tra nếu URL của resource trùng với URL của ảnh
    if (resource.name === imageUrl) {
      networkData.push(resource);
    }
  });

  return networkData;
}

// Hiển thị dữ liệu network
function displayNetworkData(networkData) {
  let networkInfo = '';
  networkData.forEach((req, index) => {
    networkInfo += `Request ${index + 1}:\nURL: ${req.name}\nType: ${req.initiatorType}\nDuration: ${req.duration}ms\n\n`;
  });
  alert(`Network Data:\n${networkInfo}`);
}