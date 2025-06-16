import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api/students';

export const getStudents = () => axios.get(API_BASE_URL);
export const addStudent = (studentData) => axios.post(API_BASE_URL, studentData);
export const updateStudent = (id, studentData) => axios.put(`${API_BASE_URL}/${id}`, studentData);
export const deleteStudent = (id) => axios.delete(`${API_BASE_URL}/${id}`);
