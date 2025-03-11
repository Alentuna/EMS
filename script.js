// Get the base API URL
const API_URL = window.location.origin;

// Store employees data and current employee being edited
let employees = [];
let currentEditId = null;

// Initialize the table
document.addEventListener('DOMContentLoaded', () => {
    fetchEmployees();
    setupSearch();
});

// Fetch employees from the database
async function fetchEmployees() {
    try {
        const response = await fetch(`${API_URL}/employees`);
        employees = await response.json();
        displayEmployees();
    } catch (error) {
        console.error('Error fetching employees:', error);
    }
}

// Sort table by column
async function sortTable(column) {
    try {
        const response = await fetch(`${API_URL}/employees/sort/${column}`);
        employees = await response.json();
        displayEmployees();
    } catch (error) {
        console.error('Error sorting employees:', error);
    }
}

// Display employees in the table
function displayEmployees(filteredEmployees = employees) {
    const tableBody = document.getElementById('employeeData');
    tableBody.innerHTML = '';

    filteredEmployees.forEach(employee => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${employee.id}</td>
            <td>${employee.name}</td>
            <td>${employee.position}</td>
            <td>${employee.department}</td>
            <td>$${employee.salary.toLocaleString()}</td>
            <td class="button-group">
                <button onclick="editEmployee(${employee.id})" class="edit-btn">Edit</button>
                <button onclick="deleteEmployee(${employee.id})" class="delete-btn">Delete</button>
            </td>
        `;
        tableBody.appendChild(row);
    });
}

// Search functionality
function setupSearch() {
    const searchInput = document.getElementById('searchInput');
    searchInput.addEventListener('input', (e) => {
        const searchTerm = e.target.value.toLowerCase();
        const filteredEmployees = employees.filter(employee => 
            employee.name.toLowerCase().includes(searchTerm) ||
            employee.position.toLowerCase().includes(searchTerm) ||
            employee.department.toLowerCase().includes(searchTerm)
        );
        displayEmployees(filteredEmployees);
    });
}

// Add new employee
function addNewEmployee() {
    currentEditId = null;
    const modal = document.getElementById('employeeModal');
    const modalTitle = document.getElementById('modalTitle');
    modalTitle.textContent = 'Add New Employee';
    modal.style.display = 'block';
    clearModalInputs();
}

// Edit employee
function editEmployee(id) {
    currentEditId = id;
    const employee = employees.find(emp => emp.id === id);
    if (employee) {
        const modal = document.getElementById('employeeModal');
        const modalTitle = document.getElementById('modalTitle');
        modalTitle.textContent = 'Edit Employee';
        
        document.getElementById('nameInput').value = employee.name;
        document.getElementById('positionInput').value = employee.position;
        document.getElementById('departmentInput').value = employee.department;
        document.getElementById('salaryInput').value = employee.salary;
        
        modal.style.display = 'block';
    }
}

// Close modal
function closeModal() {
    const modal = document.getElementById('employeeModal');
    modal.style.display = 'none';
    clearModalInputs();
    currentEditId = null;
}

// Clear modal inputs
function clearModalInputs() {
    document.getElementById('nameInput').value = '';
    document.getElementById('positionInput').value = '';
    document.getElementById('departmentInput').value = '';
    document.getElementById('salaryInput').value = '';
}

// Save employee (create or update)
async function saveEmployee() {
    const name = document.getElementById('nameInput').value;
    const position = document.getElementById('positionInput').value;
    const department = document.getElementById('departmentInput').value;
    const salary = parseInt(document.getElementById('salaryInput').value);

    if (!name || !position || !department || !salary) {
        alert('Please fill in all fields');
        return;
    }

    const employeeData = {
        name,
        position,
        department,
        salary
    };

    try {
        let response;
        if (currentEditId === null) {
            // Create new employee
            response = await fetch(`${API_URL}/employees`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(employeeData)
            });
        } else {
            // Update existing employee
            response = await fetch(`${API_URL}/employees/${currentEditId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(employeeData)
            });
        }

        const savedEmployee = await response.json();
        
        if (currentEditId === null) {
            employees.push(savedEmployee);
        } else {
            const index = employees.findIndex(emp => emp.id === currentEditId);
            if (index !== -1) {
                employees[index] = savedEmployee;
            }
        }
        
        displayEmployees();
        closeModal();
    } catch (error) {
        console.error('Error saving employee:', error);
        alert('Error saving employee. Please try again.');
    }
}

// Delete employee
async function deleteEmployee(id) {
    if (confirm('Are you sure you want to delete this employee?')) {
        try {
            await fetch(`${API_URL}/employees/${id}`, {
                method: 'DELETE'
            });
            employees = employees.filter(employee => employee.id !== id);
            displayEmployees();
        } catch (error) {
            console.error('Error deleting employee:', error);
            alert('Error deleting employee. Please try again.');
        }
    }
}
