// public/script.js
// Complete script file with navbar, footer, search, admission form, and ENHANCED SMART CHATBOT

// ===============================
// 🧭 Dynamic Component Loader
// ===============================
async function loadComponent(id, file) {
  try {
    const path = window.location.pathname;
    const parts = path.split("/").filter(Boolean);
    let depth = Math.max(0, parts.length - 1);
    if (depth > 1) depth = 1;
    const prefix = depth === 0 ? "" : "../";

    const filePath = `${prefix}components/${file}`;
    console.log(`[loadComponent] fetching ${filePath} into #${id}`);

    const res = await fetch(filePath);
    if (!res.ok) throw new Error(`Failed to load ${filePath}`);
    const html = await res.text();

    const target = document.getElementById(id);
    if (!target) return console.warn(`[loadComponent] target #${id} not found`);
    target.innerHTML = html;

    // Re-init dropdowns if Bootstrap is used
    if (window.bootstrap) {
      document.querySelectorAll('[data-bs-toggle="dropdown"]').forEach(el => {
        try { new bootstrap.Dropdown(el); } catch (e) { }
      });
    }
  } catch (err) {
    console.error("[loadComponent] Error:", err);
  }
}

// ===============================
// 🏫 Main DOM Content Loaded
// ===============================
document.addEventListener("DOMContentLoaded", () => {
  loadComponent("navbar-container", "navbar.html");
  loadComponent("footer-container", "footer.html");

  initializeMainFeatures();
  initializeEnhancedChatbot();
});

// ===============================
// 🔧 Initialize Main Features
// ===============================
function initializeMainFeatures() {
  // 🔍 Search Function
  const searchBtn = document.getElementById('searchBtn');
  const siteSearch = document.getElementById('siteSearch');

  searchBtn?.addEventListener('click', (e) => {
    e.preventDefault();
    const query = siteSearch?.value?.trim();
    if (!query) return alert('Please type a search query.');
    alert('Search for: ' + query + '\n(Integrate real search backend later)');
  });

  // ====== Mega Menu Hover ======
  const mq = window.matchMedia('(min-width: 992px)');
  document.querySelectorAll('.navbar .dropdown.position-static').forEach(dd => {
    dd.addEventListener('mouseenter', () => {
      if (!mq.matches) return;
      const dropdown = bootstrap.Dropdown.getOrCreateInstance(dd.querySelector('[data-bs-toggle="dropdown"]'));
      dropdown.show();
    });
    dd.addEventListener('mouseleave', () => {
      if (!mq.matches) return;
      const dropdown = bootstrap.Dropdown.getOrCreateInstance(dd.querySelector('[data-bs-toggle="dropdown"]'));
      dropdown.hide();
    });
  });

  // ===============================
  // 🧾 Admission Form
  // ===============================
  const showLink = document.getElementById("showAdmissionForm");
  const admissionForm = document.getElementById("admissionForm");

  if (showLink && admissionForm) {
    showLink.addEventListener("click", (e) => {
      e.preventDefault();
      if (admissionForm.style.display === "none" || !admissionForm.style.display) {
        admissionForm.style.display = "block";
        showLink.textContent = "Hide Admission Form ▲";
      } else {
        admissionForm.style.display = "none";
        showLink.textContent = "ADMISSION 2025-26 (CLICK HERE) »";
      }
      admissionForm.scrollIntoView({ behavior: 'smooth' });
    });

    admissionForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const formData = {
        name: admissionForm.name.value,
        email: admissionForm.email.value,
        phone: admissionForm.phone.value,
        course: admissionForm.course.value
      };
      try {
        const res = await fetch('http://localhost:5000/api/admissions/apply', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData)
        });
        const result = await res.json();
        if (res.ok) {
          alert(result.message);
          admissionForm.reset();
          admissionForm.style.display = 'none';
          showLink.textContent = "ADMISSION 2025-26 (CLICK HERE) »";
        } else {
          alert(result.message || "Submission failed. Try again.");
        }
      } catch (err) {
        console.error(err);
        alert('Submission failed. Try again.');
      }
    });
  }

  // ===============================
  // 🎠 Testimonial Carousel Auto-rotation
  // ===============================
  const testimonialCarousel = document.getElementById('testimonialCarousel');
  if (testimonialCarousel) {
    const carousel = new bootstrap.Carousel(testimonialCarousel, {
      interval: 4000,
      ride: 'carousel',
      pause: 'hover'
    });
  }

  // ===============================
  // 📊 View Counter Animation
  // ===============================
  animateViewCounter();
}

