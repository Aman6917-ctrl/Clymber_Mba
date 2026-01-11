require("dotenv").config();
const app = require("./app");
const mongoose = require("mongoose");

// MongoDB connection with better error handling
if (process.env.MONGO_URI) {
  mongoose
    .connect(process.env.MONGO_URI)
    .then(() => {
      console.log("🟢 MongoDB Connected Successfully");
      mongoose.connection.on("error", (err) => {
        console.error("🔴 MongoDB Connection Error:", err.message);
      });
      mongoose.connection.on("disconnected", () => {
        console.warn("⚠️  MongoDB Disconnected");
      });
    })
    .catch(err => {
      console.error("🔴 MongoDB Connection Failed:", err.message);
      console.log("⚠️  Server will continue running but database operations will fail.");
      console.log("");
      console.log("💡 To fix MongoDB Atlas connection:");
      console.log("   1. Go to: https://cloud.mongodb.com");
      console.log("   2. Navigate to: Network Access → Add IP Address");
      console.log("   3. Click 'Add Current IP Address' or add: 0.0.0.0/0 (for development)");
      console.log("   4. Wait 2-3 minutes for changes to propagate");
      console.log("   5. Verify MONGO_URI in .env file is correct");
      console.log("   6. Restart the server: npm start");
      console.log("");
      console.log("📖 See MONGODB_SETUP.md for detailed instructions");
    });
} else {
  console.warn("⚠️  MONGO_URI not found in environment variables");
  console.log("💡 Please add MONGO_URI to your .env file");
}

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📡 Health check: http://localhost:${PORT}/api/health`);
});
