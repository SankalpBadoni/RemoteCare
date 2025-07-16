// Doctor Dashboard JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // Initialize the dashboard
    initializeDashboard();
    
    // Load patients from localStorage
    loadPatients();
    
    // Set up event listeners
    setupEventListeners();
});

// Initialize dashboard with demo stats
function initializeDashboard() {
    // Get doctor name from localStorage or use default
    const doctorName = localStorage.getItem('doctorName') || 'Smith';
    document.getElementById('doctor-name').textContent = doctorName;
    
    // Set up demo stats
    updateDashboardStats();
}

// Update the dashboard statistics
function updateDashboardStats() {
    const patients = getPatients();
    
    // Update total patients count
    document.getElementById('total-patients').textContent = patients.length;
    
    // For demo purposes, set other stats
    document.getElementById('today-appointments').textContent = Math.floor(Math.random() * 5) + 1;
    document.getElementById('pending-reports').textContent = Math.floor(Math.random() * 3);
    document.getElementById('new-messages').textContent = Math.floor(Math.random() * 4);
}

// Get patients from localStorage
function getPatients() {
    let patients = [];
    
    try {
        // Try to get patients from localStorage
        const storedPatients = localStorage.getItem('patients');
        
        if (storedPatients) {
            patients = JSON.parse(storedPatients);
        } else {
            // If no patients in localStorage, add demo data
            patients = getDemoPatients();
            localStorage.setItem('patients', JSON.stringify(patients));
        }
    } catch (error) {
        console.error('Error retrieving patients from localStorage:', error);
        patients = getDemoPatients();
    }
    
    return patients;
}

// Load patients into the UI
function loadPatients() {
    const patients = getPatients();
    const patientsContainer = document.getElementById('patients-container');
    const noPatients = document.getElementById('no-patients');
    
    // Clear previous content
    patientsContainer.innerHTML = '';
    
    // Show/hide empty state
    if (patients.length === 0) {
        noPatients.style.display = 'flex';
    } else {
        noPatients.style.display = 'none';
        
        // Render each patient card
        patients.forEach(patient => {
            patientsContainer.appendChild(createPatientCard(patient));
        });
    }
    
    // Update dashboard stats
    updateDashboardStats();
}

// Create a patient card element
function createPatientCard(patient) {
    const card = document.createElement('div');
    card.className = 'patient-card';
    card.dataset.patientId = patient.id;
    
    // Get a summarized version of diagnosis
    const diagnosisSummary = patient.diagnosis ? 
        (patient.diagnosis.length > 120 ? patient.diagnosis.substring(0, 120) + '...' : patient.diagnosis) : 
        'No diagnosis information available.';
    
    card.innerHTML = `
        <div class="patient-header">
            <h3 class="patient-name">${patient.name}</h3>
            <span class="patient-status">Active</span>
        </div>
        <div class="patient-body">
            <div class="patient-info-item">
                <span class="info-label">Age</span>
                <span class="info-value">${patient.age}</span>
            </div>
            <div class="patient-info-item">
                <span class="info-label">Gender</span>
                <span class="info-value">${patient.gender || 'Not specified'}</span>
            </div>
            <div class="diagnosis-preview">
                <h4>Diagnosis Summary</h4>
                <p>${diagnosisSummary}</p>
            </div>
        </div>
        <div class="patient-footer">
            <button class="patient-action-btn primary-action view-details-btn" data-patient-id="${patient.id}">
                <i class="fas fa-user-md"></i> View Details
            </button>
            <button class="patient-action-btn secondary-action connect-btn" data-patient-id="${patient.id}">
                <i class="fas fa-comment-medical"></i> Connect
            </button>
        </div>
    `;
    
    return card;
}

