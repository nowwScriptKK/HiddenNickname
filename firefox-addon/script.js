let nicknameMap = new Map();

function generateUniqueNickname(existingNames) {
  let newNickname;
  do {
    newNickname = "User_" + Math.random().toString(36).substring(2, 8);
  } while (existingNames.has(newNickname));
  return newNickname;
}

function processNicknameElement(bNode, isIdNickname = false) {
  const originalNickname = bNode.textContent.trim().replace(/\s*:\s*$/, "");

  if (!nicknameMap.has(originalNickname)) {
    const existingNicknames = new Set(nicknameMap.values());
    const newNickname = generateUniqueNickname(existingNicknames);
    nicknameMap.set(originalNickname, newNickname);
  }

  const newNickname = nicknameMap.get(originalNickname);
  const wrapper = document.createElement("span");
  wrapper.style.display = "inline-flex";
  wrapper.style.alignItems = "center";

  const pseudoNode = document.createElement("span");
  pseudoNode.textContent = newNickname;
  wrapper.appendChild(pseudoNode);

  bNode.textContent = "";
  bNode.appendChild(wrapper);

  const toggleButton = document.createElement("button");
  toggleButton.textContent = "Toggle";
  toggleButton.classList.add("toggle-nickname-button");
  toggleButton.setAttribute("aria-label", `Toggle nickname for ${originalNickname}`);
  toggleButton.setAttribute("title", `Toggle nickname for ${originalNickname}`);

  toggleButton.addEventListener("click", () => {
    pseudoNode.textContent = pseudoNode.textContent === newNickname ? originalNickname : newNickname;
  });

  if (isIdNickname) {
    const parentA = bNode.closest('a');
    if (parentA) {
      parentA.parentNode.insertBefore(toggleButton, parentA.nextSibling);
    }
  } else {
    wrapper.appendChild(toggleButton);
  }
}

function replaceNicknamesInSpans() {
  document.querySelectorAll("span > b:not([data-processed])").forEach((bNode) => {
    bNode.setAttribute("data-processed", "true");
    processNicknameElement(bNode);
  });
}

function replaceNicknames() {
  document.querySelectorAll('#nickname:not([data-processed])').forEach((node) => {
    node.setAttribute('data-processed', 'true');
    processNicknameElement(node, true);
  });
}

function observeChatTextDiv() {
  const chatDiv = document.getElementById("chat_text_div");
  if (!chatDiv) return;

  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if (mutation.type === "childList" && mutation.addedNodes.length > 0) {
        mutation.addedNodes.forEach((node) => {
          if (node.nodeName === "SPAN" && node.querySelector("b")) {
            node.querySelectorAll("b").forEach((bNode) => {
              if (!bNode.hasAttribute("data-processed")) {
                processNicknameElement(bNode);
              }
            });
          }
        });
      }
    });
  });

  observer.observe(chatDiv, { childList: true, subtree: true });
}