// ===============================
// 🔢 Animate View Counter
// ===============================
function animateViewCounter() {
  const totalViewsEl = document.getElementById('totalViews');
  const todayViewsEl = document.getElementById('todayViews');
  
  if (!totalViewsEl || !todayViewsEl) return;

  // Get current values
  const totalViews = parseInt(totalViewsEl.textContent.replace(/,/g, '')) || 8101075;
  const todayViews = parseInt(todayViewsEl.textContent.replace(/,/g, '')) || 1;

  // Animate counting
  animateValue(totalViewsEl, 0, totalViews, 2000);
  animateValue(todayViewsEl, 0, todayViews, 1500);
}

function animateValue(element, start, end, duration) {
  let startTimestamp = null;
  const step = (timestamp) => {
    if (!startTimestamp) startTimestamp = timestamp;
    const progress = Math.min((timestamp - startTimestamp) / duration, 1);
    const value = Math.floor(progress * (end - start) + start);
    element.textContent = value.toLocaleString();
    if (progress < 1) {
      window.requestAnimationFrame(step);
    }
  };
  window.requestAnimationFrame(step);
}

// ===============================
// 🤖 ENHANCED SMART CHATBOT LOGIC
// ===============================
function initializeEnhancedChatbot() {
  const chatbotIcon = document.getElementById('chatbot-icon');
  const chatbotBox = document.getElementById('chatbot-box');
  const closeBtn = document.getElementById('chatbot-close');
  const sendBtn = document.getElementById('chatbot-send');
  const input = document.getElementById('chatbot-input');
  const messages = document.getElementById('chatbot-messages');

  if (!chatbotIcon || !chatbotBox) {
    console.warn('Chatbot elements not found');
    return;
  }

  // 🟢 Enhanced Styling for Chatbot
  const enhancedStyles = `
    .chatbot-msg {
      margin: 8px 0;
      padding: 12px 16px;
      border-radius: 18px;
      max-width: 85%;
      line-height: 1.5;
      word-wrap: break-word;
      white-space: pre-wrap;
      font-size: 14px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
      transition: all 0.3s ease;
    }
    
    .user-msg {
      background: linear-gradient(135deg, #ea66afff 0%, #ed0c80ff 100%);
      color: white;
      align-self: flex-end;
      border-bottom-right-radius: 4px;
      margin-left: auto;
    }
    
    .bot-msg {
      background: linear-gradient(135deg, #fb70c1ff 0%, #b00557ff 100%);
      color: white;
      align-self: flex-start;
      border-bottom-left-radius: 4px;
    }
    
    .typing-indicator {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 12px 16px;
      background: #f8f9fa;
      color: #6c757d;
      border-radius: 18px;
      align-self: flex-start;
      margin: 8px 0;
      font-style: italic;
    }
    
    .typing-dot {
      width: 8px;
      height: 8px;
      background: #6c757d;
      border-radius: 50%;
      animation: typing-bounce 1.4s infinite ease-in-out;
    }
    
    .typing-dot:nth-child(1) { animation-delay: -0.32s; }
    .typing-dot:nth-child(2) { animation-delay: -0.16s; }
    
    @keyframes typing-bounce {
      0%, 80%, 100% { transform: scale(0); }
      40% { transform: scale(1); }
    }
    
    .suggestion-chip {
      display: inline-block;
      background: rgba(255,255,255,0.2);
      padding: 6px 12px;
      margin: 4px;
      border-radius: 20px;
      font-size: 12px;
      cursor: pointer;
      transition: all 0.3s ease;
      border: 1px solid rgba(255,255,255,0.3);
    }
    
    .suggestion-chip:hover {
      background: rgba(255,255,255,0.3);
      transform: translateY(-2px);
    }
    
    .confidence-meter {
      font-size: 11px;
      color: rgba(255,255,255,0.8);
      text-align: center;
      margin: 4px 0;
      font-style: italic;
    }

    /* Gentle Zoom In/Out Animation */
    @keyframes gentleZoomInOut {
      0%, 100% {
        transform: scale(1);
      }
      50% {
        transform: scale(1.08);
      }
    }

    /* Pulse Animation for Attention */
    @keyframes attentionPulse {
      0%, 100% {
        transform: scale(1);
        box-shadow: 0 8px 18px rgba(0,0,0,0.3);
      }
      50% {
        transform: scale(1.12);
        box-shadow: 0 12px 25px rgba(0,0,0,0.4);
      }
    }

    .attention-grabber {
      animation: attentionPulse 2s ease-in-out !important;
    }

    /* Chatbot Header Draggable Styles */
    #chatbot-header {
      cursor: grab;
      user-select: none;
    }

    #chatbot-header:active {
      cursor: grabbing;
    }

    #chatbot-close {
      cursor: pointer;
    }
  `;

  // Add styles to document
  if (!document.querySelector('#chatbot-enhanced-styles')) {
    const styleElement = document.createElement('style');
    styleElement.id = 'chatbot-enhanced-styles';
    styleElement.textContent = enhancedStyles;
    document.head.appendChild(styleElement);
  }

  // 🟢 Tooltip Functions
  let tooltipTimeout;
  let attentionInterval;
  
  function showChatbotTooltip() {
    const tooltip = document.getElementById('chatbot-tooltip');
    if (tooltip && chatbotBox.style.display !== 'flex') {
      tooltip.style.display = 'block';
      tooltip.style.animation = 'tooltipFadeIn 0.5s ease-out';
      
      // Auto-hide tooltip after 4 seconds
      clearTimeout(tooltipTimeout);
      tooltipTimeout = setTimeout(() => {
        hideChatbotTooltip();
      }, 4000);
    }
  }
  
  function hideChatbotTooltip() {
    const tooltip = document.getElementById('chatbot-tooltip');
    if (tooltip) {
      tooltip.style.display = 'none';
    }
  }

  // 🟢 Auto-show tooltip at regular intervals with enhanced animations
  function startAutoTooltip() {
    // Add continuous gentle zoom animation to icon
    chatbotIcon.style.animation = 'gentleZoomInOut 4s ease-in-out infinite';

    // Show first tooltip after 8 seconds
    setTimeout(() => {
      if (chatbotBox.style.display !== 'flex') {
        showChatbotTooltip();
      }
    }, 8000);

    // Then show every 45 seconds
    setInterval(() => {
      if (chatbotBox.style.display !== 'flex') {
        showChatbotTooltip();
      }
    }, 10000);

    // Add occasional attention-grabbing pulse every 90 seconds
    attentionInterval = setInterval(() => {
      if (chatbotBox.style.display !== 'flex') {
        chatbotIcon.classList.add('attention-grabber');
        setTimeout(() => {
          chatbotIcon.classList.remove('attention-grabber');
        }, 2000);
      }
    }, 90000);
  }

  // 🟢 Open/Close Chat with Animation
  chatbotIcon.addEventListener('click', () => {
    if (chatbotBox.style.display === 'flex') {
      // Close with animation
      chatbotBox.style.animation = 'slideOut 0.3s ease forwards';
      setTimeout(() => {
        chatbotBox.style.display = "none";
        chatbotBox.style.animation = '';
        // Resume gentle animation when chat closes
        chatbotIcon.style.animation = 'gentleZoomInOut 4s ease-in-out infinite';
      }, 300);
    } else {
      // Open with animation
      chatbotBox.style.display = "flex";
      chatbotBox.style.animation = 'slideIn 0.3s ease forwards';
      // Pause gentle animation when chat opens
      chatbotIcon.style.animation = 'none';
      input.focus();
      hideChatbotTooltip(); // Hide tooltip when opening chatbot
      
      // Add welcome message if first time
      if (messages.children.length === 0) {
        showWelcomeMessage();
      }
    }
  });

  // 🟢 Mobile Touch Support
  chatbotIcon.addEventListener('touchstart', (e) => {
    e.preventDefault();
    chatbotIcon.click();
  }, { passive: false });

  // Prevent touch events from bubbling up
  chatbotIcon.addEventListener('touchend', (e) => {
    e.stopPropagation();
  });

  // Add slide animations
  if (!document.querySelector('#chatbot-animations')) {
    const animationStyles = `
      @keyframes slideIn {
        from {
          opacity: 0;
          transform: translateY(20px) scale(0.9);
        }
        to {
          opacity: 1;
          transform: translateY(0) scale(1);
        }
      }
      
      @keyframes slideOut {
        from {
          opacity: 1;
          transform: translateY(0) scale(1);
        }
        to {
          opacity: 0;
          transform: translateY(20px) scale(0.9);
        }
      }
      
      @keyframes pulse {
        0% { transform: scale(1); }
        50% { transform: scale(1.05); }
        100% { transform: scale(1); }
      }
      
      .pulse-animation {
        animation: pulse 2s infinite;
      }

      @keyframes float {
        0%, 100% { transform: translateY(0px); }
        50% { transform: translateY(-5px); }
      }
      
      .float-animation {
        animation: float 3s ease-in-out infinite;
      }

      @keyframes tooltipFadeIn {
        from {
          opacity: 0;
          transform: translateY(10px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }
    `;
    const styleElement = document.createElement('style');
    styleElement.id = 'chatbot-animations';
    styleElement.textContent = animationStyles;
    document.head.appendChild(styleElement);
  }

  // Add float animation to icon
  chatbotIcon.classList.add('float-animation');

  closeBtn?.addEventListener('click', () => {
    chatbotBox.style.animation = 'slideOut 0.3s ease forwards';
    setTimeout(() => {
      chatbotBox.style.display = "none";
      chatbotBox.style.animation = '';
      // Resume gentle animation when chat closes
      chatbotIcon.style.animation = 'gentleZoomInOut 4s ease-in-out infinite';
    }, 300);
  });

  // 🟢 Enhanced Append Message Function
  function appendMessage(text, cls, options = {}) {
    const { intent, confidence, suggestions = [] } = options;
    
    const msg = document.createElement('div');
    msg.classList.add('chatbot-msg', cls);
    
    // Format text with markdown-like syntax
    const formatted = text
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/\n/g, '<br>');
    
    msg.innerHTML = formatted;
    
    // Add message to chat
    messages.appendChild(msg);
    
    // Add confidence meter for low confidence answers
    if (confidence && confidence < 0.4 && cls === 'bot-msg') {
      const confidenceEl = document.createElement('div');
      confidenceEl.classList.add('confidence-meter');
      confidenceEl.textContent = `🤔 I'm ${Math.round(confidence * 100)}% confident about this answer`;
      messages.appendChild(confidenceEl);
    }
    
    // Add suggestion chips
    if (suggestions.length > 0 && cls === 'bot-msg') {
      const suggestionsEl = document.createElement('div');
      suggestionsEl.style.marginTop = '8px';
      suggestionsEl.style.display = 'flex';
      suggestionsEl.style.flexWrap = 'wrap';
      suggestionsEl.style.gap = '4px';
      
      suggestions.forEach(suggestion => {
        const chip = document.createElement('span');
        chip.classList.add('suggestion-chip');
        chip.textContent = suggestion;
        chip.addEventListener('click', () => {
          input.value = suggestion;
          sendMessage();
        });
        suggestionsEl.appendChild(chip);
      });
      
      messages.appendChild(suggestionsEl);
    }
    
    messages.scrollTop = messages.scrollHeight;
  }

  // 🟢 Show Typing Indicator
  function showTyping() {
    const typingMsg = document.createElement('div');
    typingMsg.classList.add('typing-indicator');
    typingMsg.innerHTML = `
      <div class="typing-dot"></div>
      <div class="typing-dot"></div>
      <div class="typing-dot"></div>
      <span>RJ Assistant is thinking...</span>
    `;
    
    messages.appendChild(typingMsg);
    messages.scrollTop = messages.scrollHeight;
    return typingMsg;
  }

  // 🟢 Show Welcome Message with Suggestions
  function showWelcomeMessage() {
    const welcomeText = `🎓 **Welcome to RJ College Smart Assistant!** 

I can help you with:

• **Admissions 2025-26** - Process, deadlines, requirements
• **Courses & Programs** - UG, PG, Diploma details  
• **College Information** - Principal, autonomous status, NAAC grade
• **Quick Links** - Grievance, ICC, RTI, Academic calendar
• **Student Resources** - Study corner, testimonials, events

What would you like to know about RJ College?`;

    const suggestions = [
      "Admission process",
      "Courses offered", 
      "Principal details",
      "Academic calendar",
      "Contact information"
    ];

    appendMessage(welcomeText, 'bot-msg', { suggestions });
  }

  // 🟢 Send Message to Smart Chatbot
  async function sendMessage() {
    const text = input.value.trim();
    if (!text) return;
    
    // Add user message
    appendMessage(text, 'user-msg');
    input.value = '';
    
    // Show typing indicator
    const typingMsg = showTyping();
    
    try {
      const response = await fetch('http://localhost:5000/api/chatbot/ask', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ question: text })
      });
      
      const data = await response.json();
      
      // Remove typing indicator
      typingMsg.remove();
      
      if (data.success) {
        const suggestions = data.suggestedQuestions || [];
        appendMessage(data.answer, 'bot-msg', {
          intent: data.intent,
          confidence: data.confidence,
          suggestions: suggestions
        });
        
      } else {
        appendMessage("I apologize, but I'm having trouble processing your request. Please try again in a moment.", 'bot-msg');
      }
      
    } catch (error) {
      console.error('Chatbot error:', error);
      typingMsg.remove();
      
      // Enhanced fallback responses when server is unavailable
      const fallbackResponses = [
        "I understand you're asking about RJ College. Currently, I'm having connection issues. Please try again shortly or visit our website directly for information.",
        "Thank you for your question! I'm temporarily unavailable. You can check our admission section or contact the administration office for immediate assistance.",
        "I appreciate your query about RJ College. For the most current information, please visit our official website or contact us directly."
      ];
      
      const randomResponse = fallbackResponses[Math.floor(Math.random() * fallbackResponses.length)];
      appendMessage(randomResponse, 'bot-msg');
    }
  }

  // 🟢 Event Listeners for Chat
  sendBtn?.addEventListener('click', sendMessage);
  
  input?.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      sendMessage();
    }
  });

  // 🟢 Input Auto-resize and Focus
  input?.addEventListener('focus', () => {
    chatbotBox.style.boxShadow = '0 15px 35px rgba(0,0,0,0.4)';
  });
  
  input?.addEventListener('blur', () => {
    chatbotBox.style.boxShadow = '0 10px 25px rgba(0,0,0,0.3)';
  });

  // 🟢 Enhanced Draggable Functionality for Icon
  let isDragging = false;
  let offsetX = 0;
  let offsetY = 0;
  let startX, startY;

  chatbotIcon.addEventListener('mousedown', (e) => {
    isDragging = true;
    startX = e.clientX;
    startY = e.clientY;
    
    const rect = chatbotIcon.getBoundingClientRect();
    offsetX = e.clientX - rect.left;
    offsetY = e.clientY - rect.top;
    
    chatbotIcon.style.cursor = 'grabbing';
    chatbotIcon.style.transition = 'none';
    // Pause animations while dragging
    chatbotIcon.style.animation = 'none';
    hideChatbotTooltip(); // Hide tooltip when dragging
    e.preventDefault();
  });

  document.addEventListener('mousemove', (e) => {
    if (!isDragging) return;
    
    const x = e.clientX - offsetX;
    const y = e.clientY - offsetY;
    
    // Keep within viewport bounds with margin
    const margin = 20;
    const maxX = window.innerWidth - chatbotIcon.offsetWidth - margin;
    const maxY = window.innerHeight - chatbotIcon.offsetHeight - margin;
    
    const boundedX = Math.max(margin, Math.min(x, maxX));
    const boundedY = Math.max(margin, Math.min(y, maxY));
    
    chatbotIcon.style.left = boundedX + 'px';
    chatbotIcon.style.top = boundedY + 'px';
    chatbotIcon.style.right = 'auto';
    chatbotIcon.style.bottom = 'auto';
    
    // Move chatbox with icon (maintain relative position)
    if (chatbotBox.style.display === 'flex') {
      const chatboxX = boundedX - chatbotBox.offsetWidth + chatbotIcon.offsetWidth;
      const chatboxY = boundedY - chatbotBox.offsetHeight - 10;
      
      // Ensure chatbox stays in viewport
      const chatboxMaxX = window.innerWidth - chatbotBox.offsetWidth - margin;
      const chatboxMaxY = window.innerHeight - chatbotBox.offsetHeight - margin;
      
      const boundedChatboxX = Math.max(margin, Math.min(chatboxX, chatboxMaxX));
      const boundedChatboxY = Math.max(margin, Math.min(chatboxY, chatboxMaxY));
      
      chatbotBox.style.left = boundedChatboxX + 'px';
      chatbotBox.style.top = boundedChatboxY + 'px';
      chatbotBox.style.right = 'auto';
      chatbotBox.style.bottom = 'auto';
    }

    // Update tooltip position
    const tooltip = document.getElementById('chatbot-tooltip');
    if (tooltip) {
      tooltip.style.right = 'auto';
      tooltip.style.bottom = 'auto';
      tooltip.style.left = (boundedX - 60) + 'px';
      tooltip.style.top = (boundedY - 80) + 'px';
    }
  });

  document.addEventListener('mouseup', (e) => {
    if (!isDragging) return;
    
    isDragging = false;
    chatbotIcon.style.cursor = 'pointer';
    chatbotIcon.style.transition = 'transform 0.3s ease, background-color 0.3s ease';
    
    // Resume animations after dragging
    if (chatbotBox.style.display !== 'flex') {
      chatbotIcon.style.animation = 'gentleZoomInOut 4s ease-in-out infinite';
    }
    
    // Check if it was a click (minimal movement)
    const endX = e.clientX;
    const endY = e.clientY;
    const distance = Math.sqrt(Math.pow(endX - startX, 2) + Math.pow(endY - startY, 2));
    
    if (distance < 5) {
      // It was a click, toggle chat
      chatbotIcon.click();
    }
  });

  // 🟢 CHATBOT BOX DRAGGABLE FUNCTIONALITY
  let isChatboxDragging = false;
  let chatboxOffsetX = 0;
  let chatboxOffsetY = 0;
  let chatboxStartX, chatboxStartY;

  // Make chatbot header draggable
  const chatbotHeader = document.getElementById('chatbot-header');

  chatbotHeader.addEventListener('mousedown', (e) => {
    if (e.target.id === 'chatbot-close') return; // Don't drag when clicking close button
    
    isChatboxDragging = true;
    chatboxStartX = e.clientX;
    chatboxStartY = e.clientY;
    
    const rect = chatbotBox.getBoundingClientRect();
    chatboxOffsetX = e.clientX - rect.left;
    chatboxOffsetY = e.clientY - rect.top;
    
    chatbotBox.style.transition = 'none';
    chatbotBox.style.cursor = 'grabbing';
    e.preventDefault();
  });

  // Touch events for mobile chatbox dragging
  chatbotHeader.addEventListener('touchstart', (e) => {
    if (e.target.id === 'chatbot-close') return;
    
    isChatboxDragging = true;
    const touch = e.touches[0];
    chatboxStartX = touch.clientX;
    chatboxStartY = touch.clientY;
    
    const rect = chatbotBox.getBoundingClientRect();
    chatboxOffsetX = touch.clientX - rect.left;
    chatboxOffsetY = touch.clientY - rect.top;
    
    chatbotBox.style.transition = 'none';
    chatbotBox.style.cursor = 'grabbing';
    e.preventDefault();
  }, { passive: false });

  // Mouse move for both icon and chatbox
  document.addEventListener('mousemove', (e) => {
    // Chatbot box dragging
    if (isChatboxDragging) {
      const x = e.clientX - chatboxOffsetX;
      const y = e.clientY - chatboxOffsetY;
      
      // Keep within viewport bounds with margin
      const margin = 20;
      const maxX = window.innerWidth - chatbotBox.offsetWidth - margin;
      const maxY = window.innerHeight - chatbotBox.offsetHeight - margin;
      
      const boundedX = Math.max(margin, Math.min(x, maxX));
      const boundedY = Math.max(margin, Math.min(y, maxY));
      
      chatbotBox.style.left = boundedX + 'px';
      chatbotBox.style.top = boundedY + 'px';
      chatbotBox.style.right = 'auto';
      chatbotBox.style.bottom = 'auto';
    }
  });

  // Touch move for both icon and chatbox
  document.addEventListener('touchmove', (e) => {
    if (!e.touches.length) return;
    
    const touch = e.touches[0];
    
    // Chatbot box dragging
    if (isChatboxDragging) {
      const x = touch.clientX - chatboxOffsetX;
      const y = touch.clientY - chatboxOffsetY;
      
      // Keep within viewport bounds with margin
      const margin = 20;
      const maxX = window.innerWidth - chatbotBox.offsetWidth - margin;
      const maxY = window.innerHeight - chatbotBox.offsetHeight - margin;
      
      const boundedX = Math.max(margin, Math.min(x, maxX));
      const boundedY = Math.max(margin, Math.min(y, maxY));
      
      chatbotBox.style.left = boundedX + 'px';
      chatbotBox.style.top = boundedY + 'px';
      chatbotBox.style.right = 'auto';
      chatbotBox.style.bottom = 'auto';
    }
  });

  // Mouse up for both
  document.addEventListener('mouseup', (e) => {
    if (isChatboxDragging) {
      isChatboxDragging = false;
      chatbotBox.style.transition = 'transform 0.3s ease';
      chatbotBox.style.cursor = 'default';
      
      // Check if it was a click (minimal movement)
      const endX = e.clientX;
      const endY = e.clientY;
      const distance = Math.sqrt(Math.pow(endX - chatboxStartX, 2) + Math.pow(endY - chatboxStartY, 2));
      
      if (distance < 5) {
        // It was a click, focus input
        input.focus();
      }
    }
  });

  // Touch end for both
  document.addEventListener('touchend', (e) => {
    if (isChatboxDragging) {
      isChatboxDragging = false;
      chatbotBox.style.transition = 'transform 0.3s ease';
      chatbotBox.style.cursor = 'default';
      
      // Check if it was a tap (minimal movement)
      if (e.changedTouches.length) {
        const endX = e.changedTouches[0].clientX;
        const endY = e.changedTouches[0].clientY;
        const distance = Math.sqrt(Math.pow(endX - chatboxStartX, 2) + Math.pow(endY - chatboxStartY, 2));
        
        if (distance < 10) {
          // It was a tap, focus input
          input.focus();
        }
      }
    }
  });

  // Prevent dragging when interacting with chat elements
  const preventDragElements = [input, sendBtn, closeBtn, messages];
  preventDragElements.forEach(el => {
    el?.addEventListener('mousedown', (e) => {
      e.stopPropagation();
    });
  });

  // Prevent chatbox dragging when interacting with chat elements
  const preventChatboxDragElements = [input, sendBtn, messages];
  preventChatboxDragElements.forEach(el => {
    el?.addEventListener('mousedown', (e) => {
      e.stopPropagation();
    });
    
    el?.addEventListener('touchstart', (e) => {
      e.stopPropagation();
    }, { passive: false });
  });

  // 🟢 Auto-focus and enter key enhancement
  input?.addEventListener('input', () => {
    // Enable/disable send button based on input
    if (sendBtn) {
      sendBtn.disabled = !input.value.trim();
    }
  });

  // Initialize send button state
  if (sendBtn && input) {
    sendBtn.disabled = !input.value.trim();
  }

  // 🟢 Add hover event listeners for tooltip
  chatbotIcon.addEventListener('mouseenter', () => {
    showChatbotTooltip();
    // Pause gentle animation on hover
    chatbotIcon.style.animation = 'none';
  });
  
  chatbotIcon.addEventListener('mouseleave', () => {
    hideChatbotTooltip();
    // Resume gentle animation when mouse leaves (if chat is not open)
    if (chatbotBox.style.display !== 'flex') {
      chatbotIcon.style.animation = 'gentleZoomInOut 4s ease-in-out infinite';
    }
  });

  // 🟢 Start automatic tooltip display with enhanced animations
  startAutoTooltip();

  console.log('🤖 Enhanced Chatbot initialized with zoom animations and automatic tooltip');
}
// ===============================
// 🎯 Utility Functions
// ===============================

// Debounce function for performance
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// Smooth scroll to element
function smoothScrollTo(element) {
  element?.scrollIntoView({ 
    behavior: 'smooth',
    block: 'start'
  });
}

// Format date for display
function formatDate(date) {
  return new Date(date).toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}

// Export functions for global access (if needed)
window.RJCollege = {
  smoothScrollTo,
  formatDate,
  debounce
};
  
console.log('🚀 RJ College website initialized with ENHANCED SMART CHATBOT');