# Kaizen (改善)

> **"Continuous Improvement."**

Kaizen is a modern, full-stack Kanban board built to visualize tasks and optimize workflow. This project is a complete architectural overhaul of a legacy MERN stack application, transitioning it from a basic JavaScript task list to a robust, strictly typed TypeScript application with optimistic UI updates.

![Project Status](https://img.shields.io/badge/status-active-success.svg)
![License](https://img.shields.io/badge/license-MIT-blue.svg)

## 🚀 The Upgrade
This project was "refurbished" from a 2-year-old legacy codebase. The goal was to modernize the stack and improve the user experience by 10x without losing the original data.

| Feature | Legacy Version (Old) | **Kaizen (New)** |
| :--- | :--- | :--- |
| **Language** | JavaScript (Loose typing) | **TypeScript (Strict typing)** |
| **Frontend** | React (CRA) + CSS | **Vite + React + Tailwind CSS** |
| **State Mgmt** | `useEffect` + local state | **TanStack Query (React Query)** |
| **UX** | List View (Slow updates) | **Kanban Board (Optimistic UI)** |
| **Backend** | Express (Basic) | **Express + Zod + Mongoose (Typed)** |

## 🛠 Tech Stack

### Frontend
![React](https://img.shields.io/badge/React-20232A?style=flat-square&logo=react&logoColor=61DAFB)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=flat-square&logo=vite&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=flat-square&logo=tailwind-css&logoColor=white)
![TanStack Query](https://img.shields.io/badge/TanStack_Query-FF4154?style=flat-square&logo=react-query&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=flat-square&logo=typescript&logoColor=white)

### Backend
![Node.js](https://img.shields.io/badge/Node.js-339933?style=flat-square&logo=nodedotjs&logoColor=white)
![Express.js](https://img.shields.io/badge/Express.js-000000?style=flat-square&logo=express&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=flat-square&logo=mongodb&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=flat-square&logo=typescript&logoColor=white)

## ✨ Features
- **Kanban Visualization:** Organize tasks by status (To Do, In Progress, Completed).
- **Optimistic UI:** Interface updates instantly before the server responds, making the app feel native-speed.
- **Strict Typing:** End-to-end type safety shared between Frontend and Backend.
- **Unified Development:** Runs both servers with a single command via `concurrently`.

## 📦 Getting Started

### Prerequisites
- Node.js installed
- MongoDB running locally (default: `mongodb://localhost:27017/taskManager`)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/rohilshah2006/kaizen
   cd kaizen
   ```

2. **Install dependencies (Root, Frontend, & Backend)**
   We have a unified script to install everything at once:
   ```bash
   npm run install-all
   ```

### Running the App
Launch both the Frontend and Backend with a single command:
```bash
npm run dev
```
- **Frontend:** http://localhost:5173
- **Backend:** http://localhost:5001

## 📂 Project Structure

```bash
kaizen/
├── backend/          # Express API & Mongoose Models
│   ├── src/
│   │   ├── server.ts      # Entry point
│   │   ├── task.ts        # Mongoose Schema
│   │   └── taskRoutes.ts  # API Endpoints
├── frontend/         # Vite + React App
│   ├── src/
│   │   ├── api.ts         # Axios + React Query hooks
│   │   ├── App.tsx        # Kanban Board UI
│   │   └── types.ts       # Shared Interfaces
└── package.json      # Root scripts (Concurrently)
```

## 🔮 Roadmap
- [x] Drag and Drop functionality (dnd-kit)
- [x] Edit Task details (Modals)
- [ ] User Authentication (JWT)

## 📜 Changelog

### Mar 12, 2026 - Interactive Excellence
- **Complete UI/UX Overhaul**: Transitioned to a premium glassmorphic dark theme.
- **Drag & Drop**: Implemented fluid task movement across columns using `@dnd-kit`.
- **Advanced Filtering**: Added real-time search and priority-based filtering.
- **Task Management**: Introduced due dates with automated "Overdue" status tracking.
- **Enhanced Creation**: Unified creation and editing into a comprehensive task modal.
- **System Stability**: Repaired MongoDB service integration and added frontend connectivity error handling.

### Feb 23, 2026 - Modern Refresh
- Initial migration to React + Vite + Tailwind CSS.
- Basic Kanban board functionality with CRUD operations.
- Backend transition to Node.js/Express with Mongoose.

### 2024 - Legacy Version
- Original proof-of-concept release.
- Static task management and legacy styling.

## 📄 License
This project is open source and available under the [MIT License](LICENSE).