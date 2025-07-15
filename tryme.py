import streamlit as st
import os
from RemoteCare.vision_try import DoctorAgent, ManualNEJMScenario, MeasurementAgent
from RemoteCare.pdfextract import PDFExtractor
# --- API Key ---
os.environ["GROQ_API_KEY"] = "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"

# --- Streamlit Setup ---
st.set_page_config(page_title="AgentClinic", layout="centered")
st.markdown("<h1 style='text-align: center;'>👨‍⚕️ Remotcare – Virtual Diagnosis</h1>", unsafe_allow_html=True)
st.markdown("<p style='text-align: center;'>AI-powered assistant for doctor-patient consultations</p>", unsafe_allow_html=True)
st.markdown("---")

# --- Session State Initialization ---
if "conversation" not in st.session_state:
    st.session_state.conversation = []
if "doctor_agent" not in st.session_state:
    st.session_state.doctor_agent = None
if "image_path" not in st.session_state:
    st.session_state.image_path = None
if "scenario" not in st.session_state:
    st.session_state.scenario = None
if "doctor_response_count" not in st.session_state:
    st.session_state.doctor_response_count = 0  
if "followup_input" not in st.session_state:
    st.session_state.followup_input = ""
if "clear_followup" not in st.session_state:
    st.session_state.clear_followup = False

# --- Clear previous input if requested ---
if st.session_state.clear_followup:
    st.session_state.followup_input = ""
    st.session_state.clear_followup = False

# --- Initial Patient Input ---
if st.session_state.doctor_agent is None:
    with st.form("patient_form"):
        st.header("📝 Patient Information")

        patient_name = st.text_input("👤 Patient Name", placeholder="e.g. Ananya Sharma")
        age = st.number_input("🎂 Age", min_value=1, max_value=120)
        gender = st.selectbox("⚧️ Gender", ["Male", "Female", "Other"])
        symptoms = st.text_area("🤒 Describe Your Symptoms", placeholder="e.g. yellow-brown patches on the shins")
        exams = st.text_area("📜 Previous Health Records", placeholder="e.g. no past records...")
        model_choice = st.selectbox("🧠 Choose Model", ["llama4-scout-groq", "llama3-groq", "gpt4", "gpt4o", "gpt3.5", "claude3.5sonnet"])

        submitted = st.form_submit_button("🚀 Start Consultation")

        if submitted:
# Build manual scenario
            image_path = None
            st.session_state.image_path = image_path 
            scenario_dict = {
                "image_url": "temp",
                "question": f"What's the most likely diagnosis for {patient_name}?",
                "patient_info": f"{patient_name} is a {age}-year-old {gender}. Symptoms: {symptoms}",
                "physical_exams": exams,
                "answers": [{"text": "Diagnosis not yet provided", "correct": True}],
                "test_results" : ""
            }
            
            st.session_state.backend_str = model_choice
            scenario = ManualNEJMScenario(scenario_dict)
            doctor_agent = DoctorAgent(scenario=scenario, backend_str=model_choice, max_infs=20, img_request=True)
            meas_agent = MeasurementAgent(
                scenario=scenario,
                backend_str=model_choice)
            
            st.session_state.scenario_dict = scenario_dict



            st.session_state.doctor_agent = doctor_agent
            st.session_state.meas_agent = meas_agent

            st.session_state.reply = ""
            st.session_state.m_reply = None

            st.session_state.scenario = scenario
            st.session_state.conversation.append({"role": "patient", "content": symptoms})
            st.rerun()


# --- Ongoing Conversation UI ---
else:
    st.subheader("💬 Doctor-Patient Consultation")

    for turn in st.session_state.conversation:
        if turn["role"] == "doctor":
            st.markdown(
                f"""
                <div style="background-color:#000000; padding:10px 15px; border-radius:12px; margin:5px 0; max-width:80%; text-align:left;">
                    <strong>👨‍⚕️ Doctor:</strong> {turn['content']}
                </div>
                """,
                unsafe_allow_html=True
            )
        elif turn["role"] == "patient":
            st.markdown(
                f"""
                <div style="background-color:#3e3e3e; padding:10px 15px; border-radius:12px; margin:5px 0; max-width:80%; text-align:left;">
                    <strong>🧑 Patient:</strong> {turn['content']}
                </div>
                """,
                unsafe_allow_html=True
            )
        elif turn["role"] == "measurement":
            st.markdown(
                f"""
                <div style="background-color:#222222; padding:10px 15px; border-radius:12px; margin:5px 0; max-width:80%; text-align:left;">
                    <strong>🧪 Test Result:</strong> {turn['content']}
                </div>
                """,
                unsafe_allow_html=True
            )

