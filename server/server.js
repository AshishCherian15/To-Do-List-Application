require("dotenv").config();

const path = require("path");
const express = require("express");
const session = require("express-session");
const morgan = require("morgan");

const { connectDB, isDbConnected } = require("./db");
const authRoutes = require("./routes/auth");
const taskRoutes = require("./routes/tasks");
const { seedDemo } = require("./seed");

const app = express();
const PORT = process.env.PORT || 5000;
let server;

app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// If running behind a proxy (Heroku, etc.), trust the first proxy so secure cookies work
if (process.env.NODE_ENV === 'production' || process.env.TRUST_PROXY === '1') {
  app.set('trust proxy', 1);
}

app.use(
  session({
    name: "todo.sid",
    secret: process.env.SESSION_SECRET || "dev_secret",
    resave: false,
    saveUninitialized: false,
      cookie: {
        httpOnly: true,
        // Use 'none' in production to allow cross-site cookies when serving frontend separately
        sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
        secure: process.env.NODE_ENV === 'production',
        maxAge: 1000 * 60 * 60 * 24,
      },
  })
);

app.use("/api/auth", authRoutes);
app.use("/api/tasks", taskRoutes);

app.use(express.static(path.join(__dirname, "..", "public")));
// In production, serve the React frontend build if present
const frontendDist = path.join(__dirname, '..', 'frontend', 'dist');
if (process.env.NODE_ENV === 'production') {
  if (require('fs').existsSync(frontendDist)) {
    app.use(express.static(frontendDist));
    app.get('*', (req, res) => {
      res.sendFile(path.join(frontendDist, 'index.html'));
    });
  } else {
    // fallback to legacy public folder
    app.use(express.static(path.join(__dirname, '..', 'public')));
    app.get('*', (req, res) => {
      res.sendFile(path.join(__dirname, '..', 'public', 'index.html'));
    });
  }
} else {
  app.use(express.static(path.join(__dirname, '..', 'public')));
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'public', 'index.html'));
  });
}

async function startServer() {
  try {
    await connectDB();
    // seed demo user/tasks if missing
    await seedDemo();
    server = app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
      if (!isDbConnected()) {
        console.log("Using in-memory storage fallback (development mode).");
      }
    });
    server.on('error', (error) => {
      if (error.code === 'EADDRINUSE') {
        console.error(`Port ${PORT} is already in use. Stop the old process and restart.`);
        process.exit(1);
      }
      throw error;
    });
  } catch (error) {
    console.error("Server startup failed", error);
    process.exit(1);
  }
}

function shutdown(signal) {
  return () => {
    if (server) {
      server.close(() => process.exit(0));
      return;
    }

    process.exit(0);
  };
}

process.on('SIGINT', shutdown('SIGINT'));
process.on('SIGTERM', shutdown('SIGTERM'));
process.on('SIGUSR2', shutdown('SIGUSR2'));

startServer();
