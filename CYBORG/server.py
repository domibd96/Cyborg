from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
import os
import re
import html

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Security headers middleware
@app.after_request
def add_security_headers(response):
    """Add security headers to prevent XSS and other attacks"""
    response.headers['X-Content-Type-Options'] = 'nosniff'
    response.headers['X-Frame-Options'] = 'DENY'
    response.headers['X-XSS-Protection'] = '1; mode=block'
    response.headers['Content-Security-Policy'] = "default-src 'self'; script-src 'self' 'unsafe-inline' https://fonts.googleapis.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data:; media-src 'self';"
    response.headers['Referrer-Policy'] = 'strict-origin-when-cross-origin'
    response.headers['Strict-Transport-Security'] = 'max-age=31536000; includeSubDomains'
    return response

# Email configuration
SMTP_SERVER = "smtp.gmail.com"
SMTP_PORT = 587
SENDER_EMAIL = "dominik.trausmuth@gmail.com"  # Deine Gmail
SENDER_PASSWORD = "nmtg zikx bxkw para"   # Dein App-Passwort
RECIPIENT_EMAIL = "trausmuthd@gmail.com"

# Security: Input validation and sanitization
def sanitize_input(input_str):
    """Sanitize input to prevent XSS and injection attacks"""
    if not input_str:
        return ""
    
    # Convert to string if needed
    input_str = str(input_str)
    
    # Remove potentially dangerous characters
    sanitized = html.escape(input_str)
    
    # Remove script tags and event handlers
    sanitized = re.sub(r'<script[^>]*>.*?</script>', '', sanitized, flags=re.IGNORECASE | re.DOTALL)
    sanitized = re.sub(r'on\w+\s*=', '', sanitized, flags=re.IGNORECASE)
    sanitized = re.sub(r'javascript:', '', sanitized, flags=re.IGNORECASE)
    
    # Limit length
    return sanitized[:1000]

def validate_email(email):
    """Validate email format"""
    if not email:
        return False
    
    email_pattern = re.compile(r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$')
    return bool(email_pattern.match(email))

def validate_phone(phone):
    """Validate phone number format (optional field)"""
    if not phone:
        return True  # Phone is optional
    
    phone_pattern = re.compile(r'^[\+]?[0-9\s\-\(\)]{6,20}$')
    return bool(phone_pattern.match(phone))

def validate_plan(plan):
    """Validate plan selection"""
    valid_plans = ['light', 'basic', 'premium']
    return plan in valid_plans

@app.route('/')
def serve_index():
    return send_from_directory('.', 'index.html')

@app.route('/<path:filename>')
def serve_static(filename):
    return send_from_directory('.', filename)

@app.route('/contact', methods=['POST'])
def handle_contact():
    try:
        data = request.get_json()
        
        if not data:
            return jsonify({'success': False, 'message': 'Invalid request data'}), 400
        
        # Extract and sanitize form data
        company = sanitize_input(data.get('company', ''))
        email = data.get('email', '').strip().lower()
        phone = sanitize_input(data.get('phone', ''))
        plan = sanitize_input(data.get('plan', ''))
        message = sanitize_input(data.get('message', ''))
        
        # Server-side validation
        if not company or len(company) < 2:
            return jsonify({'success': False, 'message': 'Company name must be at least 2 characters long'}), 400
        
        if not validate_email(email):
            return jsonify({'success': False, 'message': 'Invalid email format'}), 400
        
        if not validate_phone(phone):
            return jsonify({'success': False, 'message': 'Invalid phone number format'}), 400
        
        if not validate_plan(plan):
            return jsonify({'success': False, 'message': 'Invalid plan selection'}), 400
        
        # Create email content with sanitized data
        subject = f"New CYBORG Inquiry - {company}"
        
        email_body = f"""
New inquiry from CYBORG Website

Company: {company}
Email: {email}
Phone: {phone}
Selected Plan: {plan}

Message:
{message}

---
Sent from CYBORG Website
        """
        
        # Create message
        msg = MIMEMultipart()
        msg['From'] = SENDER_EMAIL
        msg['To'] = RECIPIENT_EMAIL
        msg['Subject'] = subject
        
        # Validate Reply-To header to prevent email header injection
        if validate_email(email):
            msg['Reply-To'] = email
        else:
            msg['Reply-To'] = SENDER_EMAIL  # Fallback to sender email
        
        msg.attach(MIMEText(email_body, 'plain'))
        
        # Send email
        server = smtplib.SMTP(SMTP_SERVER, SMTP_PORT)
        server.starttls()
        server.login(SENDER_EMAIL, SENDER_PASSWORD)
        text = msg.as_string()
        server.sendmail(SENDER_EMAIL, RECIPIENT_EMAIL, text)
        server.quit()
        
        return jsonify({'success': True, 'message': 'Email sent successfully'})
        
    except Exception as e:
        print(f"Error: {e}")
        return jsonify({'success': False, 'message': 'Failed to send email'}), 500

if __name__ == '__main__':
    print("🚀 CYBORG Server starting...")
    print("📧 Email will be sent to:", RECIPIENT_EMAIL)
    print("🌐 Website available at: http://localhost:5000")
    print("⚠️  Remember to configure SENDER_EMAIL and SENDER_PASSWORD in server.py")
    app.run(debug=True, host='0.0.0.0', port=5000) 