// import React, { useEffect, useState } from 'react';
// import { getStudents, addStudent, updateStudent, deleteStudent } from './api/studentAPI';

// function App() {


//   const [students, setStudents] = useState([]);
//   const [formData, setFormData] = useState({
//     name: '', email: '', phone: '', codeforcesHandle: '',
//     currentRating: '', maxRating: ''
//   });
//   const [editingId, setEditingId] = useState(null);
//   const [editData, setEditData] = useState({});

//   useEffect(() => { fetchStudents(); }, []);

//   const fetchStudents = async () => {
//     try {
//       const res = await getStudents();
//       setStudents(res.data);
//     } catch (err) {
//       console.error("Error fetching students:", err);
//     }
//   };

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setFormData(prev => ({ ...prev, [name]: value }));
//   };

//   const handleAddStudent = async () => {
//     try {
//       await addStudent({
//         ...formData,
//         currentRating: Number(formData.currentRating),
//         maxRating: Number(formData.maxRating)
//       });
//       setFormData({ name: '', email: '', phone: '', codeforcesHandle: '', currentRating: '', maxRating: '' });
//       fetchStudents();
//     } catch (err) {
//       console.error("Error adding student:", err);
//     }
//   };

//   const handleDeleteStudent = async (id) => {
//     try {
//       await deleteStudent(id);
//       fetchStudents();
//     } catch (err) {
//       console.error("Error deleting student:", err);
//     }
//   };

//   const startEditing = (student) => {
//     setEditingId(student._id);
//     setEditData({ ...student });
//   };

//   const handleEditChange = (e) => {
//     const { name, value } = e.target;
//     setEditData(prev => ({ ...prev, [name]: value }));
//   };

//   const saveEdit = async (id) => {
//     try {
//       await updateStudent(id, {
//         ...editData,
//         currentRating: Number(editData.currentRating),
//         maxRating: Number(editData.maxRating)
//       });
//       setEditingId(null);
//       fetchStudents();
//     } catch (err) {
//       console.error("Error updating student:", err);
//     }
//   };

//   const downloadCSV = () => {
//     const headers = ["Name", "Email", "Phone", "CF Handle", "Current Rating", "Max Rating", "Last Updated"];
//     const rows = students.map(s => [
//       s.name, s.email, s.phone, s.codeforcesHandle,
//       s.currentRating, s.maxRating,
//       s.lastUpdated ? new Date(s.lastUpdated).toLocaleString() : ''
//     ]);
//     const csvContent = [headers, ...rows].map(e => e.join(",")).join("\n");
//     const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
//     const url = URL.createObjectURL(blob);
//     const link = document.createElement("a");
//     link.href = url;
//     link.download = "students.csv";
//     link.click();
//   };

//   return (
//     <div style={{ padding: '20px' }}>
//       <h1>Students</h1>

//       <div>
//         <input name="name" placeholder="Name" value={formData.name} onChange={handleInputChange} />
//         <input name="email" placeholder="Email" value={formData.email} onChange={handleInputChange} />
//         <input name="phone" placeholder="Phone" value={formData.phone} onChange={handleInputChange} />
//         <input name="codeforcesHandle" placeholder="CF Handle" value={formData.codeforcesHandle} onChange={handleInputChange} />
//         <input name="currentRating" placeholder="Current Rating" type="number" value={formData.currentRating} onChange={handleInputChange} />
//         <input name="maxRating" placeholder="Max Rating" type="number" value={formData.maxRating} onChange={handleInputChange} />
//         <button onClick={handleAddStudent}>Add Student</button>
//         <button onClick={downloadCSV}>⬇️ Download CSV</button>
//       </div>

//       <table border="1" cellPadding="10" style={{ marginTop: '20px', width: '100%' }}>
//         <thead>
//           <tr>
//             <th>Name</th><th>Email</th><th>Phone</th><th>CF Handle</th>
//             <th>Current Rating</th><th>Max Rating</th><th>Last Updated</th><th>Actions</th>
//           </tr>
//         </thead>
//         <tbody>
//           {students.map(s => (
//             <tr key={s._id}>
//               {editingId === s._id ? (
//                 <>
//                   <td><input name="name" value={editData.name} onChange={handleEditChange} /></td>
//                   <td><input name="email" value={editData.email} onChange={handleEditChange} /></td>
//                   <td><input name="phone" value={editData.phone} onChange={handleEditChange} /></td>
//                   <td><input name="codeforcesHandle" value={editData.codeforcesHandle} onChange={handleEditChange} /></td>
//                   <td><input name="currentRating" type="number" value={editData.currentRating} onChange={handleEditChange} /></td>
//                   <td><input name="maxRating" type="number" value={editData.maxRating} onChange={handleEditChange} /></td>
//                   <td>{s.lastUpdated ? new Date(s.lastUpdated).toLocaleString() : '-'}</td>
//                   <td>
//                     <button onClick={() => saveEdit(s._id)}>💾 Save</button>
//                     <button onClick={() => setEditingId(null)}>❌ Cancel</button>
//                   </td>
//                 </>
//               ) : (
//                 <>
//                   <td>{s.name}</td>
//                   <td>{s.email}</td>
//                   <td>{s.phone || '-'}</td>
//                   <td>{s.codeforcesHandle || '-'}</td>
//                   <td>{s.currentRating || '-'}</td>
//                   <td>{s.maxRating || '-'}</td>
//                   <td>{s.lastUpdated ? new Date(s.lastUpdated).toLocaleString() : '-'}</td>
//                   <td>
//                     <button onClick={() => startEditing(s)}>✏️ Edit</button>
//                     <button onClick={() => handleDeleteStudent(s._id)}>🗑 Delete</button>
//                   </td>
//                 </>
//               )}
//             </tr>
//           ))}
//         </tbody>
//       </table>
//     </div>
//   );
// }

// export default App;
// src/App.js
// src/App.js
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import StudentList from './StudentList';
import StudentProfile from './StudentProfile';
import ThemeToggle from './components/ThemeToggle'; // 👈 Import toggle

function App() {
  return (
    <div>
      <ThemeToggle /> {/* 👈 Add toggle component */}
      <Routes>
        <Route path="/" element={<StudentList />} />
        <Route path="/students/:id" element={<StudentProfile />} />
      </Routes>
    </div>
  );
}

export default App;






