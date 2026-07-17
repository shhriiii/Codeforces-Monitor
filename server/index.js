const express = require("express");
const cors = require("cors");
const fs = require('fs');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 8080;

app.use(cors());
app.use(express.json());

// Codeforces data is fetched live; this server does not require a database.
const codeforcesRoutes = require('./routes/codeforces');
app.use("/api/codeforces", codeforcesRoutes);

app.get('/api/health', (req, res) => {
    res.json({ message: 'Codeforces tracker API is running.' });
});

// When deployed as one service, serve the React build alongside the API.
const clientBuildPath = path.join(__dirname, '../client/build');
if (fs.existsSync(clientBuildPath)) {
    app.use(express.static(clientBuildPath));
    app.get('/{*splat}', (req, res, next) => {
        if (req.path.startsWith('/api/')) return next();
        res.sendFile(path.join(clientBuildPath, 'index.html'));
    });
}


app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
