import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";

function App() {

    // ==========================================
    // Backend API URL
    // ==========================================

    const API = "http://13.250.60.28:5000";

    // ==========================================
    // React States
    // ==========================================

    const [employees, setEmployees] = useState([]);
    const [selectedEmployee, setSelectedEmployee] = useState(null);

    const [name, setName] = useState("");
    const [department, setDepartment] = useState("");
    const [email, setEmail] = useState("");
    const [image, setImage] = useState(null);

    // ==========================================
    // Dashboard Count
    // ==========================================

    const departmentCount =
        [...new Set(employees.map(emp => emp.department))].length;

    // ==========================================
    // Clear Form
    // ==========================================

    const clearForm = () => {
        setName("");
        setDepartment("");
        setEmail("");
        setImage(null);
        setSelectedEmployee(null);
    };

    // ==========================================
    // Load Employees
    // ==========================================

    const loadEmployees = async () => {

        try {

            const response = await fetch(`${API}/employees`);

            const data = await response.json();

            if (response.ok) {

                setEmployees(data);

            } else {

                alert(data.message || "Unable to load employees.");

            }

        } catch (error) {

            console.error("Load Employee Error:", error);

            alert("Server Error");

        }

    };

    // ==========================================
    // Load Employees on Page Load
    // ==========================================

    useEffect(() => {

        loadEmployees();

    }, []);

    // ==========================================
    // Add Employee
    // ==========================================

    const addEmployee = async () => {

        if (!name || !department || !email || !image) {

            alert("Please fill all fields.");

            return;

        }

        const formData = new FormData();

        formData.append("name", name);
        formData.append("department", department);
        formData.append("email", email);
        formData.append("image", image);

        try {

            const response = await fetch(`${API}/employees`, {

                method: "POST",

                body: formData,

            });

            const data = await response.json();

            if (response.ok) {

                alert(data.message);

                loadEmployees();

                clearForm();

            } else {

                alert(data.error || data.message);

            }

        } catch (error) {

            console.error("Add Employee Error:", error);

            alert("Server Error");

        }

    };

    // ==========================================
    // Update Employee
    // ==========================================

    const updateEmployee = async () => {

        if (!selectedEmployee) {

            alert("Please click the Edit button before updating.");

            return;

        }

        if (!name || !department || !email) {

            alert("Please fill all required fields.");

            return;

        }

        const formData = new FormData();

        formData.append("name", name);
        formData.append("department", department);
        formData.append("email", email);

        // Upload a new image only if selected
        if (image) {

            formData.append("image", image);

        }

        try {

            const response = await fetch(
                `${API}/employees/${selectedEmployee.id}`,
                {
                    method: "PUT",
                    body: formData,
                }
            );

            const data = await response.json();

            if (response.ok) {

                alert(data.message);

                await loadEmployees();

                clearForm();

            } else {

                alert(data.error || data.message);

            }

        } catch (error) {

            console.error("Update Employee Error:", error);

            alert("Server Error");

        }

    };


    // ==========================================
    // Delete Employee
    // ==========================================

    const deleteEmployee = async (employee) => {

        const confirmDelete = window.confirm(
            `Are you sure you want to delete "${employee.name}"?`
        );

        if (!confirmDelete) {

            return;

        }

        try {

            const response = await fetch(
                `${API}/employees/${employee.id}`,
                {
                    method: "DELETE",
                }
            );

            const data = await response.json();

            if (response.ok) {

                alert(data.message);

                await loadEmployees();

                // Clear form if deleted employee was selected
                if (
                    selectedEmployee &&
                    selectedEmployee.id === employee.id
                ) {

                    clearForm();

                }

            } else {

                alert(data.error || data.message);

            }

        } catch (error) {

            console.error("Delete Employee Error:", error);

            alert("Server Error");

        }

    };


    // ==========================================
    // Edit Employee
    // ==========================================

    const editEmployee = (employee) => {

        setSelectedEmployee(employee);

        setName(employee.name);
        setDepartment(employee.department);
        setEmail(employee.email);

        // Keep old image unless user selects a new one
        setImage(null);

        // Scroll to form for better user experience
        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });

    };

    // ==========================================
    // UI
    // ==========================================

    return (

        <div className="container mt-4">

            {/* =======================================
                Project Title
            ======================================== */}

            <h1 className="text-center text-primary fw-bold mb-4">
                Employee Management System
            </h1>

            {/* =======================================
                Dashboard
            ======================================== */}

            <div className="row mb-4">

                <div className="col-md-6 mb-3">

                    <div className="card shadow bg-primary text-white">

                        <div className="card-body text-center">

                            <h5>Total Employees</h5>

                            <h2>{employees.length}</h2>

                        </div>

                    </div>

                </div>

                <div className="col-md-6 mb-3">

                    <div className="card shadow bg-success text-white">

                        <div className="card-body text-center">

                            <h5>Total Departments</h5>

                            <h2>{departmentCount}</h2>

                        </div>

                    </div>

                </div>

            </div>

            {/* =======================================
                Employee Form
            ======================================== */}

            <div className="card shadow">

                <div className="card-body">

                    <h3 className="mb-4">

                        {selectedEmployee
                            ? "Update Employee"
                            : "Add New Employee"}

                    </h3>

                    {/* Employee Name */}

                    <div className="mb-3">

                        <label className="form-label">

                            Employee Name

                        </label>

                        <input
                            type="text"
                            className="form-control"
                            placeholder="Enter Employee Name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />

                    </div>

                    {/* Department */}

                    <div className="mb-3">

                        <label className="form-label">

                            Department

                        </label>

                        <input
                            type="text"
                            className="form-control"
                            placeholder="Enter Department"
                            value={department}
                            onChange={(e) => setDepartment(e.target.value)}
                        />

                    </div>

                    {/* Email */}

                    <div className="mb-3">

                        <label className="form-label">

                            Email Address

                        </label>

                        <input
                            type="email"
                            className="form-control"
                            placeholder="Enter Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />

                    </div>

                    {/* Image */}

                    <div className="mb-4">

                        <label className="form-label">

                            Employee Photo

                        </label>

                        <input
                            type="file"
                            className="form-control"
                            accept="image/*"
                            onChange={(e) => setImage(e.target.files[0])}
                        />

                    </div>

                    {/* Buttons */}

                    <div className="d-flex gap-2 flex-wrap">

                        <button
                            className="btn btn-success"
                            onClick={addEmployee}
                        >
                            ➕ Add Employee
                        </button>

                        <button
                            className="btn btn-warning"
                            onClick={updateEmployee}
                        >
                            ✏️ Update Employee
                        </button>

                        <button
                            className="btn btn-secondary"
                            onClick={clearForm}
                        >
                            🔄 Clear
                        </button>

                    </div>

                </div>

            </div>

            <br />

            {/* =======================================
                Employee Table
            ======================================== */}

            <div className="card shadow">

                <div className="card-body">

                    <h3 className="mb-3">

                        Employee Records

                    </h3>

                    <table className="table table-bordered table-hover align-middle">

                        <thead className="table-dark">

                            <tr>

                                <th>ID</th>

                                <th>Photo</th>

                                <th>Name</th>

                                <th>Department</th>

                                <th>Email</th>

                                <th>Actions</th>

                            </tr>

                        </thead>

                        <tbody>
	                                {employees.length > 0 ? (

                                employees.map((emp) => (

                                    <tr key={emp.id}>

                                        {/* Employee ID */}

                                        <td>{emp.id}</td>

                                        {/* Employee Photo */}

                                        <td>
					
                                     		<img
    src={emp.image_url}
    alt={emp.name}
    width="60"
    height="60"
    style={{
        objectFit: "cover",
        borderRadius: "50%",
        border: "2px solid #0d6efd"
    }}
/>
                                        </td>

                                        {/* Employee Name */}

                                        <td>{emp.name}</td>

                                        {/* Department */}

                                        <td>{emp.department}</td>

                                        {/* Email */}

                                        <td>{emp.email}</td>

                                        {/* Action Buttons */}

                                        <td>

                                            <button
                                                className="btn btn-warning btn-sm me-2"
                                                onClick={() => editEmployee(emp)}
                                            >
                                                ✏️ Edit
                                            </button>

                                            <button
                                                className="btn btn-danger btn-sm"
                                                onClick={() => deleteEmployee(emp)}
                                            >
                                                🗑 Delete
                                            </button>

                                        </td>

                                    </tr>

                                ))

                            ) : (

                                <tr>

                                    <td
                                        colSpan="6"
                                        className="text-center text-danger fw-bold"
                                    >
                                        No Employees Found
                                    </td>

                                </tr>

                            )}

                        </tbody>

                    </table>

                </div>

            </div>

        </div>

    );

}

export default App;
