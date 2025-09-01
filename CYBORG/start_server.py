#!/usr/bin/env python3
"""
CYBORG Website Server Startup Script
"""

import subprocess
import sys
import os

def check_dependencies():
    """Check if required packages are installed"""
    try:
        import flask
        import flask_cors
        print("✅ All dependencies are installed")
        return True
    except ImportError as e:
        print(f"❌ Missing dependency: {e}")
        print("Installing dependencies...")
        subprocess.check_call([sys.executable, "-m", "pip", "install", "-r", "requirements.txt"])
        return True

def check_config():
    """Check if email configuration is set"""
    try:
        with open('server.py', 'r', encoding='utf-8') as f:
            content = f.read()
        
        if 'your-email@gmail.com' in content or 'your-app-password' in content:
            print("⚠️  WARNING: Email configuration not set!")
            print("Please edit server.py and update:")
            print("  - SENDER_EMAIL: Your Gmail address")
            print("  - SENDER_PASSWORD: Your Gmail app password")
            print("\nTo get Gmail app password:")
            print("1. Go to Google Account Settings")
            print("2. Enable 2-Factor Authentication")
            print("3. Generate App Password for 'Mail'")
            return False
        else:
            print("✅ Email configuration looks good")
            return True
    except Exception as e:
        print(f"⚠️  Could not check configuration: {e}")
        print("Continuing anyway...")
        return True

def main():
    print("🚀 CYBORG Website Server Setup")
    print("=" * 40)
    
    # Check dependencies
    if not check_dependencies():
        return
    
    # Check configuration
    config_ok = check_config()
    
    print("\n" + "=" * 40)
    print("🌐 Starting CYBORG Server...")
    print("📱 Website will be available at: http://localhost:5000")
    print("📧 Contact form will send emails to: dominik.trausmuth@gmail.com")
    
    if not config_ok:
        print("\n⚠️  Server will start but emails won't work until you configure Gmail!")
    
    print("\nPress Ctrl+C to stop the server")
    print("=" * 40)
    
    # Start the server
    subprocess.run([sys.executable, "server.py"])

if __name__ == "__main__":
    main() 