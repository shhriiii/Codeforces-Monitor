import React, { useEffect, useState } from "react";
import axios from "axios";

const StudentTable = () => {
  const [students, setStudents] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    codeforcesHandle: "",
    currentRating: "",
    maxRating: "",
  });

  const fetchStudents = async () => {
    const res = await axios.get("http://localhost:8080/api/students");
    setStudents(res.data);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAdd = async () => {
    await axios.post("http://localhost:8080/api/students", formData);
    setFormData({ name: "", email: "", phone: "", codeforcesHandle: "", currentRating: "", maxRating: "" });
    fetchStudents();
  };

  const handleDelete = async (id) => {
    await axios.delete(`http://localhost:8080/api/students/${id}`);
    fetchStudents();
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  return (
    <div style={{ padding: "2rem" }}>
      <h2>Student Table</h2>
      <input name="name" placeholder="Name" onChange={handleChange} value={formData.name} />
      <input name="email" placeholder="Email" onChange={handleChange} value={formData.email} />
      <input name="phone" placeholder="Phone" onChange={handleChange} value={formData.phone} />
      <input name="codeforcesHandle" placeholder="CF Handle" onChange={handleChange} value={formData.codeforcesHandle} />
      <input name="currentRating" placeholder="Current Rating" onChange={handleChange} value={formData.currentRating} />
      <input name="maxRating" placeholder="Max Rating" onChange={handleChange} value={formData.maxRating} />
      <button onClick={handleAdd}>Add Student</button>

      <table border="1" cellPadding="8" style={{ marginTop: "2rem", width: "100%" }}>
        <thead>
          <tr>
            <th>Name</th><th>Email</th><th>Phone</th><th>CF Handle</th><th>Current</th><th>Max</th><th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {students.map((stu) => (
            <tr key={stu._id}>
              <td>{stu.name}</td>
              <td>{stu.email}</td>
              <td>{stu.phone}</td>
              <td>{stu.codeforcesHandle}</td>
              <td>{stu.currentRating}</td>
              <td>{stu.maxRating}</td>
              <td>
                <button onClick={() => handleDelete(stu._id)}>Delete</button>
                {/* We'll add Edit/View buttons tomorrow */}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default StudentTable;
