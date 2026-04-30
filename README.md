# Gamified To-Do List Application

Welcome to the Gamified To-Do List! This application turns your boring tasks into an RPG game. You can earn XP, maintain streaks, and level up by completing tasks. However, if you miss a task's due date, your XP gain will be penalized!

This project is split into two parts: the Node.js **backend** and the React **frontend**.

## Prerequisites

Ensure you have the following installed on your machine:
- [Node.js](https://nodejs.org/) (v16 or higher recommended)
- npm (comes with Node.js)

---

## Step 1: Start the Backend Server

The backend handles user authentication, task storage, and the gamification logic (calculating XP, penalties, and leveling up). It connects to a MongoDB database.

1. Open a terminal and navigate to the backend folder:
   ```bash
   cd backend
   ```
2. Install the necessary dependencies:
   ```bash
   npm install
   ```
3. Start the server:
   ```bash
   node server.js
   ```
   *(You should see "Server running on port 5000" and "MongoDB Connected" in your terminal).*

---

## Step 2: Start the Frontend React App

The frontend provides the beautiful, responsive UI using React, Framer Motion, and Tailwind CSS.

1. Open a **new** terminal window and navigate to the frontend folder:
   ```bash
   cd frontend
   ```
2. Install the frontend dependencies:
   ```bash
   npm install
   ```
3. Start the React development server:
   ```bash
   npm start
   ```

---

## Step 3: Play the Game!

Once the React app starts, your browser should automatically open `http://localhost:3000`.

1. **Sign Up**: Create a new account to start your journey.
2. **Dashboard**: You will be redirected to your personal dashboard.
3. **Add Tasks**: Set a title, difficulty, and **due date** for your task.
4. **Complete Tasks**: Click the "Done" button before the due date to earn full XP and level up. If you are late, you will receive a 50% XP penalty!

Enjoy your new gamified productivity system!
