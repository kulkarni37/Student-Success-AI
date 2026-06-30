from flask import Flask, render_template, request, redirect, url_for
from config import Config
from models import db, Task,Activity,User
from datetime import datetime,date,timedelta
from google import genai
import os
from flask_login import LoginManager, login_user, logout_user, login_required, current_user
from werkzeug.security import generate_password_hash, check_password_hash

app = Flask(__name__)

app.config.from_object(Config)
login_manager = LoginManager()

login_manager.init_app(app)

login_manager.login_view = "login"

@login_manager.user_loader
def load_user(user_id):
    return User.query.get(int(user_id))

client = genai.Client(
    api_key=app.config["GEMINI_API_KEY"]
)


# Load configuration
app.config.from_object(Config)

# Initialize database
db.init_app(app)

# Create database tables
with app.app_context():
    db.create_all()


# -------------------------
# Landing Page
# -------------------------
@app.route('/')
def home():
    return render_template('index.html')
from flask import jsonify

@app.route("/analyze-ai", methods=["POST"])
def analyze_ai():

    tasks = Task.query.filter_by(status="Pending").all()

    if not tasks:
        return jsonify({"response":"No pending tasks found."})

    prompt = """
You are an AI Academic Assistant.

Analyze the student's pending tasks and reply in exactly this format.

📚 Focus Task
<one sentence>

📅 Study Plan
• Task 1
• Task 2
• Task 3

💡 Productivity Tip
<one short tip>

Rules:
- Maximum 80 words.
- No markdown (** or ##).
- No long paragraphs.
- Be concise and professional.

Pending Tasks:
"""

    for task in tasks:
        prompt += f"""
Task : {task.title}
Category : {task.category}
Priority : {task.priority}
Deadline : {task.deadline}

"""

    response = client.models.generate_content(
    model="gemini-2.5-flash",
    contents=prompt
)

    return jsonify({
    "response": response.text
})  
# -------------------------
# Dashboard
# -------------------------

@app.route("/dashboard")
@login_required
def dashboard():

    tasks = Task.query.order_by(Task.deadline.asc()).all()

    total = Task.query.count()

    pending = Task.query.filter_by(status="Pending").count()
    study_hours = db.session.query(
    db.func.sum(Task.estimated_hours)).filter_by(status="Pending").scalar()


    if study_hours is None:
     study_hours = 0
    
    
       # Academic Risk Calculation
    if pending <= 2:
     risk = "Low"
     risk_score = 20
    elif pending <= 5:
     risk = "Medium"
     risk_score = 50
    else:
     risk = "High"
     risk_score = 90

    if risk == "Low":
     risk_class = "green"
    elif risk == "Medium":
     risk_class = "orange"
    else:
     risk_class = "red" 

    completed = Task.query.filter_by(status="Completed").count()
    today = date.today()
    



    start_week = today - timedelta(days=today.weekday())
    end_week = start_week + timedelta(days=6)

    week_range = f"{start_week.strftime('%d %b')} - {end_week.strftime('%d %b')}"

    upcoming_tasks = Task.query.filter(
    Task.deadline >= today,
    Task.status == "Pending").all()


    upcoming_count = len(upcoming_tasks)

    next_task = None
    days_left = None

    if upcoming_tasks:
     next_task = min(upcoming_tasks, key=lambda x: x.deadline)
     days_left = (next_task.deadline - today).days
    
    # Assignments completed in the last 7 days

    days = []
    completed_data = []

    for i in range(6, -1, -1):
     day = date.today() - timedelta(days=i)

    count = Task.query.filter(
        Task.status == "Completed",
        db.func.date(Task.created_at) == day ).count()


    days.append(day.strftime("%a"))
    completed_data.append(count) 
    activities = Activity.query.order_by(Activity.created_at.desc()).limit(5).all()
    planner = {
    "Mon": [],
    "Tue": [],
    "Wed": [],
    "Thu": [],
    "Fri": [],
    "Sat": [],
    "Sun": []
}

    for task in tasks:
     day = task.deadline.strftime("%a")
     planner[day].append(task)

    ai_message = "You're doing well. Keep up the good work!"
    risk_level = "Low"
    completion_probability = 95

    high_task = Task.query.filter_by(priority="High", status="Pending").order_by(Task.deadline.asc()).first()

    if high_task:
     ai_message = f"Based on your current workload, you should finish '{high_task.title}' before {high_task.deadline.strftime('%d %b')}."
     risk_level = "Medium"
     completion_probability = 86

    if pending >= 5:
     ai_message = "You have many pending tasks. Try completing the high priority ones first."
     risk_level = "High"
     completion_probability = 60

    if pending == 0:
     ai_message = "Excellent! You have completed all your tasks."
     risk_level = "Low"
     completion_probability = 100

    return render_template(
    "dashboard.html",
    tasks=tasks,
    total=total,
    pending=pending,
    completed=completed,
    risk=risk,
    risk_score=risk_score,
    risk_class=risk_class,
    study_hours=study_hours,
    upcoming_count=upcoming_count,
    next_task=next_task,
    days_left=days_left,
    days=days,
    completed_data=completed_data,
    activities=activities,
    planner=planner,
    week_range=week_range,
    ai_message=ai_message,
    risk_level=risk_level,
    completion_probability=completion_probability,

    
)
@app.route("/register", methods=["GET","POST"])
def register():

    if request.method == "POST":

        name = request.form["name"]

        email = request.form["email"]

        password = generate_password_hash(request.form["password"])

        user = User(
            name=name,
            email=email,
            password=password
        )

        db.session.add(user)

        db.session.commit()

        return redirect(url_for("login"))

    return render_template("register.html")