function createPopupWindow() {
  const popup = document.createElement("div");
  popup.classList.add("nickname-popup");

  const popupHeader = document.createElement("div");
  popupHeader.classList.add("popup-header");
  popupHeader.textContent = "Nickname Mapping";

  const closeButton = document.createElement("button");
  closeButton.textContent = "✖";
  closeButton.classList.add("popup-close-button");
  closeButton.addEventListener("click", () => {
    popup.remove();
  });

  popupHeader.appendChild(closeButton);
  popup.appendChild(popupHeader);

  const popupContent = document.createElement("div");
  popupContent.classList.add("popup-content");

  const searchBox = document.createElement("input");
  searchBox.type = "text";
  searchBox.placeholder = "Search nicknames...";
  searchBox.classList.add("search-box");
  searchBox.addEventListener("input", (event) => {
    const query = event.target.value.toLowerCase();
    const listItems = popupContent.querySelectorAll("li");
    listItems.forEach((item) => {
      const text = item.textContent.toLowerCase();
      item.style.display = text.includes(query) ? "list-item" : "none";
    });
  });

  popupContent.appendChild(searchBox);

  const list = document.createElement("ul");
  nicknameMap.forEach((generated, original) => {
    const listItem = document.createElement("li");
    listItem.textContent = `${original} → ${generated}`;
    list.appendChild(listItem);
  });
  popupContent.appendChild(list);
  popup.appendChild(popupContent);

  document.body.appendChild(popup);

  // Make the popup draggable
  let isDragging = false;
  let offsetX, offsetY;

  popupHeader.addEventListener("mousedown", (e) => {
    isDragging = true;
    offsetX = e.clientX - popup.getBoundingClientRect().left;
    offsetY = e.clientY - popup.getBoundingClientRect().top;
  });

  document.addEventListener("mousemove", (e) => {
    if (isDragging) {
      popup.style.left = `${e.clientX - offsetX}px`;
      popup.style.top = `${e.clientY - offsetY}px`;
    }
  });

  document.addEventListener("mouseup", () => {
    isDragging = false;
  });
}

function addTopLeftButton() {
  const button = document.createElement("button");
  button.textContent = "Show Nicknames";
  button.classList.add("top-left-button");

  button.addEventListener("click", () => {
    createPopupWindow();
  });

  document.body.appendChild(button);
}

let debounceTimeout;
const observer = new MutationObserver(() => {
  clearTimeout(debounceTimeout);
  debounceTimeout = setTimeout(replaceNicknames, 100);
});

function injectStyles() {
  const style = document.createElement('style');
  style.textContent = `
    .toggle-nickname-button {
      background-color: #4CAF50; /* Correspond aux couleurs du site */
      color: #fff;
      border: 1px solid #3e8e41;
      padding: 4px 8px;
      border-radius: 5px;
      cursor: pointer;
      font-size: 14px;
      margin-left: 8px;
    }
    .toggle-nickname-button:hover {
      background-color: #45a049;
    }

    /* Alignement amélioré pour les boutons */
    span[data-processed="true"] {
      display: inline-flex;
      align-items: center;
    }

    .top-left-button {
      position: fixed;
      top: 10px;
      left: 10px;
      background-color: #007bff;
      color: white;
      border: none;
      padding: 8px 12px;
      border-radius: 5px;
      cursor: pointer;
      z-index: 1000;
    }

    .top-left-button:hover {
      background-color: #0056b3;
    }

    .nickname-popup {
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      background-color: white;
      border: 1px solid #ccc;
      border-radius: 5px;
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
      width: 300px;
      max-width: 90%;
      z-index: 1000;
      overflow: hidden;
    }

    .popup-header {
      background-color: #007bff;
      color: white;
      padding: 10px;
      font-size: 16px;
      font-weight: bold;
      display: flex;
      justify-content: space-between;
      align-items: center;
      cursor: move;
    }

    .popup-close-button {
      background: none;
      border: none;
      color: white;
      font-size: 16px;
      cursor: pointer;
    }

    .popup-content {
      padding: 10px;
      max-height: 200px;
      overflow-y: auto;
    }

    .popup-content ul {
      list-style: none;
      padding: 0;
      margin: 0;
    }

    .popup-content li {
      margin-bottom: 5px;
      font-size: 14px;
    }

    .search-box {
      width: calc(100% - 20px);
      padding: 5px 10px;
      margin-bottom: 10px;
      border: 1px solid #ccc;
      border-radius: 5px;
    }
  `;
  document.head.appendChild(style);
}

function startScript() {
  nicknameMap = new Map();
  injectStyles();
  addTopLeftButton();
  replaceNicknames();
  replaceNicknamesInSpans();
  observeChatTextDiv();
  observer.observe(document.body, { childList: true, subtree: true });
}

if (window.location.href.includes("chatiw")) {
  startScript();
}
