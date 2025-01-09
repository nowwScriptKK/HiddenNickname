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
  toggleButton.style.marginLeft = "5px";
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

let debounceTimeout;
const observer = new MutationObserver(() => {
  clearTimeout(debounceTimeout);
  debounceTimeout = setTimeout(replaceNicknames, 100);
});

function injectStyles() {
  const style = document.createElement('style');
  style.textContent = `
    .toggle-nickname-button {
      background-color: #007bff;
      color: #fff;
      border: none;
      padding: 2px 5px;
      border-radius: 3px;
      cursor: pointer;
      font-size: 12px;
      margin-left: 5px; /* Ajout de l'espacement */
    }
    .toggle-nickname-button:hover {
      background-color: #0056b3;
    }
  `;
  document.head.appendChild(style);
}

function startScript() {
  nicknameMap = new Map();
  injectStyles();
  replaceNicknames();
  replaceNicknamesInSpans();
  observeChatTextDiv();
  observer.observe(document.body, { childList: true, subtree: true });
}

if (window.location.href.includes("chatiw")) {
  startScript();
}
