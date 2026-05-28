const mongoose = require("mongoose");

let dbConnected = false;

async function connectDB() {
  const mongoUri = process.env.MONGO_URI;

  if (!mongoUri) {
    if (process.env.NODE_ENV === "production") {
      throw new Error("MONGO_URI is not configured in environment variables.");
    }

    console.warn("MONGO_URI is missing. Running with in-memory fallback (development only).");
    dbConnected = false;
    return;
  }

  try {
    await mongoose.connect(mongoUri);
    dbConnected = true;
    console.log("MongoDB connected");
  } catch (error) {
    if (process.env.NODE_ENV === "production") {
      throw error;
    }

    console.warn("MongoDB connection failed. Running with in-memory fallback (development only).");
    console.warn(error.message);
    dbConnected = false;
  }
}

function isDbConnected() {
  return dbConnected;
}

module.exports = { connectDB, isDbConnected };
