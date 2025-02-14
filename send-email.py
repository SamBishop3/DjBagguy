import os
from flask import Flask, request, jsonify
from dotenv import load_dotenv
import requests
from flask_cors import CORS

# Load environment variables from the .env file
load_dotenv()

# Initialize Flask app
app = Flask(__name__)
CORS(app)  # Allow frontend requests

# Retrieve sensitive information from environment variables
MAILERSEND_API_KEY = os.getenv("MAILERSEND_API_KEY")  # MailerSend API Key
MAILERSEND_SENDER = os.getenv("MAILERSEND_SENDER")  # Sender email (e.g., info@djbagguy.com)
MAILERSEND_RECIPIENT = os.getenv("MAILERSEND_RECIPIENT")  # Recipient email (e.g., opulentsoundexp@gmail.com)

# Function to send email using MailerSend API
def send_email(subject, body, to):
    url = "https://api.mailersend.com/v1/email"

    headers = {
        "Authorization": f"Bearer {MAILERSEND_API_KEY}",
        "Content-Type": "application/json"
    }

    data = {
        "from": {"email": MAILERSEND_SENDER, "name": "DJ Bagguy Notifications"},
        "to": [{"email": to}],
        "subject": subject,
        "html": body  # HTML formatted body for email
    }

    try:
        # Send POST request to MailerSend API
        response = requests.post(url, json=data, headers=headers)

        # Print status and response for debugging
        print(f"MailerSend response status code: {response.status_code}")  # Log status code
        print(f"MailerSend response text: {response.text}")  # Log the full response

        # Check if the email was sent successfully
        if response.status_code == 200:
            return "Email sent successfully"
        else:
            return f"Failed to send email: {response.status_code}, {response.text}"
    except Exception as e:
        # Handle any exceptions during the request
        return f"An error occurred: {e}"
    
@app.route("/health", methods=["GET"])
def health():
    try:
        return jsonify({"status": "ok"})
    except Exception as e:
        return f"An error occurred: {e}"

# Define the route to handle booking form submissions
@app.route('/submit_booking', methods=["POST"])
def submit_booking():
    try:
        # Get form data from request
        first_name = request.form['firstname']
        last_name = request.form['lastname']
        country = request.form['country']
        subject = request.form['subject']

        # Prepare the email content
        email_subject = f"Booking Request from {first_name} {last_name}"
        email_body = f"""
        <p>You have received a new booking request!</p>
        <p>First Name: {first_name}</p>
        <p>Last Name: {last_name}</p>
        <p>Country: {country}</p>
        <p>Event Details: {subject}</p>
        """

        # Send email to the specified email
        result = send_email(email_subject, email_body, MAILERSEND_RECIPIENT)

        # If sending email was successful, return a success message
        if result == "Email sent successfully":
            return jsonify({"message": "Booking request sent successfully!"})
        else:
            return jsonify({"message": result})  # Return the error message from send_email()

    except Exception as e:
        # Catch any errors and print them in Flask logs
        print(f"Error occurred: {e}")
        return jsonify({"message": "An error occurred. Please try again later."})

# Run the app
if __name__ == "__main__":
    app.run(debug=True, port=5001)
