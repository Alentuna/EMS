# SQL Database Manager

A modern web application for managing employee data using SQLite, Flask, and a responsive frontend.

## Features

- View, add, edit, and delete employee records
- Sort data by any column (name, position, department, salary)
- Real-time search functionality
- Responsive design with modern UI
- Persistent SQLite database storage

## Installation

1. Clone the repository
2. Install dependencies:
```bash
pip install -r requirements.txt
```

## Running Locally

1. Start the Flask server:
```bash
python app.py
```

2. Open your browser and navigate to:
```
http://localhost:5000
```

## Deployment

The application is ready for deployment on platforms like Heroku or PythonAnywhere:

1. The `Procfile` is configured for Gunicorn
2. Static files are handled by Whitenoise
3. SQLite database is included in the repository

## Project Structure

- `app.py` - Flask backend with SQLite database
- `index.html` - Main frontend interface
- `styles.css` - CSS styling
- `script.js` - Frontend JavaScript logic
- `employees.db` - SQLite database
- `requirements.txt` - Python dependencies
- `Procfile` - Deployment configuration
