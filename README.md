# CodeNova Full Stack Internship — Task 1: Notes Application

[![Internship Track](https://img.shields.io/badge/Track-Full_Stack_Development-blue.svg)](https://codenova.community)
[![Batch](https://img.shields.io/badge/Batch-01_Remote-indigo.svg)](https://codenova.community)
[![Task](https://img.shields.io/badge/Task_1-Notes_Application-success.svg)](https://codenova.community)
[![Stack](https://img.shields.io/badge/Stack-React_19_+_Express_+_SQLite-purple.svg)](https://codenova.community)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

An end-to-end, production-ready Full-Stack Notes Application built to fulfill **Task 1** of the **CodeNova Remote Internship Program (Batch 01)**. Features a decoupled RESTful architecture, responsive React frontend with instant search filtering, dual-mode layout (Card Grid / List View), persistent SQLite storage, and a robust toast notification system.

---

## 📋 Table of Contents
1. [Project Overview](#-project-overview)
2. [Key Features](#-key-features)
3. [Architecture & Folder Structure](#-architecture--folder-structure)
4. [Database Schema & Design](#-database-schema--design)
5. [RESTful API Specification](#-restful-api-specification)
6. [Prerequisites & Installation](#-prerequisites--installation)
7. [Running the Application](#-running-the-application)
8. [Acceptance Criteria Verification](#-acceptance-criteria-verification)
9. [Submission Checklist](#-submission-checklist)

---

## 🎯 Project Overview

- **Objective**: Build a complete, synchronized client-and-server web application for creating, reading, editing, searching, and deleting notes with database persistence.
- **Frontend Stack**: React 19, Vite, Tailwind CSS v4, Lucide React icons.
- **Backend Stack**: Node.js, Express, SQLite 3 (`sqlite3`), Morgan, CORS, Dotenv.
- **Database**: SQLite with indexed tables and foreign constraint checks.
- **Tooling**: Zero paid tools or proprietary APIs used (100% free and open-source).

---

## ✨ Key Features

| Feature | Description |
| :--- | :--- |
| **Complete CRUD Lifecycle** | Create, view, update, and delete notes with synchronized state between client and database. |
| **Instant Real-Time Search** | Dynamic filtering by title, note body, and category with zero perceptible latency. |
| **Responsive Dual-View Modes** | Seamless one-click switching between **Masonry/Card Grid View** and **Compact List View**. |
| **Pin to Top** | Priority notes can be pinned to ensure critical information stays anchored at the top of the interface. |
| **Category Tagging & Filtering** | Tag notes under presets (`Work`, `Personal`, `Ideas`, `Engineering`, `Study`) or custom categories with dynamic counts. |
| **Custom Pastel Color Palette** | Assign distinct visual themes to notes for visual hierarchy and organization. |
| **Dual-Layer Validation** | Client-side input boundary checks coupled with server-side HTTP 400 rejection for blank payloads. |
| **Graceful Notifications** | Animated toast notifications for success states, form errors, and server/network drops. |
| **Safe Deletion Modal** | Confirmation dialog preventing accidental note deletion. |

---

## 🏗 Architecture & Folder Structure

```
codenova-notes-app/
├── package.json              # Monorepo orchestrator (concurrent dev runners)
├── .gitignore                # Git ignore for logs, sqlite databases, and node_modules
├── README.md                 # Detailed project and submission documentation
│
├── server/                   # Backend REST API Service
│   ├── package.json          # Express, SQLite3, CORS dependencies
│   ├── .env.example          # Environment variable template
│   ├── .env                  # Local environment configuration
│   ├── notes.db              # SQLite persistent database file (auto-generated)
│   └── src/
│       ├── index.js          # Express entrypoint & central error handler
│       ├── database.js       # SQLite connection & schema initialization
│       ├── schema.sql        # Pure SQL schema definition & indexes
│       ├── routes/
│       │   └── notes.js      # REST API route handlers (/api/notes)
│       └── scripts/
│           └── seed.js       # Database seeder with realistic sample notes
│
└── client/                   # Frontend React Application
    ├── package.json          # React 19, Tailwind CSS v4, Lucide dependencies
    ├── vite.config.js        # Vite config with backend /api proxy
    ├── index.html            # HTML template with typography
    └── src/
        ├── main.jsx          # React DOM entrypoint & ToastProvider wrapper
        ├── App.jsx           # Main application state & UI coordinator
        ├── index.css         # Tailwind v4 styles & custom scrollbars
        ├── api/
        │   └── notesApi.js   # Fetch wrapper for all backend REST endpoints
        ├── context/
        │   └── ToastContext.jsx # Toast notification context & visual toasts
        └── components/
            ├── Header.jsx    # Logo, instant search bar, view mode toggle, new note CTA
            ├── CategoryBar.jsx # Dynamic category pill filters with note count
            ├── NoteCard.jsx  # Card & list view item with pin/edit/delete actions
            ├── NoteModal.jsx # Create/Edit modal with color picker & category selector
            └── DeleteConfirmModal.jsx # Confirmation dialog before deleting
```

---

## 🗄 Database Schema & Design

The database schema is defined in `server/src/schema.sql` and enforced automatically upon server startup:

```sql
CREATE TABLE IF NOT EXISTS notes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL CHECK(length(trim(title)) > 0),
    content TEXT NOT NULL CHECK(length(trim(content)) > 0),
    category TEXT DEFAULT 'General',
    color TEXT DEFAULT '#ffffff',
    is_pinned INTEGER DEFAULT 0 CHECK(is_pinned IN (0, 1)),
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL
);

-- Performance Indexes
CREATE INDEX IF NOT EXISTS idx_notes_created_at ON notes(created_at);
CREATE INDEX IF NOT EXISTS idx_notes_pinned ON notes(is_pinned);
CREATE INDEX IF NOT EXISTS idx_notes_category ON notes(category);
```

---

## 📡 RESTful API Specification

| Method | Endpoint | Description | Payload / Query | Status Codes |
| :--- | :--- | :--- | :--- | :--- |
| `GET` | `/api/health` | Service health status check | — | `200 OK` |
| `GET` | `/api/notes` | Retrieve all notes | `?search=...&category=...` | `200 OK` |
| `GET` | `/api/notes/categories/list` | Retrieve all unique note categories | — | `200 OK` |
| `GET` | `/api/notes/:id` | Fetch single note by ID | — | `200 OK`, `404 Not Found` |
| `POST` | `/api/notes` | Create a new note | JSON: `{ title, content, category, color, is_pinned }` | `201 Created`, `400 Bad Request` |
| `PUT` | `/api/notes/:id` | Update note attributes | JSON: `{ title, content, category, color, is_pinned }` | `200 OK`, `400 Bad Request`, `404 Not Found` |
| `PATCH` | `/api/notes/:id/pin` | Toggle pin status | — | `200 OK`, `404 Not Found` |
| `DELETE` | `/api/notes/:id` | Delete note permanently | — | `200 OK`, `404 Not Found` |

### Sample cURL Requests

**1. Create Note:**
```bash
curl -X POST http://localhost:5000/api/notes \
  -H "Content-Type: application/json" \
  -d '{"title":"CodeNova Milestone","content":"Complete Task 1 and Task 2!","category":"Work","color":"#eff6ff"}'
```

**2. Search Notes:**
```bash
curl -X GET "http://localhost:5000/api/notes?search=CodeNova"
```

---

## ⚙️ Prerequisites & Installation

### Requirements
- **Node.js**: v18.0.0 or later (v20+ or v24+ recommended)
- **npm**: v9.0.0 or later

### Quick Setup

1. **Clone or navigate to the repository:**
   ```bash
   cd codenova-notes-app
   ```

2. **Install all dependencies across root, server, and client:**
   ```bash
   npm run install:all
   ```

3. **Seed initial sample data (optional but recommended for demonstration):**
   ```bash
   npm run seed
   ```

---

## 🚀 Running the Application

### Option A: Run Both Client & Server Concurrently (Recommended)
From the root directory:
```bash
npm run dev
```
- **Backend API**: Running at `http://localhost:5000`
- **Frontend App**: Running at `http://localhost:5173`

### Option B: Run Services Separately
- **Start Backend**:
  ```bash
  cd server
  npm run dev
  ```
- **Start Frontend**:
  ```bash
  cd client
  npm run dev
  ```

---

## ✅ Acceptance Criteria Verification

| CodeNova Requirement | Implementation Evidence | Status |
| :--- | :--- | :---: |
| **Frontend CRUD UI** | Dedicated modal for composing & editing, inline pin toggle, and delete confirmation dialog. | **PASSED** |
| **RESTful API Backend** | Express server with complete route handler suite (`GET`, `POST`, `PUT`, `PATCH`, `DELETE`). | **PASSED** |
| **Database Persistence** | SQLite file database with schema definition and indexing; survives server restarts. | **PASSED** |
| **Responsive Grid & List View** | View mode toggle in header instantly switches layout from multi-column card grid to single list. | **PASSED** |
| **Instant Search Filtering** | React memoized filter updates visible notes on each keystroke across title, content, and category. | **PASSED** |
| **State Synchronization** | Client state synchronizes with database records after every mutation. | **PASSED** |
| **Graceful Toast Notifications** | `ToastContext` displays floating auto-dismissing toast alerts for successes, warnings, and API failures. | **PASSED** |
| **Clean Architecture** | Strict separation of concerns between `client/` and `server/` with root monorepo scripts. | **PASSED** |

---

## 📌 Submission Checklist for Interns

- [x] Full-stack source code organized cleanly in monorepo.
- [x] SQLite database schema defined in `schema.sql` and initialized programmatically.
- [x] Zero paid tools used (100% free local SQLite + Express + React).
- [x] Database seeder script included (`npm run seed`).
- [x] No secrets or credentials in repository.
- [ ] Push codebase to a public GitHub repository named `codenova-notes-app`.
- [ ] Record a brief walkthrough demo or capture screenshots for the submission form.
- [ ] Complete at least 1 additional task (e.g., Task 2 Expense Tracker) to satisfy the **2-task minimum** requirement.
