# RemoteCare

![RemoteCare Logo](https://img.shields.io/badge/RemoteCare-Healthcare%20Platform-4f46e5)
![Python](https://img.shields.io/badge/Python-3.11+-blue)
![Flask](https://img.shields.io/badge/Flask-2.0+-green)
![AI Powered](https://img.shields.io/badge/AI-Powered-orange)

RemoteCare is an advanced healthcare platform that connects doctors and patients, providing AI-assisted diagnostic capabilities, real-time chat consultations, comprehensive patient management, and medical record tracking.

## 🌟 Features

### For Doctors
- **AI-Assisted Diagnosis**: Leverage AI to provide accurate and efficient diagnoses
- **Patient Dashboard**: Monitor and manage all patients in a single interface
- **Real-time Chat**: Communicate with patients through an intuitive chat interface
- **Medical Records**: Access and manage patient medical records
- **Diagnostic History**: Track patient diagnoses and treatment plans

### For Patients
- **Personal Health Portal**: Access your health information in one place
- **Diagnosis History**: View past diagnoses and medical reports
- **Chat with Doctors**: Communicate directly with healthcare providers
- **Medication Tracking**: Keep track of prescribed medications
- **Health Metrics**: Monitor important health metrics and trends

## 🚀 Technologies Used

- **Frontend**: HTML5, CSS3, JavaScript
- **Backend**: Python, Flask
- **AI Integration**: Groq API with LLaMA4 model
- **PDF Processing**: Custom PDF extraction for medical reports

## 📋 Project Structure

```
RemoteCare/
├── app.py                  # Main Flask application
├── pdfextract.py           # PDF extraction functionality
├── vision_try.py           # AI diagnosis models
├── requirements.txt        # Project dependencies
├── static/                 # Static assets
│   ├── js/                 # JavaScript files
│   │   ├── chat.js
│   │   ├── doctor_dashboard.js
│   │   ├── patient_portal.js
│   │   └── script.js
│   └── styles/             # CSS stylesheets
│       ├── chat.css
│       ├── doctor_dashboard.css
│       ├── patient_form.css
│       ├── patient_portal.css
│       └── styles.css
└── templates/              # HTML templates
    ├── chat.html
    ├── doctor_dashboard.html
    ├── index.html
    ├── patient_form.html
    └── patient_portal.html
```

## 💻 Installation and Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/SankalpBadoni/RemoteCare.git
   cd RemoteCare
   ```

2. **Create and activate a virtual environment** (recommended)
   ```bash
   python -m venv venv
   # On Windows
   venv\Scripts\activate
   # On macOS/Linux
   source venv/bin/activate
   ```

3. **Install dependencies**
   ```bash
   pip install -r requirements.txt
   ```

4. **Set up environment variables**
   Create a `.env` file in the project root with:
   ```
   GROQ_API_KEY=your_groq_api_key
   ```

5. **Run the application**
   ```bash
   python app.py
   ```

6. **Access the application**
   Open your browser and navigate to `http://localhost:5500`

## 🔧 Configuration

The application uses the following configuration:
- **Port**: 5500
- **Debug Mode**: Enabled in development
- **API Keys**: Stored in `.env` file

## 🌐 Main Pages

- **Home Page**: Landing page with information about the platform
- **Patient Form**: For patients to enter their information and symptoms
- **Doctor Dashboard**: For doctors to manage patients and communications
- **Patient Portal**: For patients to view their health records and chat history
- **Chat Interface**: For real-time communication between doctors and patients

## 🔍 Key Features Explained

### AI Diagnostic Assistant
The platform uses LLaMA4 via Groq API to analyze patient symptoms, medical history, and test results to assist doctors in making accurate diagnoses.

### Real-time Chat
The chat system allows doctors to communicate with patients, request additional information, and provide guidance directly through the platform.

### PDF Report Analysis
The system can extract and analyze information from uploaded medical PDFs to incorporate into the diagnostic process.

### Floating Chat Interface
A modern, draggable chat interface allows doctors to communicate with multiple patients while reviewing other information.

## 👥 User Roles

### Doctor
Doctors can review patient information, chat with patients, access medical records, and provide diagnoses with AI assistance.

### Patient
Patients can input symptoms, chat with doctors, view their diagnosis history, and track their health metrics over time.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.


---

© 2025 RemoteCare. All rights reserved.
