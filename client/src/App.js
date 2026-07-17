import React from 'react';
import { Route, Routes } from 'react-router-dom';
import StudentList from './StudentList';
import StudentProfile from './StudentProfile';
import ThemeToggle from './components/ThemeToggle';

function App() {
  return (
    <>
      <ThemeToggle />
      <Routes>
        <Route path="/" element={<StudentList />} />
        <Route path="/profile/:handle" element={<StudentProfile />} />
      </Routes>
    </>
  );
}

export default App;
