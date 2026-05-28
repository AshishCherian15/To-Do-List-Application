require("dotenv").config();

const path = require("path");
const express = require("express");
const session = require("express-session");
const morgan = require("morgan");

const { connectDB, isDbConnected } = require("./db");
const authRoutes = require("./routes/auth");
const taskRoutes = require("./routes/tasks");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  session({
    name: "todo.sid",
    secret: process.env.SESSION_SECRET || "dev_secret",
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      maxAge: 1000 * 60 * 60 * 24,
    },
  })
);

app.use("/api/auth", authRoutes);
app.use("/api/tasks", taskRoutes);

app.use(express.static(path.join(__dirname, "..", "public")));
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "..", "public", "index.html"));
});

async function startServer() {
  try {
    await connectDB();
    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
      if (!isDbConnected()) {
        console.log("Using in-memory storage fallback (development mode).");
      }
    });
  } catch (error) {
    console.error("Server startup failed", error);
    process.exit(1);
  }
}

startServer();