// Set up event listeners
function setupEventListeners() {
    // Patient search
    const searchInput = document.getElementById('patient-search');
    searchInput.addEventListener('input', function() {
        searchPatients(this.value);
    });
    
    // Modal close button
    const closeModal = document.querySelector('.close-modal');
    closeModal.addEventListener('click', function() {
        hidePatientModal();
    });
    
    // Click outside modal to close
    const modal = document.getElementById('patient-modal');
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            hidePatientModal();
        }
    });
    
    // Escape key to close modal
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            hidePatientModal();
        }
    });
    
    // Connect button in modal
    document.getElementById('connect-patient-btn').addEventListener('click', function() {
        const patientId = this.dataset.patientId;
        connectWithPatient(patientId);
    });
    
    // Event delegation for patient cards
    document.getElementById('patients-container').addEventListener('click', function(e) {
        // View details button
        if (e.target.classList.contains('view-details-btn') || 
            e.target.parentElement.classList.contains('view-details-btn')) {
            const button = e.target.classList.contains('view-details-btn') ? 
                e.target : e.target.parentElement;
            const patientId = button.dataset.patientId;
            showPatientDetails(patientId);
        }
        
        // Connect button
        if (e.target.classList.contains('connect-btn') || 
            e.target.parentElement.classList.contains('connect-btn')) {
            const button = e.target.classList.contains('connect-btn') ? 
                e.target : e.target.parentElement;
            const patientId = button.dataset.patientId;
            connectWithPatient(patientId);
        }
    });
}

// Search patients by name
function searchPatients(query) {
    const patients = getPatients();
    const patientsContainer = document.getElementById('patients-container');
    const noPatients = document.getElementById('no-patients');
    
    // Clear previous content
    patientsContainer.innerHTML = '';
    
    if (!query) {
        // If search is empty, show all patients
        loadPatients();
        return;
    }
    
    // Filter patients by name (case-insensitive)
    const filteredPatients = patients.filter(patient => 
        patient.name.toLowerCase().includes(query.toLowerCase())
    );
    
    // Show/hide empty state
    if (filteredPatients.length === 0) {
        noPatients.style.display = 'flex';
    } else {
        noPatients.style.display = 'none';
        
        // Render each filtered patient card
        filteredPatients.forEach(patient => {
            patientsContainer.appendChild(createPatientCard(patient));
        });
    }
}

// Show patient details in modal
function showPatientDetails(patientId) {
    const patients = getPatients();
    const patient = patients.find(p => p.id === patientId);
    
    if (!patient) {
        console.error('Patient not found:', patientId);
        return;
    }
    
    // Fill modal with patient details
    document.getElementById('modal-patient-name').textContent = patient.name;
    document.getElementById('modal-patient-id').textContent = patient.id;
    document.getElementById('modal-patient-age').textContent = patient.age;
    document.getElementById('modal-patient-gender').textContent = patient.gender || 'Not specified';
    document.getElementById('modal-patient-phone').textContent = patient.phone || 'Not provided';
    document.getElementById('modal-patient-email').textContent = patient.email || 'Not provided';
    document.getElementById('modal-diagnosis-summary').textContent = patient.diagnosis || 'No diagnosis information available.';
    
    // Set patient ID on connect button
    document.getElementById('connect-patient-btn').dataset.patientId = patient.id;
    
    // Show modal
    const modal = document.getElementById('patient-modal');
    modal.classList.add('show');
    
    // Prevent body scrolling
    document.body.style.overflow = 'hidden';
}

// Hide patient modal
function hidePatientModal() {
    const modal = document.getElementById('patient-modal');
    modal.classList.remove('show');
    
    // Re-enable body scrolling
    document.body.style.overflow = '';
}

// Chat popup functionality
let isDragging = false;
let offsetX, offsetY;

// Connect with a patient
function connectWithPatient(patientId) {
    const patients = getPatients();
    const patient = patients.find(p => p.id === patientId);
    
    if (!patient) {
        console.error('Patient not found:', patientId);
        return;
    }
    
    // Hide modal if it's open
    hidePatientModal();
    
    // Open chat popup instead of redirecting
    openChatPopup(patient.name);
}

