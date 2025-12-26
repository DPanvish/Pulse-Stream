# PulseStream - Video Upload & Streaming Application

## 1. Project Overview
PulseStream is a full-stack MERN application designed to handle video uploads, content sensitivity analysis, and seamless streaming. It features a robust backend that processes videos for safety (simulated AI analysis), real-time status updates via Socket.io, and role-based access control for Viewers and Editors.

This project was built to satisfy the requirements of the "Pulse Assignment 2" specifications.

## Project Structure
```text
pulse-stream/
├── backend/                 # Server-Side Code
│   ├── config/              # DB & Cloudinary Config
│   ├── controllers/         # Logic (Auth, Video, Uploads)
│   ├── middleware/          # Auth Protection & File Handling
│   ├── models/              # Mongoose Schemas (User, Video)
│   ├── routes/              # API Route Definitions
│   ├── uploads/             # Temp storage for video processing
│   ├── server.js            # Entry Point
│   └── .env                 # Secrets (Not committed)
│
├── frontend/                # Client-Side Code
│   ├── src/
│   │   ├── components/      # Reusable UI (Navbar, Modals)
│   │   ├── context/         # Auth State Management
│   │   ├── pages/           # Views (Login, Dashboard)
│   │   └── api.js           # Axios Configuration
│   └── vite.config.js       # Build Config
│
└── README.md                # Documentation
---

## 2. Key Features
* **Video Management:** Secure video upload using Cloudinary storage.
* **Content Analysis:** Automated simulation of content sensitivity checks (Safe vs. Flagged).
* **Real-Time Updates:** Live processing status updates on the dashboard using Socket.io.
* **Role-Based Access Control (RBAC):**
    * **Viewers:** Can watch videos.
    * **Editors/Admins:** Can upload and delete videos.
* **Streaming:** Integrated video player with support for MP4 streaming.
* **Search & Filter:** Real-time filtering of video library.

---

## 3. Technology Stack
* **Frontend:** React (Vite), Tailwind CSS, Axios.
* **Backend:** Node.js, Express.js.
* **Database:** MongoDB (Mongoose ODM).
* **Real-Time:** Socket.io.
* **Storage:** Cloudinary (Video hosting).
* **Authentication:** JWT (JSON Web Tokens).

---

## 4. Installation & Setup Guide

### Prerequisites
* Node.js (v14 or higher)
* MongoDB Atlas Account (or local MongoDB)
* Cloudinary Account

### Step 1: Clone the Repository
```bash
git clone <repository-url>
cd pulse-stream
```

### Step 2: Backend Setup
Navigate to the backend folder:

```bash
cd backend
```
Install dependencies:

```bash
npm install
```
Create a `.env` file in the backend folder and add your credentials:

```
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key_12345
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```
Create the temporary uploads folder:

```bash
mkdir uploads
```
Start the Server:

```bash
npm run dev
```

### Step 3: Frontend Setup
Open a new terminal and navigate to the frontend folder:

```bash
cd frontend
```
Install dependencies:

```bash
npm install
```
Start the React App:

```bash
npm run dev
```
Open your browser at http://localhost:5173.

---

## 5. API Documentation
### Authentication
| Method | Endpoint | Description | Access |
| --- | --- | --- | --- |
| POST | /api/users/register | Register a new user | Public |
| POST | /api/users/login | Login user & get JWT | Public |

### Video Management
| Method | Endpoint | Description | Access |
| --- | --- | --- | --- |
| GET | /api/videos | Get all videos | Private |
| GET | /api/videos/:id | Get single video details | Private |
| POST | /api/videos/upload | Upload video file | Editor/Admin |
| DELETE | /api/videos/:id | Delete video | Owner/Admin |

---

## 6. Architecture & Design Decisions
### System Architecture Diagram
```mermaid
graph TD
    User[End User] -->|HTTPS| Frontend[React Frontend (Vite)]
    Frontend -->|REST API| Backend[Node/Express Server]
    Frontend -->|Socket.io| Backend
    
    subgraph "Backend Services"
        Backend -->|Auth/Data| DB[(MongoDB Atlas)]
        Backend -->|File Upload| Cloud[Cloudinary Storage]
        Backend -->|Background Process| AI[Simulated AI Analysis]
    end
    
    AI -->|Update Status| Backend
    Backend -->|Real-Time Event| Frontend

### Architecture Overview
The application follows a Monorepo-style structure with distinct separation of concerns:

* **Client-Side (Frontend):** Handles UI, authentication state (Context API), and real-time event listening.
* **Server-Side (Backend):** RESTful API services handling business logic, database interactions, and file processing.
* **Event Loop:** A processing simulation runs asynchronously to mimic AI content moderation without blocking the main thread.

### Design Decisions & Assumptions
* **Simulated AI:** Actual video content moderation APIs (like AWS Rekognition) are expensive. We simulated this process using a `setTimeout` function that randomly assigns "Safe" or "Flagged" status after 10 seconds.
* **Storage Strategy:** We use Cloudinary for video storage instead of local disk storage to ensure the application is stateless and deployable on cloud platforms like Render/Vercel.
* **Security:** Passwords are hashed using `bcryptjs`. API routes are protected via a custom middleware that verifies the JWT Bearer token.