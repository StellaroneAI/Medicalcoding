# My Medical Coding AI App

This is a React-based web application for medical coding, powered by Firebase for backend services, authentication, and hosting.

## Features

- **User Authentication:** Secure login for medical coders and admins.
- **Role-Based Access:** Admins have access to a dashboard to oversee operations.
- **Automated Document Processing:** Upload PDF medical records for automatic AI-based coding.
- **Real-time Notifications:** Get notified when your documents are processed.
- **HIPAA-Compliant Auditing:** All data changes are logged for compliance.

## Getting Started

### 1. Prerequisites

- Node.js (v16 or later)
- Firebase Account and a new Firebase Project

### 2. Installation

1.  **Clone the repository:**
    ```bash
    git clone <your-repo-url>
    cd my-medical-coding-app
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

### 3. Firebase Setup

1.  Go to your Firebase project console.
2.  Enable **Authentication** (Email/Password method).
3.  Enable **Firestore Database**.
4.  Enable **Storage**.
5.  Create a **web app** and copy the Firebase configuration.
6.  Create a `.env.local` file in the project root and paste your credentials:
    ```
    NEXT_PUBLIC_FIREBASE_API_KEY="YOUR_API_KEY"
    # ... and so on for all keys
    ```

### 4. Running the Development Server

Start the Next.js development server:

```bash
npm run dev