# 👇 Show uploader in middle of chat if requested
    if st.session_state.get("image_requested", False):
        st.markdown("📤 Doctor requested a diagnostic image. Please upload it below:")
        uploaded_img = st.file_uploader("Upload Diagnostic Image", type=["png", "jpg", "jpeg"])

        if uploaded_img:
            image_path = "uploaded_image.jpg"
            with open(image_path, "wb") as f:
                f.write(uploaded_img.read())

            # Store image path
            st.session_state.image_path = image_path
            st.session_state.scenario_dict["image_url"] = image_path

            # Reinitialize agents with updated image
            scenario = ManualNEJMScenario(st.session_state.scenario_dict)
            model_choice = st.session_state.backend_str
            st.session_state.scenario = scenario
            st.session_state.doctor_agent = DoctorAgent(scenario=scenario, backend_str=model_choice, max_infs=20, img_request=True)
            st.session_state.meas_agent = MeasurementAgent(scenario=scenario, backend_str=model_choice)
            
            # Continue conversation with image-aware inference
            followup_msg = "Image has been uploaded."
            doctor_reply_t = st.session_state.doctor_agent.inference_doctor(followup_msg, image_requested=True)
            # st.session_state.conversation.append({"role": "doctor", "content": doctor_reply_t})
            st.markdown('Image success')

            st.session_state.image_requested = False  # Reset flag
            st.rerun()

    if st.session_state.get("test_requested", False):
        st.markdown("📤 Doctor requested a test resulted. Please upload it below:")
        uploaded_pdf = st.file_uploader("Upload Diagnostic Image", type=["pdf"])

        if uploaded_pdf:
            pdf_path = "uploaded_pdf.pdf"
            with open(pdf_path, "wb") as f:
                f.write(uploaded_pdf.read())

            # Store image path
            st.session_state.pdf_path = pdf_path
            groq_key = "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"
            # Initialize the extractor
            extractor = PDFExtractor(groq_api_key=groq_key)

            summary = extractor.extract_and_summarize(pdf_path)

            summary = str(summary)
            st.session_state.scenario_dict["test_results"] += "\n" + summary
            scenario = ManualNEJMScenario(st.session_state.scenario_dict)
            model_choice = st.session_state.backend_str
            st.session_state.scenario = scenario
            st.session_state.meas_agent = MeasurementAgent(scenario=scenario, backend_str=model_choice)

            pi_dialogue = st.session_state.meas_agent.inference_measurement(st.session_state.reply)
            st.session_state.conversation.append({"role": "measurement", "content": pi_dialogue})
            if "WRONG TEST RESULT" in pi_dialogue:
                st.session_state.test_requested = True
            else:
                st.session_state.m_reply = pi_dialogue
                
                st.session_state.reply = ""
                st.session_state.test_requested = False
                st.rerun()


    st.markdown("---")
    follow_up = st.text_input("💬 Enter your follow-up message (as patient):", key="followup_input", placeholder="Type your message here...")
    if st.button("Continue Diagnosis"):
        if follow_up.strip():
            st.session_state.conversation.append({"role": "patient", "content": follow_up})
            if st.session_state.doctor_response_count == 1:
                follow_up = follow_up + "please request a test here .\n" 
            if st.session_state.m_reply is not None:
                follow_up += "Test result you asked previously" + st.session_state.m_reply
                st.session_state.m_reply = None
            if st.session_state.doctor_response_count == 9:
                follow_up = follow_up + "This is the final question. Please provide a diagnosis.\n" 
            doctor_reply = st.session_state.doctor_agent.inference_doctor(follow_up, image_requested= False)
            st.session_state.conversation.append({"role": "doctor", "content": doctor_reply})
            if st.session_state.scenario_dict and "image_url" in st.session_state.scenario_dict:
                st.write(st.session_state.scenario_dict["image_url"])

            if "REQUEST TEST" in doctor_reply:
                st.session_state.reply = doctor_reply
                st.session_state.test_requested = True
            if "REQUEST IMAGES" in doctor_reply:
                st.session_state.image_requested = True
 
            st.session_state.doctor_response_count += 1
            st.session_state.clear_followup = True
            st.rerun()

    if st.button("🔄 Restart"):
        for key in list(st.session_state.keys()):
            del st.session_state[key]
        st.rerun()


st.caption("🧠 Powered by AgentClinic + Groq + Streamlit")

