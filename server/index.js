const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();
const { scheduleCFJob } = require("./jobs/syncCFDataJob");

const app = express();
const PORT = 8080;

app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => console.log("MongoDB connected"))
  .catch(err => console.log("Mongo error:", err));

// ✅ Load student routes
const studentRoutes = require("./routes/students");
app.use("/api/students", studentRoutes);

// ✅ Load new Codeforces routes
const codeforcesRoutes = require('./routes/codeforces');
app.use("/api/codeforces", codeforcesRoutes);


// Schedule the Codeforces data sync job at 2am daily
// scheduleCFJob();

// Default test route
app.get('/', (req, res) => {
    res.send('Backend is running!');
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

