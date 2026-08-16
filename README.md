# CloudGallery - Full-Stack React & Supabase App

CloudGallery is a production-ready, full-stack photo gallery application. It allows users to upload high-quality images directly into a private **Supabase Storage** bucket via a secure Node.js backend. The frontend is built with React, Vite, and Tailwind CSS.

## Architecture

- **Frontend:** React (Vite), Tailwind CSS, Framer Motion, Axios, React Router.
- **Backend:** Node.js, Express, Multer (Memory Storage), Supabase JS SDK.
- **Storage:** Supabase Storage (Public CDN).

---

## 🚀 1. Supabase Setup (Required for Storage)

You must configure a Supabase project to allow the backend to use Supabase as a storage layer. 

1. **Create a Project:** Go to [Supabase](https://supabase.com/) and create a new project.
2. **Create a Storage Bucket:**
   - In the left sidebar, click on **Storage**.
   - Click **New Bucket**.
   - Name your bucket (e.g., `photos`). 
   - **Important:** Check the box that says **"Public bucket"** (This allows the frontend to load images via public URLs instantly).
   - Click Save.
3. **Get API Credentials:**
   - In the left sidebar, click on **Project Settings** (the gear icon).
   - Click on **API**.
   - Copy the **Project URL**.
   - Scroll down to **Project API keys** and copy the **`service_role`** secret key. (Do not use the `anon` key, as the backend needs admin permissions to upload/delete files securely).

> **Note:** The backend uses these credentials to manage the bucket. The React frontend will simply receive public URLs from the backend to display the images instantly via Supabase's global CDN.

---

## 💻 2. Local Development

### Prerequisites
- Node.js (v18+)
- npm or yarn

### Backend Setup
1. Open terminal and `cd backend`
2. Run `npm install`
3. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```
4. Fill in the `.env` variables with your Supabase credentials, bucket name, and a secure `ADMIN_PASSWORD`.
5. Start the server:
   ```bash
   npm run dev
   ```
   (Server will run on `http://localhost:5000`)

### Frontend Setup
1. Open a new terminal and `cd frontend`
2. Run `npm install`
3. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```
4. Ensure `VITE_API_URL` is set to `http://localhost:5000` (or whatever port your backend runs on).
5. Start the app:
   ```bash
   npm run dev
   ```
   (Frontend will run on `http://localhost:5173`)

---

## 🌍 3. Deployment Guide

### Backend Deployment (Render)
1. Push your repository to GitHub.
2. Log into [Render.com](https://render.com/).
3. Click "New > Web Service".
4. Connect your GitHub repository.
5. Setup the service:
   - Root Directory: `backend`
   - Environment: `Node`
   - Build Command: `npm install`
   - Start Command: `node server.js`
6. Click **Advanced** and add the following Environment Variables (from your local `.env`):
   - `SUPABASE_URL`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `SUPABASE_BUCKET_NAME`
   - `ADMIN_PASSWORD`
   - `FRONTEND_URL` (Set this to your Vercel URL later to properly configure CORS)
7. Click "Create Web Service". Render will give you a backend URL (e.g., `https://cloudgallery-api.onrender.com`).

### Frontend Deployment (Vercel)
1. Log into [Vercel](https://vercel.com/).
2. Click "Add New > Project".
3. Import your GitHub repository.
4. Setup the project:
   - Framework Preset: `Vite`
   - Root Directory: `frontend`
5. Click **Environment Variables** and add:
   - `VITE_API_URL` = `https://cloudgallery-api.onrender.com` (Your Render backend URL).
6. Click "Deploy".
7. Once deployed, copy your Vercel domain (e.g., `https://cloudgallery.vercel.app`) and add it to your Render backend's `FRONTEND_URL` environment variable for CORS.

---

## 🔒 4. Environment Variables Reference

### Backend (`backend/.env`)
- `PORT`: (Optional) Port to run the backend on. Default 5000.
- `SUPABASE_URL`: Your Supabase Project URL.
- `SUPABASE_SERVICE_ROLE_KEY`: Your Supabase secret key (starts with `ey...`).
- `SUPABASE_BUCKET_NAME`: The name of the public bucket you created (e.g., `photos`).
- `ADMIN_PASSWORD`: Master password to access the Admin dashboard to delete photos.
- `FRONTEND_URL`: URL of your frontend (e.g., `http://localhost:5173` or `https://cloudgallery.vercel.app`) to restrict CORS.

### Frontend (`frontend/.env`)
- `VITE_API_URL`: The URL of your backend API.
