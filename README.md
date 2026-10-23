# CodeNova Notes App

A full-stack notes application built with **React, Node.js, Express, and SQLite** as part of the CodeNova Full Stack Development Internship.

[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![Node.js](https://img.shields.io/badge/Node.js-Backend-339933?logo=nodedotjs&logoColor=white)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express.js-API-000000?logo=express)](https://expressjs.com/)
[![SQLite](https://img.shields.io/badge/Database-SQLite-003B57?logo=sqlite&logoColor=white)](https://www.sqlite.org/)

## Overview

CodeNova Notes App provides a simple way to create, organize, search, edit, and delete notes. It uses a React frontend, an Express REST API, and SQLite for persistent data storage.

## Features

- **Create, Read, Update & Delete** — manage notes with full CRUD functionality.
- **Instant Search** — find notes by title, content, or category.
- **Grid & List Views** — switch between different layouts.
- **Pin Notes** — keep important notes easily accessible.
- **Categories** — organize notes by topic.
- **Custom Colors** — visually distinguish notes.
- **Toast Notifications** — receive feedback on actions and errors.
- **Delete Confirmation** — reduce accidental deletions.
- **Responsive Interface** — use the application across different screen sizes.

## Tech Stack

| Layer | Technologies |
|---|---|
| Frontend | React 19, Vite, Tailwind CSS v4 |
| Backend | Node.js, Express.js |
| Database | SQLite 3 |
| Utilities | Lucide React, Morgan, CORS, dotenv |

## Project Structure

```text
codenova-notes-app/
├── client/
│   ├── src/
│   │   ├── api/
│   │   ├── components/
│   │   ├── context/
│   │   ├── App.jsx
│   │   └── index.css
│   ├── index.html
│   └── package.json
├── server/
│   ├── src/
│   │   ├── routes/
│   │   ├── scripts/
│   │   ├── database.js
│   │   ├── index.js
│   │   └── schema.sql
│   └── package.json
├── .gitignore
├── package.json
└── README.md
```

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or later)
- npm

### Installation

**1. Clone the repository**

```bash
git clone https://github.com/saqibishaque/codenova-notes-app.git
cd codenova-notes-app
```

**2. Install dependencies**

```bash
npm run install:all
```

**3. Start the application**

```bash
npm run dev
```

Open the frontend at `http://localhost:5173`.

The backend API runs at `http://localhost:5000`.

### Optional: Add sample data

To seed the database with sample notes, run:

```bash
npm run seed
```

Run this command from the project root.

## API Endpoints

| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/api/health` | Check server health |
| GET | `/api/notes` | Retrieve and search notes |
| GET | `/api/notes/categories/list` | Retrieve categories |
| GET | `/api/notes/:id` | Retrieve one note |
| POST | `/api/notes` | Create a note |
| PUT | `/api/notes/:id` | Update a note |
| PATCH | `/api/notes/:id/pin` | Toggle note pin |
| DELETE | `/api/notes/:id` | Delete a note |

## What I Learned

- Building a full-stack application with React and Express.
- Designing RESTful API endpoints.
- Integrating SQLite for persistent storage.
