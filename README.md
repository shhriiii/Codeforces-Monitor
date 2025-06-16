# 🎯 Codeforces Student Progress Tracker

A web-based application to monitor the competitive programming progress of students using Codeforces data. Built using the MERN stack (MongoDB, Express.js, React.js, Node.js).

## 🛠️ Tech Stack

- Frontend: React.js
- Backend: Node.js, Express.js
- Database: MongoDB Atlas
- Styling: Bootstrap, CSS

## 📡 API Endpoints

### 👨‍🎓 Students API

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/students` | Fetch all students |
| GET | `/api/students/:id` | Get single student |
| POST | `/api/students` | Add new student (fetches CF data) |
| PUT | `/api/students/:id` | Update student |
| DELETE | `/api/students/:id` | Delete student |

### 🤖 Codeforces API

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/codeforces/heatmap/:handle?days=365` | Submission heatmap |
| GET | `/api/codeforces/problems/:handle?days=30` | Problem stats |
| GET | `/api/codeforces/contests/:handle?days=90` | Contest stats |


## 💻 User Interface Overview

- **Student List View:** Displays all registered students with rating stats.
- **Student Profile Page:** Detailed stats (contest, problem, submission heatmap).
- **Add/Edit Modal:** For student records.
- **Download CSV File:** Complete student records. 

## 🚀 Local Setup

1. Clone the repository:
```bash
git clone https://github.com/shhriiii/Codeforces-Monitor.git
cd server
npm install
cd ../client
npm install
npm start
MONGO_URI=mongodb+srv://your-url

