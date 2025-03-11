from flask import Flask, request, jsonify, send_from_directory
import sqlite3
from flask_cors import CORS
import os

app = Flask(__name__, static_folder='.')
CORS(app)

def init_db():
    conn = sqlite3.connect('employees.db')
    c = conn.cursor()
    c.execute('''
        CREATE TABLE IF NOT EXISTS employees (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            position TEXT NOT NULL,
            department TEXT NOT NULL,
            salary INTEGER NOT NULL
        )
    ''')
    
    # Insert dummy data if table is empty
    c.execute('SELECT COUNT(*) FROM employees')
    if c.fetchone()[0] == 0:
        dummy_data = [
            ('John Doe', 'Software Engineer', 'Engineering', 85000),
            ('Jane Smith', 'Product Manager', 'Product', 95000),
            ('Mike Johnson', 'UI Designer', 'Design', 75000),
            ('Sarah Williams', 'Data Analyst', 'Analytics', 70000),
            ('Tom Brown', 'DevOps Engineer', 'Engineering', 88000)
        ]
        c.executemany('INSERT INTO employees (name, position, department, salary) VALUES (?, ?, ?, ?)', dummy_data)
    
    conn.commit()
    conn.close()

@app.route('/')
def index():
    return send_from_directory('.', 'index.html')

@app.route('/<path:path>')
def serve_static(path):
    return send_from_directory('.', path)

@app.route('/employees', methods=['GET'])
def get_employees():
    conn = sqlite3.connect('employees.db')
    c = conn.cursor()
    c.execute('SELECT * FROM employees')
    employees = [{'id': row[0], 'name': row[1], 'position': row[2], 'department': row[3], 'salary': row[4]} 
                for row in c.fetchall()]
    conn.close()
    return jsonify(employees)

@app.route('/employees', methods=['POST'])
def add_employee():
    data = request.json
    conn = sqlite3.connect('employees.db')
    c = conn.cursor()
    c.execute('INSERT INTO employees (name, position, department, salary) VALUES (?, ?, ?, ?)',
              (data['name'], data['position'], data['department'], data['salary']))
    conn.commit()
    new_id = c.lastrowid
    conn.close()
    return jsonify({'id': new_id, **data})

@app.route('/employees/<int:id>', methods=['DELETE'])
def delete_employee(id):
    conn = sqlite3.connect('employees.db')
    c = conn.cursor()
    c.execute('DELETE FROM employees WHERE id = ?', (id,))
    conn.commit()
    conn.close()
    return jsonify({'message': 'Employee deleted'})

@app.route('/employees/<int:id>', methods=['PUT'])
def update_employee(id):
    data = request.json
    conn = sqlite3.connect('employees.db')
    c = conn.cursor()
    c.execute('''
        UPDATE employees 
        SET name = ?, position = ?, department = ?, salary = ?
        WHERE id = ?
    ''', (data['name'], data['position'], data['department'], data['salary'], id))
    conn.commit()
    conn.close()
    return jsonify({'id': id, **data})

@app.route('/employees/sort/<column>', methods=['GET'])
def get_sorted_employees(column):
    valid_columns = ['name', 'position', 'department', 'salary']
    if column not in valid_columns:
        return jsonify({'error': 'Invalid column'}), 400
        
    conn = sqlite3.connect('employees.db')
    c = conn.cursor()
    c.execute(f'SELECT * FROM employees ORDER BY {column}')
    employees = [{'id': row[0], 'name': row[1], 'position': row[2], 'department': row[3], 'salary': row[4]} 
                for row in c.fetchall()]
    conn.close()
    return jsonify(employees)

if __name__ == '__main__':
    init_db()
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port)
