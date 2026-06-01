# Task Orbit ✨

Task Orbit is a full-stack to-do application with session-based login, task CRUD, and a polished React dashboard. It is designed to feel clean, modern, and recruiter-ready while staying practical for real use.

> Fast login, smooth task control, and a bright white UI with orange and green accents.

## Highlights

- Secure register, login, logout, and session restore flow
- Demo account seeded automatically for quick testing
- Create, update, complete, and delete tasks
- Separate pending and completed sections for clarity
- Responsive dashboard with stat cards and premium visual styling
- Production-ready backend that serves the built React app

## Demo Credentials

- Email: `admin@example.com`
- Password: `Admin123`

## Tech Stack

- React + Webpack + Babel
- Node.js + Express
- MongoDB + Mongoose, with in-memory fallback for local development
- express-session for authentication
- CSS-driven UI effects and motion

## Project Structure

```text
.
├── frontend/
│   ├── public/
│   ├── src/
│   ├── package.json
│   └── webpack.config.js
├── server/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── db.js
│   ├── seed.js
│   └── server.js
├── Procfile
├── package.json
└── README.md
```

## Local Setup

1. Install dependencies:

```bash
npm install
cd frontend
npm install
```

2. Create a `.env` file from `.env.example` and set:

- `MONGO_URI`
- `SESSION_SECRET`
- `NODE_ENV`

3. Start the app in development:

```bash
npm run dev
```

4. Open the app:

- React UI: `http://localhost:3000`
- API server: `http://localhost:5000`

## API Endpoints

### Auth

- `POST /api/auth/register`
- `POST /api/auth/login`
- `POST /api/auth/logout`
- `GET /api/auth/me`

### Tasks

- `GET /api/tasks`
- `POST /api/tasks`
- `PUT /api/tasks/:id`
- `DELETE /api/tasks/:id`

## Production Build

Build the React frontend with:

```bash
npm run build
```

The backend serves `frontend/dist` in production, and the repo includes a `heroku-postbuild` script for deployment platforms that support it.

## Deployment Notes 🚀

- Set `MONGO_URI`, `SESSION_SECRET`, and `NODE_ENV=production` on your host.
- Use `npm start` for the server command.
- Add the repo to GitHub, then connect it to Heroku or another Node host.
- If MongoDB is unavailable locally, the app falls back to in-memory storage so the UI still works for demo purposes.

### Recommended GitHub Deploy Flow

1. Push your final code to GitHub.
2. Connect the GitHub repository to a hosting service such as Heroku or Render.
3. Set the environment variables on the host.
4. Let the host run `npm install` and `npm run heroku-postbuild` during deployment.
5. Open the deployed URL and test login, tasks, and logout.

## Styling Notes 🎨

- White background with warm orange and fresh green accents
- Rounded cards, soft shadows, and subtle motion for a premium feel
- Optimized for desktop and mobile layouts

## Future Ideas

- Due dates and reminders
- Search, filter, and sort controls
- Password reset flow
- Task categories and labels
