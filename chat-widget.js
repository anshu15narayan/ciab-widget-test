(function() {
  const API_ENDPOINT = 'https://cortex-chat-widget-d.apps-d.lrl.lilly.com/ask/'
  const CORTEX_MODEL = 'bartender-bot'

  document.head.insertAdjacentHTML('beforeend', '<link href="https://cdnjs.cloudflare.com/ajax/libs/tailwindcss/2.2.16/tailwind.min.css" rel="stylesheet">');

  // Inject the CSS
  const style = document.createElement('style');
  style.innerHTML = `
  .hidden {
    display: none;
  }
  #chat-widget-container {
    position: fixed;
    bottom: 20px;
    right: 20px;
    flex-direction: column;
  }
  #chat-popup {
    height: 70vh;
    max-height: 70vh;
    transition: all 0.3s;
    overflow: hidden;
  }
  @media (max-width: 768px) {
    #chat-popup {
      position: fixed;
      top: 0;
      right: 0;
      bottom: 0;
      left: 0;
      width: 100%;
      height: 100%;
      max-height: 100%;
      border-radius: 0;
    }
  }
  @keyframes bounce {
    0%, 80% { transform: translateY(0); }
    40% { transform: translateY(-6px); }
  }

  .dot1, .dot2, .dot3 {
    width: 8px;
    height: 8px;
    background-color: black;
    border-radius: 50%;
    margin-right: 4px;
    margin-top: 6px;
    animation: bounce 0.8s infinite cubic-bezier(0.5, 0.05, 0.1, 0.3);
  }

  .dot2 {
    animation-delay: 0.2s;
  }

  .dot3 {
    animation-delay: 0.4s;
    margin-right: 0px;
  }
  `;

  document.head.appendChild(style);

  // Create chat widget container
  const chatWidgetContainer = document.createElement('div');
  chatWidgetContainer.id = 'chat-widget-container';
  document.body.appendChild(chatWidgetContainer);
  
  // Inject the HTML
  chatWidgetContainer.innerHTML = ` 
    <div id="chat-bubble" class="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center cursor-pointer text-3xl">
      <svg xmlns="http://www.w3.org/2000/svg" class="w-10 h-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
        <path stroke-linecap="round" stroke-linejoin="round" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
      </svg>
    </div>
    <div id="chat-popup" class="hidden absolute bottom-20 right-0 w-96 bg-white rounded-md shadow-md flex flex-col transition-all text-sm">
      <div id="chat-header" class="flex justify-between items-center p-4 bg-gray-800 text-white rounded-t-md">
        <h3 class="m-0 text-lg">Cortex Chat Widget</h3>
        <button id="close-popup" class="bg-transparent border-none text-white cursor-pointer">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
      <div id="chat-messages" class="flex-1 p-4 overflow-y-auto"></div>
      <div id="chat-input-container" class="p-4 border-t border-gray-200">
        <div class="flex space-x-4 items-center">
          <input type="text" id="chat-input" class="flex-1 border border-gray-300 rounded-md px-4 py-2 h-10 outline-none w-3/4" placeholder="Type your message...">
          <button id="chat-submit" class="bg-gray-800 text-white rounded-md px-4 py-1 h-10 cursor-pointer">
            <svg xmlns="http://www.w3.org/2000/svg" width="1.5rem" height="1.5rem" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M10 14l11 -11"></path>
              <path d="M21 3l-6.5 18a.55 .55 0 0 1 -1 0l-3.5 -7l-7 -3.5a.55 .55 0 0 1 0 -1l18 -6.5"></path>
            </svg>
          </button>
        </div>
      </div>
    </div>
  `;

  // Add event listeners
  const chatInput = document.getElementById('chat-input');
  const chatSubmit = document.getElementById('chat-submit');
  const chatMessages = document.getElementById('chat-messages');
  const chatBubble = document.getElementById('chat-bubble');
  const chatPopup = document.getElementById('chat-popup');
  const closePopup = document.getElementById('close-popup');

  chatSubmit.addEventListener('click', async function() {
    
    const message = chatInput.value.trim();
    if (!message) return;
    
    chatMessages.scrollTop = chatMessages.scrollHeight;

    chatInput.value = '';

    await onUserRequest(message);

  });

  chatInput.addEventListener('keyup', function(event) {
    if (event.key === 'Enter') {
      chatSubmit.click();
    }
  });

  chatBubble.addEventListener('click', function() {
    togglePopup();
  });

  closePopup.addEventListener('click', function() {
    togglePopup();
  });

  function togglePopup() {
    const chatPopup = document.getElementById('chat-popup');
    chatPopup.classList.toggle('hidden');
    if (!chatPopup.classList.contains('hidden')) {
      document.getElementById('chat-input').focus();
    }
  }  

  async function onUserRequest(message) {
    // Handle user request here
    console.log('User request:', message);
  
    // Display user message
    const messageElement = document.createElement('div');
    messageElement.className = 'flex justify-end mb-3';
    messageElement.innerHTML = `
      <div class="bg-gray-800 text-white rounded-lg py-2 px-4 max-w-[70%]">
        ${message}
      </div>
    `;
    chatMessages.appendChild(messageElement);
    chatMessages.scrollTop = chatMessages.scrollHeight;

    // Display loading indicator
    const loadingElement = document.createElement('div');
    loadingElement.className = 'flex mb-3';
    loadingElement.innerHTML = `
        <div class="bg-gray-200 text-black rounded-lg py-2 px-4 max-w-[70%]">
            <div class="flex items-center">
              <div class="dot1"></div>
              <div class="dot2"></div>
              <div class="dot3"></div>
            </div>
        </div>
    `;
    chatMessages.appendChild(loadingElement);
    chatMessages.scrollTop = chatMessages.scrollHeight;
  
    chatInput.value = '';
  
    // Reply to the user
    askCortex(message)
      .then(responseMessage => {
        chatMessages.removeChild(loadingElement);
        reply(responseMessage.message)
      })
      .catch(error => {
        console.log('Error: ', error);
        chatMessages.removeChild(loadingElement);
        reply("Failed to connect to cortex.")
      })
  }
  
  function reply(message) {
    const chatMessages = document.getElementById('chat-messages');
    const replyElement = document.createElement('div');
    replyElement.className = 'flex mb-3';
    replyElement.innerHTML = `
      <div class="bg-gray-200 text-black rounded-lg py-2 px-4 max-w-[70%]">
        ${message}
      </div>
    `;
    chatMessages.appendChild(replyElement);
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }
  
  async function askCortex(message) {
    const qparams = {
      'q': message
    };
    
    const queryString = new URLSearchParams(qparams).toString();
    const fullUrl = `${API_ENDPOINT}${CORTEX_MODEL}?${queryString}`;

    var responseText = "Failed to connect to cortex."

    const request = fetch(fullUrl, {
      method: 'GET',
    })
    
    return request
      .then(response => {
        console.log(response.status)
        if (response.status == 200) {
          return response.json();
        } else {
          throw new Error("Failed to connect to cortex.");
        }
      })
      .then(data => {
        //TODO Process data here!
        return data;
      })
      .catch(error => {
        throw error;
      });
  }
})();