// Open chat popup
function openChatPopup(patientName) {
    const popup = document.getElementById('chat-popup');
    const chatPatientName = document.getElementById('chat-patient-name');
    
    // Set patient name
    chatPatientName.textContent = patientName;
    
    // Position the popup randomly within the main content area
    positionChatPopupRandomly();
    
    // Show popup with animation
    popup.classList.add('active');
    
    // Setup drag functionality
    setupChatDrag();
    
    // Set up event listeners for chat controls
    document.getElementById('minimize-chat').addEventListener('click', minimizeChat);
    document.getElementById('close-chat').addEventListener('click', closeChat);
    document.getElementById('send-message').addEventListener('click', sendChatMessage);
    
    // Add keyboard event listener for message input
    const chatInput = document.getElementById('chat-input');
    chatInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            sendChatMessage();
        }
    });
    
    // Focus on input
    chatInput.focus();
}

// Position chat popup in the lower right corner
function positionChatPopupRandomly() {
    const popup = document.getElementById('chat-popup');
    
    // Get viewport dimensions
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    
    // Calculate position for lower right corner with some padding
    const padding = 20;
    const posX = viewportWidth - popup.offsetWidth - padding;
    const posY = viewportHeight - popup.offsetHeight - padding;
    
    // Set position
    popup.style.right = padding + 'px';
    popup.style.bottom = padding + 'px';
    popup.style.left = 'auto';
    popup.style.top = 'auto';
}

// Setup drag functionality for chat popup
function setupChatDrag() {
    const popup = document.getElementById('chat-popup');
    const header = popup.querySelector('.chat-header');
    
    header.addEventListener('mousedown', startDrag);
    document.addEventListener('mousemove', drag);
    document.addEventListener('mouseup', endDrag);
    
    // Touch events for mobile devices
    header.addEventListener('touchstart', startDragTouch);
    document.addEventListener('touchmove', dragTouch);
    document.addEventListener('touchend', endDrag);
}

// Start dragging the chat popup
function startDrag(e) {
    const popup = document.getElementById('chat-popup');
    
    isDragging = true;
    offsetX = e.clientX - popup.getBoundingClientRect().left;
    offsetY = e.clientY - popup.getBoundingClientRect().top;
    
    popup.style.cursor = 'grabbing';
}

// Start dragging with touch
function startDragTouch(e) {
    const popup = document.getElementById('chat-popup');
    
    isDragging = true;
    offsetX = e.touches[0].clientX - popup.getBoundingClientRect().left;
    offsetY = e.touches[0].clientY - popup.getBoundingClientRect().top;
}

// Drag the chat popup
function drag(e) {
    if (!isDragging) return;
    
    const popup = document.getElementById('chat-popup');
    
    // Calculate new position
    let newX = e.clientX - offsetX;
    let newY = e.clientY - offsetY;
    
    // Set bounds
    const maxX = window.innerWidth - popup.offsetWidth;
    const maxY = window.innerHeight - popup.offsetHeight;
    
    newX = Math.max(0, Math.min(newX, maxX));
    newY = Math.max(0, Math.min(newY, maxY));
    
    // Apply new position
    popup.style.left = newX + 'px';
    popup.style.top = newY + 'px';
    
    // Prevent default events
    e.preventDefault();
}

// Drag with touch
function dragTouch(e) {
    if (!isDragging) return;
    
    const popup = document.getElementById('chat-popup');
    
    // Calculate new position
    let newX = e.touches[0].clientX - offsetX;
    let newY = e.touches[0].clientY - offsetY;
    
    // Set bounds
    const maxX = window.innerWidth - popup.offsetWidth;
    const maxY = window.innerHeight - popup.offsetHeight;
    
    newX = Math.max(0, Math.min(newX, maxX));
    newY = Math.max(0, Math.min(newY, maxY));
    
    // Apply new position
    popup.style.left = newX + 'px';
    popup.style.top = newY + 'px';
    
    // Prevent default events
    e.preventDefault();
}

// End dragging
function endDrag() {
    const popup = document.getElementById('chat-popup');
    
    isDragging = false;
    popup.style.cursor = '';
}

