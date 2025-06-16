import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Line, Bar } from 'react-chartjs-2';
import 'chart.js/auto';
import CFHeatmap from './components/CFHeatmap';


function StudentProfile() {
    const { id } = useParams();
    const [student, setStudent] = useState(null);
    const [contestData, setContestData] = useState([]);
    const [problemData, setProblemData] = useState(null);
    // const [heatmapData, setHeatmapData] = useState(null);
    const [contestFilter, setContestFilter] = useState(30);
    const [problemFilter, setProblemFilter] = useState(30);

    useEffect(() => {
        const fetchStudentAndCFData = async () => {
            try {
                const studentRes = await axios.get(`/api/students/${id}`);
                setStudent(studentRes.data);

                const handle = studentRes.data.codeforcesHandle;
                if (handle) {
                    const [contestRes, problemRes, heatmapRes] = await Promise.all([
                        axios.get(`/api/codeforces/contests/${handle}?days=${contestFilter}`),
                        axios.get(`/api/codeforces/problems/${handle}?days=${problemFilter}`),
                        axios.get(`/api/codeforces/heatmap/${handle}?days=365`)
                    ]);
                    console.log("🚀 Contest Data from API:", contestRes.data); 
                    setContestData(contestRes.data);
                    
                    setProblemData(problemRes.data);



                }
            } catch (err) {
                console.error("Error loading student or CF data:", err);
            }
        };

        fetchStudentAndCFData();
    }, [id, contestFilter, problemFilter]);


    if (!student) return <p>Loading...</p>;

    return (
        
        <div style={{}}>
            <h1>Student Profile View</h1>
            <h2>{student.name}</h2>
            <p>Email: {student.email}</p>
            <p>
                Codeforces:{" "}
                <a href={`https://codeforces.com/profile/${student.codeforcesHandle}`} target="_blank" rel="noreferrer">
                    {student.codeforcesHandle}
                </a>
            </p>

            {/* ---- Charts and Data Section ---- */}
            <div
                style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    flexWrap: 'wrap',
                    gap: '40px',
                    marginLeft: '0px',
                }}
            >
                {/* Contest Section */}
                <div
                    style={{
                        flex: '1',
                        minWidth: '300px',
                        maxWidth: '600px',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '20px',
                    }}
                >
                    <div>
                        <h4>Contest Filter</h4>
                        <select
                            value={contestFilter}
                            onChange={(e) => setContestFilter(Number(e.target.value))}
                        >
                            <option value={30}>Last 30 Days</option>
                            <option value={90}>Last 90 Days</option>
                            <option value={365}>Last 365 Days</option>
                        </select>
                    </div>

                    {contestData.length > 0 && (
                        <>
                            <div>
                                <h4>Rating Progress</h4>
                                {/* <Line
                                    data={{
                                        labels: contestData.map((d) => d.contestName),
                                        datasets: [
                                            {
                                                label: 'Rating',
                                                data: contestData.map((d) => d.newRating),
                                                borderColor: 'blue',
                                            },
                                        ],
                                    }}
                                    height={200}
                                /> */}
                                <Line
                                    data={{
                                        labels: contestData.map((d) => d.contestName),
                                        datasets: [
                                            {
                                                label: 'Rating',
                                                data: contestData.map((d) => d.newRating),
                                                borderColor: 'blue',
                                            },
                                        ],
                                    }}
                                    options={{
                                        scales: {
                                            x: {
                                                ticks: {
                                                    display: false, // hide round names
                                                },
                                            },
                                        },
                                        plugins: {
                                            legend: {
                                                display: false,
                                            },
                                            tooltip: {
                                                enabled: true,
                                            },
                                        },
                                    }}
                                    height={200}
                                />

                            </div>

                            <div>
                                <h4>Contest History</h4>
                                <table>
                                    <thead>
                                        <tr>
                                            <th>Contest</th>
                                            <th>Rank</th>
                                            <th>Old Rating</th>
                                            <th>New Rating</th>
                                            <th>Solved</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {contestData
                                            .slice()
                                            .reverse()
                                            .map((c, i) => (
                                                <tr key={i}>
                                                    <td>{c.contestName}</td>
                                                    <td>{c.rank}</td>
                                                    <td>{c.oldRating}</td>
                                                    <td>{c.newRating}</td>
                                                    <td>{c.solvedCount}</td> 
                                                </tr>
                                            ))}
                                    </tbody>
                                </table>
                            </div>
                        </>
                    )}
                </div>

                {/* Problem Section */}
                <div
                    style={{
                        flex: '1',
                        minWidth: '300px',
                        maxWidth: '600px',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '20px',
                    }}
                >
                    <div>
                        <h4>Problem Filter</h4>
                        <select
                            value={problemFilter}
                            onChange={(e) => setProblemFilter(Number(e.target.value))}
                        >
                            <option value={7}>Last 7 Days</option>
                            <option value={30}>Last 30 Days</option>
                            <option value={90}>Last 90 Days</option>
                        </select>
                    </div>

                    {problemData && problemData.totalSolved > 0 && (
                        <>
                            <div>
                                <h4>Problem Rating Buckets</h4>
                                <Bar
                                    data={{
                                        labels: Object.keys(problemData.ratingBuckets),
                                        datasets: [
                                            {
                                                label: 'Problems Solved',
                                                data: Object.values(problemData.ratingBuckets),
                                                backgroundColor: 'orange',
                                            },
                                        ],
                                    }}
                                    height={200}
                                />
                            </div>

                            <div>
                                <h4 style={{ marginTop: '60px' }}>Problem Solving Data</h4>
                                <p><strong>Total Solved:</strong> {problemData.totalSolved}</p>
                                <p><strong>Avg Rating:</strong> {problemData.avgRating}</p>
                                <p><strong>Avg/Day:</strong> {problemData.avgPerDay}</p>
                                <p><strong>Most Difficult:</strong> {problemData.hardestProblem.name} ({problemData.hardestProblem.rating})</p>
                            </div>
                        </>
                    )}

                    {/* --- Submission Heatmap --- */}


                    {student?.codeforcesHandle && (
                        <div style={{ marginTop: '5px' }}>
                            <h4>Submission Heatmap (Last 1 Year)</h4>
                            <CFHeatmap handle={student.codeforcesHandle} />
                        </div>
                    )}



                </div>
            </div>
        </div>
    );
}

export default StudentProfile;








