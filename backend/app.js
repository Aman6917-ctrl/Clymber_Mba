const express = require("express");
const cors = require("cors");

const app = express();

// CORS (frontend = Vite + Production)
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "http://localhost:8080",
      "http://127.0.0.1:5173",
      "http://127.0.0.1:8080",
      "https://predictor-frontend.onrender.com",
      "https://mba-predictor-frontend.onrender.com"
    ],
    methods: ["GET", "POST"],
    credentials: true,
  })
);

app.use(express.json());

// routes
app.use("/api/predict", require("./routes/predictRoutes"));

// health check (optional but useful)
app.get("/", (req, res) => {
  res.json({ 
    status: "ok", 
    message: "🚀 MBA Call Predictor Backend Running",
    timestamp: new Date().toISOString()
  });
});

// API health check
app.get("/api/health", (req, res) => {
  res.json({ 
    status: "ok", 
    message: "API is healthy",
    timestamp: new Date().toISOString()
  });
});

module.exports = app;