@app.route("/login", methods=["GET","POST"])
def login():

    if request.method == "POST":

        email = request.form["email"]

        password = request.form["password"]

        user = User.query.filter_by(email=email).first()

        if user and check_password_hash(user.password, password):

            login_user(user)

            return redirect(url_for("dashboard"))

    return render_template("login.html")
@app.route("/logout")
@login_required
def logout():

    logout_user()

    return redirect(url_for("login"))
# -------------------------
# Add Task
# -------------------------
@app.route('/add-task', methods=['POST'])
def add_task():

    task = Task(
        title=request.form['title'],
        category=request.form['category'],
        description=request.form['description'],
        deadline=datetime.strptime(
            request.form['deadline'],
            "%Y-%m-%d"
        ).date(),
        estimated_hours=int(request.form['estimated_hours']),
        priority=request.form['priority'],
        status="Pending"
    )

    db.session.add(task)
    activity = Activity(
    action=f"Added '{task.title}'",
    badge="Added"
)

    db.session.add(activity)
    db.session.commit()

    return redirect(url_for('dashboard'))
from flask import redirect, url_for

@app.route("/complete-task/<int:id>")
def complete_task(id):

    task = Task.query.get_or_404(id)

    task.status = "Completed"
    activity = Activity(
    action=f"Completed '{task.title}'",
    badge="Done"
)

    db.session.add(activity)

    db.session.commit()

    return redirect(url_for("dashboard"))
@app.route("/edit-task/<int:id>", methods=["GET", "POST"])
def edit_task(id):

    task = Task.query.get_or_404(id)

    if request.method == "POST":

        task.title = request.form["title"]
        task.category = request.form["category"]
        task.description = request.form["description"]
        task.deadline = datetime.strptime(
            request.form["deadline"], "%Y-%m-%d"
        ).date()
        task.estimated_hours = int(request.form["estimated_hours"])
        task.priority = request.form["priority"]

        db.session.commit()

        return redirect(url_for("my_tasks"))

    return render_template("edit_task.html", task=task)

@app.route("/delete-task/<int:id>")
def delete_task(id):

    task = Task.query.get_or_404(id)
    activity = Activity(
    action=f"Deleted '{task.title}'",
    badge="Deleted"
)

    db.session.add(activity)

    db.session.delete(task)

    db.session.commit()

    return redirect(url_for("dashboard"))

@app.route("/my-tasks")
def my_tasks():

    tasks = Task.query.order_by(Task.deadline.asc()).all()

    return render_template(
        "my_tasks.html",
        tasks=tasks
    )
@app.route("/planner")
def planner():

    today = date.today()

    tasks = Task.query.order_by(Task.deadline.asc()).all()

    # Today's tasks
    today_tasks = [task for task in tasks if task.deadline == today]

    # Weekly planner
    planner = {
        "Mon": [],
        "Tue": [],
        "Wed": [],
        "Thu": [],
        "Fri": [],
        "Sat": [],
        "Sun": []
    }

    for task in tasks:
        day = task.deadline.strftime("%a")
        planner[day].append(task)

    # Upcoming deadlines
    upcoming_deadlines = [
        task for task in tasks
        if task.deadline >= today and task.status != "Completed"
    ]

    upcoming_deadlines.sort(key=lambda x: x.deadline)

    # Counts
    completed_tasks_count = len(
        [task for task in tasks if task.status == "Completed"]
    )

    pending_tasks_count = len(
        [task for task in tasks if task.status != "Completed"]
    )

    total = len(tasks)

    completion_percentage = (
        round((completed_tasks_count / total) * 100)
        if total > 0 else 0
    )

    # AI Recommendation
    ai_message = "You're doing well. Keep up the good work!"
    risk_level = "Low"
    completion_probability = 95

    high_task = next(
        (task for task in tasks
         if task.priority == "High" and task.status == "Pending"),
        None
    )

    if high_task:
        ai_message = (
            f"Finish {high_task.title.title()} before "
            f"{high_task.deadline.strftime('%d %b')}."
        )
        risk_level = "Medium"
        completion_probability = 86

    if pending_tasks_count >= 5:
        ai_message = "You have many pending tasks. Complete the high priority ones first."
        risk_level = "High"
        completion_probability = 60

    if pending_tasks_count == 0:
        ai_message = "Excellent! All your tasks are completed."
        risk_level = "Low"
        completion_probability = 100

    return render_template(
        "planner.html",
        tasks=tasks,
        today_tasks=today_tasks,
        planner=planner,
        upcoming_deadlines=upcoming_deadlines,
        completed_tasks_count=completed_tasks_count,
        pending_tasks_count=pending_tasks_count,
        completion_percentage=completion_percentage,
        ai_message=ai_message,
        risk_level=risk_level,
        completion_probability=completion_probability
    )
@app.route("/ai-assistant")
def ai_assistant():
    return render_template("ai_assistant.html")
@app.route("/analytics")
def analytics():

    tasks = Task.query.all()

    total = len(tasks)

    completed = len([t for t in tasks if t.status == "Completed"])

    pending = total - completed

    completion_rate = round((completed / total) * 100) if total else 0

    high = len([t for t in tasks if t.priority == "High"])
    medium = len([t for t in tasks if t.priority == "Medium"])
    low = len([t for t in tasks if t.priority == "Low"])

    upcoming = sorted(
        [t for t in tasks if t.status != "Completed"],
        key=lambda x: x.deadline
    )[:5]

    return render_template(
        "analytics.html",
        total=total,
        completed=completed,
        pending=pending,
        completion_rate=completion_rate,
        high=high,
        medium=medium,
        low=low,
        upcoming=upcoming
    )
if __name__ == "__main__":
    app.run(debug=True)
