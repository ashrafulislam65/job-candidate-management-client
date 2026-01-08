# Job Candidate Management System

<div align="center">
  <img src="public/home-page.png" alt="JobPortal Home Page" width="800" />
  <br />
  <h1 align="center">JobPortal - Intelligent Recruitment Solution</h1>
  <p align="center">
    A premium, MERN-stack based platform for managing recruitment workflows with precision and style.
  </p>
</div>

## 🔗 Links

- **Live Application**: [https://job-candidate-auth.web.app/](https://job-candidate-auth.web.app/)
- **GitHub Client**: [https://github.com/ashrafulislam65/job-candidate-management-client](https://github.com/ashrafulislam65/job-candidate-management-client)
- **GitHub Server**: [https://github.com/ashrafulislam65/job-candidate-management-server](https://github.com/ashrafulislam65/job-candidate-management-server)

## 🚀 Overview

JobPortal streamlines the hiring process by connecting candidates with opportunities and giving administrators powerful tools to manage talent. Built with React, Node.js, and MongoDB, it features a modern, responsive design with glassmorphism aesthetics.

### Currently Live Features:
*   **For Candidates**:
    *   **Premium Profile Creation**: Register with ease and build a professional profile.
    *   **Dashboard**: View application status and scheduled interviews.
    *   **Secure Authentication**: Enhanced security with Firebase Auth and strict validation.
*   **For Administrators**:
    *   **Candidate Management**: Filter, sort, and manage hundreds of applications efficiently.
    *   **Interview Scheduling**: Seamlessly schedule interviews and track their status.
    *   **User Management**: Manage system users and roles (Admin/Staff/Candidate).
    *   **Visual Analytics**: Real-time charts and stats on the dashboard.

## 🛠 Tech Stack

*   **Frontend**: React, Vite, Tailwind CSS, DaisyUI, React Router, React Query.
*   **Backend**: Node.js, Express.js (REST API).
*   **Database**: MongoDB Atlas (Native Driver).
*   **Authentication**: Firebase Auth.
*   **Deployment**: Firebase Hosting (Client) / Vercel (Server).

## 💻 Running Locally

Follow these steps to get the project up and running on your local machine.

### Prerequisites
*   Node.js (v16 or higher)
*   MongoDB Account (or local instance)
*   Firebase Project (for authentication)

### 1. Clone the Repository
```bash
git clone https://github.com/yourusername/job-candidate-client.git
cd job-candidate-client
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Environment Variables
Create a `.env.local` file in the root directory and add the following keys:
```env
# API URL (Backend)
VITE_API_URL=http://localhost:5000

# Firebase Configuration
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

### 4. Run Development Server
```bash
npm run dev
```
The application will launch at `http://localhost:5173`.

## 📦 Deployment

This project is optimized for **Firebase Hosting**.

1.  **Build the project**:
    ```bash
    npm run build
    ```
2.  **Deploy**:
    ```bash
    firebase deploy
    ```

## 📸 Functionality Highlights

-   **Dynamic Titles**: Browser tabs update automatically based on your navigation.
-   **Animations**: Smooth transitions and engaging loading states.
-   **Data Security**: Strict form validations and protected backend routes.
-   **Mobile First**: Fully responsive design that works perfectly on phones and tablets.

## 🎯 Design Choices & Assumptions

### Architecture Decisions
-   **MERN Stack**: Chose React + Node.js for modern, scalable Single Page Application architecture with real-time updates
-   **Firebase Authentication**: Enterprise-grade auth with built-in security features and token-based API protection
-   **MongoDB Atlas**: Document-based NoSQL database for flexible schema and horizontal scalability
-   **Serverless Deployment**: Vercel for backend (auto-scaling, zero-config) and Firebase Hosting for frontend

### Technical Implementation
-   **File Upload System**: Implemented Excel parsing using `xlsx` and `ExcelJS` libraries with intelligent header detection
-   **Role-Based Access Control**: Three-tier system (Admin, Staff, Candidate) with middleware-based route protection
-   **Image Handling**: Magic number detection for file type validation; `/tmp` directory usage in serverless environment
-   **State Management**: React Query for server state caching and automatic refetching
-   **Form Validation**: React Hook Form with strict patterns (password strength, email format, phone validation)

### Key Assumptions
-   Candidates can self-register; Admins can bulk-upload via Excel files
-   Interview status automatically updates to "Completed" when scheduled date passes
-   Phone numbers stored as strings to preserve international formatting
-   Profile photos are optional; system provides default avatars
-   Excel files may contain varying header formats (intelligent parsing handles synonyms)
-   In production, uploaded files in `/tmp` are temporary (recommendation: migrate to S3/Firebase Storage for persistence)

### Security Measures
-   Firebase ID tokens verified on every protected API request
-   Sensitive files (`.env`, `serviceAccountKey.json`) excluded via `.gitignore`
-   CORS configured for specific origins only
-   Password requirements: minimum 8 characters, uppercase, lowercase, number, special character

---
*"Rode to my dream"*
