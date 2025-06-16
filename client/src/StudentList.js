// src/StudentList.js
import './studentList.css';
import React, { useEffect, useState } from 'react';
import { getStudents, addStudent, updateStudent, deleteStudent } from './api/studentAPI';
import { useNavigate } from 'react-router-dom';
// import { Link } from 'react-router-dom';



function StudentList() {
    const [students, setStudents] = useState([]);
    //   
    const [formData, setFormData] = useState({
        name: '', email: '', phone: '', codeforcesHandle: ''
    });

    const [editingId, setEditingId] = useState(null);
    const [editData, setEditData] = useState({});

    const navigate = useNavigate();

    useEffect(() => {
        fetchStudents();
    }, []);

    const fetchStudents = async () => {
        try {
            const res = await getStudents();
            setStudents(res.data);
        } catch (err) {
            console.error("Error fetching students:", err);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleAddStudent = async () => {
        try {
            await addStudent({
                name: formData.name,
                email: formData.email,
                phone: formData.phone,
                codeforcesHandle: formData.codeforcesHandle
            });

            // Reset form
            setFormData({
                name: '',
                email: '',
                phone: '',
                codeforcesHandle: '',
                currentRating: '',
                maxRating: ''
            });

            fetchStudents(); // Refresh list
        } catch (err) {
            console.error("Error adding student:", err);
        }
    };


    const handleDeleteStudent = async (id) => {
        try {
            await deleteStudent(id);
            fetchStudents();
        } catch (err) {
            console.error("Error deleting student:", err);
        }
    };

    const startEditing = (student) => {
        setEditingId(student._id);
        setEditData({ ...student });
    };

    const handleEditChange = (e) => {
        const { name, value } = e.target;
        setEditData(prev => ({ ...prev, [name]: value }));
    };

    const saveEdit = async (id) => {
        try {
            await updateStudent(id, {
                ...editData,
                currentRating: Number(editData.currentRating),
                maxRating: Number(editData.maxRating)
            });
            setEditingId(null);
            fetchStudents();
        } catch (err) {
            console.error("Error updating student:", err);
        }
    };

    const cancelEdit = () => {
        setEditingId(null);
    };

    const downloadCSV = () => {
        const headers = ["Name", "Email", "Phone", "CF Handle", "Current Rating", "Max Rating", "Last Updated"];
        const rows = students.map(s => [
            s.name, s.email, s.phone || '', s.codeforcesHandle || '',
            s.currentRating || '', s.maxRating || '',
            s.lastUpdated ? new Date(s.lastUpdated).toLocaleString() : ''
        ]);
        const csvContent = [headers, ...rows].map(e => e.join(",")).join("\n");
        const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = "students.csv";
        link.click();
    };

    return (
        <div
            style={{
                padding: '10px',
                fontFamily: 'Arial, sans-serif',
                maxWidth: '1200px',
                margin: '0 auto',
            }}
        >
            <h1> CF Monitor </h1>

            {/* Add Student Form */}
            <div style={{ marginBottom: '20px' }}>
                <input name="name" placeholder="Name" value={formData.name} onChange={handleInputChange} />
                <input name="email" placeholder="Email" value={formData.email} onChange={handleInputChange} />
                <input name="phone" placeholder="Phone" value={formData.phone} onChange={handleInputChange} />
                <input name="codeforcesHandle" placeholder="CF Handle" value={formData.codeforcesHandle} onChange={handleInputChange} />
                {/* <input name="currentRating" placeholder="Current Rating" type="number" value={formData.currentRating} onChange={handleInputChange} /> */}
                {/* <input name="maxRating" placeholder="Max Rating" type="number" value={formData.maxRating} onChange={handleInputChange} /> */}
                <button onClick={handleAddStudent} style={{ marginLeft: '10px' }}> Add Student</button>
                <button onClick={downloadCSV} style={{ marginLeft: '10px' }}>Download CSV</button>
            </div>

            {/* Students Table */}
            <table style={{
                width: '100%',
                borderCollapse: 'collapse',
                marginTop: '20px',
                textAlign: 'left'
            }}>
                <thead style={{ backgroundColor: '#f2f2f2' }}>
                    <tr>
                        <th style={thStyle}>Name</th>
                        <th style={thStyle}>Email</th>
                        <th style={thStyle}>Phone</th>
                        <th style={thStyle}>CF Handle</th>
                        <th style={thStyle}>Current</th>
                        <th style={thStyle}>Max</th>
                        <th style={thStyle}>Last Updated</th>
                        <th style={thStyle}>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {students.map(s => (
                        <tr
                            key={s._id}
                            style={{
                                borderBottom: '1px solid #ddd',
                                cursor: editingId === s._id ? 'default' : 'pointer'
                            }}
                            onClick={(e) => {
                                if (e.target.closest('button') || editingId === s._id) return;
                                navigate(`/students/${s._id}`);
                            }}
                        >
                            {editingId === s._id ? (
                                <>
                                    <td><input name="name" value={editData.name} onChange={handleEditChange} /></td>
                                    <td><input name="email" value={editData.email} onChange={handleEditChange} /></td>
                                    <td><input name="phone" value={editData.phone || ''} onChange={handleEditChange} /></td>
                                    <td><input name="codeforcesHandle" value={editData.codeforcesHandle || ''} onChange={handleEditChange} /></td>
                                    <td><input name="currentRating" type="number" value={editData.currentRating || ''} onChange={handleEditChange} /></td>
                                    <td><input name="maxRating" type="number" value={editData.maxRating || ''} onChange={handleEditChange} /></td>
                                    <td>{s.lastUpdated ? new Date(s.lastUpdated).toLocaleString() : '-'}</td>
                                    <td>
                                        <button onClick={() => saveEdit(s._id)}>Save</button>
                                        <button onClick={cancelEdit} style={{ marginLeft: '5px' }}>Cancel</button>
                                    </td>
                                </>
                            ) : (
                                <>
                                    <td>{s.name}</td>
                                    <td>{s.email}</td>
                                    <td>{s.phone || '-'}</td>
                                    <td>
                                        {s.codeforcesHandle ? (
                                            <a
                                                href={`https://codeforces.com/profile/${s.codeforcesHandle}`}
                                                target="_blank"
                                                rel="noreferrer"
                                                style={{ color: 'blue', textDecoration: 'underline', cursor: 'pointer' }}
                                                onClick={(e) => e.stopPropagation()} // prevent row navigation
                                            >
                                                {s.codeforcesHandle}
                                            </a>
                                        ) : '-'}
                                    </td>
                                    <td>{s.currentRating || '-'}</td>
                                    <td>{s.maxRating || '-'}</td>
                                    <td>{s.lastUpdated ? new Date(s.lastUpdated).toLocaleString() : '-'}</td>
                                    <td>
                                        <button onClick={(e) => { e.stopPropagation(); startEditing(s); }}>Edit</button>
                                        <button onClick={(e) => { e.stopPropagation(); handleDeleteStudent(s._id); }} style={{ marginLeft: '5px' }}>Delete</button>
                                    </td>
                                </>
                            )}
                        </tr>
                    ))}
                </tbody>

            </table>
        </div>
    );
}

// Column header cell styling
const thStyle = {
    padding: '10px',
    borderBottom: '2px solid #ccc'
};

export default StudentList;


