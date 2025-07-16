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

// Connect with a patient
function connectWithPatient(patientId) {
    const patients = getPatients();
    const patient = patients.find(p => p.id === patientId);
    
    if (!patient) {
        console.error('Patient not found:', patientId);
        return;
    }
    
    // For now, redirect to chat page
    // In a real app, you might want to store the current patient ID in localStorage
    localStorage.setItem('currentPatientId', patientId);
    window.location.href = '/chat';
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
