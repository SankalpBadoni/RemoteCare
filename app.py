from flask import Flask , render_template , request , session , jsonify , redirect , url_for
import os
from vision_try import DoctorAgent, ManualNEJMScenario, MeasurementAgent
import uuid
from dotenv import load_dotenv


app = Flask(__name__)
app.secret_key = 'your_secret_key' 


# Load .env file
load_dotenv()

# Access the key
groq_key = os.getenv("GROQ_API_KEY")

# If a library needs it as an env variable
os.environ["GROQ_API_KEY"] = groq_key
 # Required for session use

agents = {}

@app.route('/')
def index():
    # Initialize session variables if not present
    session.setdefault('conversation', [])
    session.setdefault('image_path', None)
    session.setdefault('scenario', None)
    session.setdefault('doctor_response_count', 0)
    session.setdefault('followup_input', "")
    session.setdefault('clear_followup', False)

    # Handle clear follow-up logic
    if session['clear_followup']:
        session['followup_input'] = ""
        session['clear_followup'] = False
        session.modified = True  # inform Flask session was changed

    # The main page is shown, with links to the patient form
    return render_template("index.html")

@app.route('/patient_form')
def patient_form():
    return render_template("patient_form.html")



@app.route('/set_details', methods=['POST'])
def set_details():
    patient_name = request.form['patient_name']
    age = int(request.form['age'])
    gender = request.form['gender']
    symptoms = request.form['symptoms']
    exams = request.form['exams']
    model_choice = "llama4-scout-groq"

    # Store in session
    session['patient_name'] = patient_name
    session['age'] = age
    session['gender'] = gender
    session['symptoms'] = symptoms
    session['exams'] = exams
    session['model_choice'] = model_choice

    image_path = None
    session['image_path'] = image_path

    session.modified = True  # ensure changes are saved

    scenario_dict = {
    "image_url": "temp",
    "question": f"What's the most likely diagnosis for {patient_name}?",
    "patient_info": f"{patient_name} is a {age}-year-old {gender}. Symptoms: {symptoms}",
    "physical_exams": exams,
    "answers": [{"text": "Diagnosis not yet provided", "correct": True}],
    "test_results" : "" }
     
    scenario = ManualNEJMScenario(scenario_dict)
    doctor_agent = DoctorAgent(scenario=scenario, backend_str=model_choice, max_infs=20, img_request=True)
    meas_agent = MeasurementAgent(
        scenario=scenario,
        backend_str=model_choice)
    
    session_id = session.get('session_id', str(uuid.uuid4()))
    session['session_id'] = session_id
    agents[session_id] = {
        "doctor": doctor_agent,
        "meas": meas_agent
    }


    session['scenario_dict'] = scenario_dict  # must be a JSON-serializable dict
    session['reply'] = ""
    session['m_reply'] = None

    # Initialize or append conversation
    if 'conversation' not in session:
        session['conversation'] = []
    session['conversation'].append({"role": "patient", "content": symptoms})

    return redirect(url_for('chat'))

@app.route("/chat")
def chat():
    return render_template("chat.html")

@app.route("/response")
def get_bot_response():
    follow_up = request.args.get('msg')
    session_id = session['session_id']
    
    # Optional safety check
    if session_id not in agents or "doctor" not in agents[session_id]:
        return jsonify("Doctor agent not found. Please restart the session.")

    response = agents[session_id]["doctor"].inference_doctor(follow_up, image_requested=False)
    return jsonify(response)




if __name__ == '__main__':
    app.run(debug=True,port= 5500, use_reloader=False)