// Minimize chat popup
function minimizeChat() {
    const popup = document.getElementById('chat-popup');
    
    popup.classList.toggle('minimized');
    
    // Change icon based on state
    const icon = document.getElementById('minimize-chat').querySelector('i');
    if (popup.classList.contains('minimized')) {
        icon.classList.remove('fa-minus');
        icon.classList.add('fa-expand');
    } else {
        icon.classList.remove('fa-expand');
        icon.classList.add('fa-minus');
    }
}

// Close chat popup
function closeChat() {
    const popup = document.getElementById('chat-popup');
    
    // Hide popup with animation
    popup.classList.remove('active');
    
    // Reset minimized state
    popup.classList.remove('minimized');
    
    // Reset chat messages
    document.getElementById('chat-messages').innerHTML = `
        <div class="message system-message">
            <div class="message-content">
                Connected with patient. You can now start the conversation.
            </div>
            <div class="message-time">Just now</div>
        </div>
    `;
    
    // Clear input
    document.getElementById('chat-input').value = '';
}

// Send chat message
function sendChatMessage() {
    const chatInput = document.getElementById('chat-input');
    const message = chatInput.value.trim();
    
    if (!message) return;
    
    // Add message to chat
    addChatMessage(message, 'user');
    
    // Clear input
    chatInput.value = '';
    chatInput.focus();
    
    // Simulate patient response after a delay
    setTimeout(() => {
        const responses = [
            "Thank you, doctor. I'll follow your advice.",
            "When should I take the medication?",
            "Is there anything specific I should avoid?",
            "I've been feeling better since our last session.",
            "The symptoms have subsided a bit.",
            "Should I schedule another appointment?",
            "I appreciate your help, doctor."
        ];
        
        const randomResponse = responses[Math.floor(Math.random() * responses.length)];
        addChatMessage(randomResponse, 'patient');
    }, 1500);
}

// Add message to chat
function addChatMessage(message, sender) {
    const chatMessages = document.getElementById('chat-messages');
    const messageDiv = document.createElement('div');
    
    // Get current time
    const now = new Date();
    const timeString = now.getHours() + ':' + (now.getMinutes() < 10 ? '0' : '') + now.getMinutes();
    
    // Set class based on sender
    messageDiv.className = `message ${sender}-message`;
    
    // Set message content
    messageDiv.innerHTML = `
        <div class="message-content">${message}</div>
        <div class="message-time">${timeString}</div>
    `;
    
    // Add to chat
    chatMessages.appendChild(messageDiv);
    
    // Scroll to bottom
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

// Generate demo patients if none exist
function getDemoPatients() {
    return [
        {
            id: 'P1001',
            name: 'John Smith',
            age: 42,
            gender: 'Male',
            phone: '+1 (555) 123-4567',
            email: 'john.smith@example.com',
            diagnosis: 'Patient shows symptoms of hypertension. BP consistently above 140/90. Recommended lifestyle changes and scheduled a follow-up in 2 weeks.'
        },
        {
            id: 'P1002',
            name: 'Sarah Johnson',
            age: 35,
            gender: 'Female',
            phone: '+1 (555) 987-6543',
            email: 'sarah.j@example.com',
            diagnosis: 'Experiencing migraines 2-3 times per week. Photosensitivity and nausea present. Prescribed sumatriptan and requested MRI scan.'
        },
        {
            id: 'P1003',
            name: 'Robert Chen',
            age: 67,
            gender: 'Male',
            phone: '+1 (555) 456-7890',
            email: 'robert.chen@example.com',
            diagnosis: 'Type 2 diabetes. HbA1c at 7.8%. Adjusted metformin dosage and reinforced importance of diet control and regular exercise.'
        },
        {
            id: 'P1004',
            name: 'Emily Rodriguez',
            age: 29,
            gender: 'Female',
            phone: '+1 (555) 234-5678',
            email: 'emily.r@example.com',
            diagnosis: 'Anxiety disorder with occasional panic attacks. Prescribed low-dose SSRI and recommended cognitive behavioral therapy.'
        }
    ];
}
