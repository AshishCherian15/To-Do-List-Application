# Simple To-Do List Application

A minimal full stack To-Do List Application where users can register/login and manage daily tasks efficiently.

This project aligns with the Glowlogics program learning outcomes in partnership with TechFest IIT Bombay.

## Objective

Build a clean and practical task management app with authentication and task CRUD operations.

## Features

- User authentication
- Register/Login with email + password
- Session-based authentication handling
- Task creation
- Add task title (required) and description (optional)
- Task management
- Mark tasks complete/incomplete
- Edit task title and description
- Delete tasks
- Task viewing
- Clean dashboard UI
- Separate pending and completed task sections
- Responsive design for desktop and mobile
- Premium frontend design system with animated background, dashboard stats, and polished cards
- Anime.js powered motion for section reveals, stat/progress transitions, and task list entry animations

## Tech Stack

### Front-End

- HTML5
- CSS3
- JavaScript (DOM manipulation + fetch API)
- Anime.js (UI animations)

### Back-End

- Node.js
- Express.js
- RESTful API endpoints

### Database

- MongoDB
- Mongoose ODM

### Integration & Deployment

- Front-end served by Express
- API integration through fetch requests
- Ready to deploy on Heroku, Vercel (with server support), or AWS

## Project Structure

```text
.
├── public/
│   ├── app.js
│   ├── index.html
│   └── styles.css
├── server/
│   ├── middleware/
│   │   └── auth.js
│   ├── models/
│   │   ├── Task.js
│   │   └── User.js
│   ├── routes/
│   │   ├── auth.js
│   │   └── tasks.js
│   ├── db.js
│   └── server.js
├── .env.example
├── .gitignore
├── package.json
└── README.md
```

## Setup Instructions

1. Clone repository and open project.
2. Install dependencies:

```bash
npm install
```

3. Create environment file:

- Copy `.env.example` to `.env`
- Update values for `MONGO_URI` and `SESSION_SECRET`

4. Start MongoDB locally (or provide a cloud MongoDB URI).
5. Run in development mode:

```bash
npm run dev
```

6. Open in browser:

- `http://localhost:5000`

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

## Deployment Notes

- Set environment variables on your hosting provider:
- `PORT`
- `MONGO_URI`
- `SESSION_SECRET`
- `NODE_ENV=production`
- Use `npm start` as the production start command.

## Live Demo Link

Add your deployed URL here after deployment:

- Live Demo: `https://your-live-link.example.com`

## Future Improvements

- Password reset flow
- Task due dates and reminders
- Search/filter/sort controls
- Pagination for large task lists
