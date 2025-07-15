const msgerForm = document.querySelector(".input-area");
const msgerInput = document.querySelector("#textInput");
const msgerChat = document.querySelector(".chat-area");

const BOT_NAME = "🩺 RemoteCare";
const PERSON_NAME = "👤 You";

msgerForm.addEventListener("submit", event => {
    event.preventDefault();

    const msgText = msgerInput.value;
    if (!msgText) return;

    appendMessage(PERSON_NAME, "right", msgText);
    msgerInput.value = "";
    botResponse(msgText);
});

function appendMessage(name, side, text) {
    const msgBubbleClass = side === "right" 
        ? "user-bubble rounded-tl-2xl rounded-tr-none rounded-bl-2xl rounded-br-2xl text-white" 
        : "bot-bubble rounded-tl-none rounded-tr-2xl rounded-bl-2xl rounded-br-2xl";
    
    const nameClass = side === "right" ? "text-white text-opacity-90" : "text-white";
    
    let msgHTML = `
    <div class="msg ${side}-msg flex ${side === "right" ? "justify-end" : "justify-start"} mb-4 w-full">
        <div class="msg-bubble ${msgBubbleClass} p-4 max-w-xs md:max-w-md shadow-sm relative">
            <div class="msg-info mb-2 flex items-center justify-between">
                <div class="msg-info-name font-semibold ${nameClass}">${name}</div>
                <div class="msg-info-time text-xs opacity-75 ml-2">${formatDate(new Date())}</div>
            </div>
            <div class="msg-text">${text}</div>
        </div>
    </div>`;

    msgerChat.insertAdjacentHTML("beforeend", msgHTML);
    msgerChat.scrollTop = msgerChat.scrollHeight;
}

function botResponse(rawText) {
    // Show typing indicator
    const typingHTML = `
    <div id="typing-indicator" class="msg left-msg flex justify-start mb-4">
        <div class="msg-bubble bot-bubble rounded-tl-none rounded-tr-2xl rounded-bl-2xl rounded-br-2xl p-4 max-w-xs md:max-w-md shadow-sm relative">
            <div class="typing-indicator">
                <span></span>
                <span></span>
                <span></span>
            </div>
        </div>
    </div>`;
    msgerChat.insertAdjacentHTML("beforeend", typingHTML);
    msgerChat.scrollTop = msgerChat.scrollHeight;
    
    $.get("/response", { msg: rawText }).done(function (data) {
        // Remove typing indicator
        document.getElementById("typing-indicator").remove();
        
        // Handle both string and JSON responses
        const response = typeof data === 'string' ? data : JSON.stringify(data);
        appendMessage(BOT_NAME, "left", response);
    });
}

function formatDate(date) {
    const h = "0" + date.getHours();
    const m = "0" + date.getMinutes();
    return `${h.slice(-2)}:${m.slice(-2)}`;
}

function goHome() {
    // Replace with your actual home page URL
    window.location.href = "/";
}

// Create floating spiritual particles
function createParticle() {
    const particles = ['💊', '🩺', '🏥', '💉', '🧪', '🧬', '⚕️'];
    const particle = document.createElement('div');
    particle.className = 'particle';
    particle.innerHTML = particles[Math.floor(Math.random() * particles.length)];
    particle.style.left = Math.random() * 100 + '%';
    particle.style.fontSize = (Math.random() * 1.5 + 0.5) + 'rem';
    particle.style.animationDelay = Math.random() * 20 + 's';
    particle.style.animationDuration = (Math.random() * 10 + 15) + 's';
    
    document.getElementById('particles').appendChild(particle);

    setTimeout(() => {
        particle.remove();
    }, 25000);
}

// Create particles periodically
setInterval(createParticle, 2000);

// Create initial particles
for (let i = 0; i < 3; i++) {
    setTimeout(createParticle, i * 1000);
}

// Create floating circles in background
function createFloatingCircles() {
    const circlesContainer = document.getElementById('floating-circles');
    circlesContainer.innerHTML = ''; // Clear existing circles
    
    // Create 8 random circles
    for (let i = 0; i < 8; i++) {
        const circle = document.createElement('div');
        circle.className = 'floating-circle';
        
        // Random size between 100px and 300px
        const size = Math.floor(Math.random() * 200) + 100;
        circle.style.width = `${size}px`;
        circle.style.height = `${size}px`;
        
        // Random position
        circle.style.top = `${Math.random() * 100}%`;
        circle.style.left = `${Math.random() * 100}%`;
        
        // Random animation delay and duration
        circle.style.animationDelay = `${Math.random() * 5}s`;
        circle.style.animationDuration = `${Math.random() * 10 + 15}s`;
        
        // Random opacity
        circle.style.opacity = (Math.random() * 0.5 + 0.1).toString();
        
        circlesContainer.appendChild(circle);
    }
}

// Initialize floating circles
createFloatingCircles();

// Recreate circles occasionally for variety
setInterval(createFloatingCircles, 30000);