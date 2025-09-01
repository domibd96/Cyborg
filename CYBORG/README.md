# CYBORG Website

Futuristic IT Outsourcing Website with Python Backend

## 🚀 Quick Start

### Option 1: Simple Start (Recommended)
```bash
python start_server.py
```

### Option 2: Manual Start
```bash
# Install dependencies
pip install -r requirements.txt

# Start server
python server.py
```

## 📧 Email Setup

1. **Edit `server.py`** and update:
   - `SENDER_EMAIL`: Your Gmail address
   - `SENDER_PASSWORD`: Your Gmail app password

2. **Get Gmail App Password**:
   - Go to [Google Account Settings](https://myaccount.google.com/)
   - Enable 2-Factor Authentication
   - Go to "Security" → "App passwords"
   - Generate password for "Mail"
   - Use this password in `server.py`

## 🌐 Access Website
- **Local**: http://localhost:5000
- **Network**: http://your-ip:5000

## 📁 File Structure
```
CYBORG/
├── index.html          # Main website
├── style.css           # Styling
├── script.js           # Frontend JavaScript
├── server.py           # Python Flask backend
├── start_server.py     # Auto-setup script
├── requirements.txt    # Python dependencies
├── futuristicvideo.mp4 # Hero video
└── README.md          # This file
```

## ✨ Features
- ✅ Black Mirror-style Intro Animation
- ✅ Responsive Design (Mobile/Desktop)
- ✅ Contact Form with Email Backend
- ✅ CYBORG Pricing Plans (Light/Basic/Premium)
- ✅ Tron Legacy Scrollbar
- ✅ Mobile Navigation
- ✅ Auto-dependency Installation

## 📧 Email Format
Emails sent to `dominik.trausmuth@gmail.com` include:
- Company name
- Customer email
- Phone number
- Selected plan (Light/Basic/Premium)
- Customer message

## 🔧 Troubleshooting
- **Port 5000 busy**: Change port in `server.py`
- **Email not working**: Check Gmail app password
- **Dependencies missing**: Run `pip install -r requirements.txt` 