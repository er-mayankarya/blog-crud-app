# Blog Website MERN

A full-stack blogging platform built with the MERN stack, featuring a public reader experience, authenticated user accounts, and a dedicated writer dashboard for content management.

This project supports:

- Public blog discovery and reading
- User authentication, profile management, and password reset
- Blog engagement with likes, dislikes, bookmarks, and share tracking
- Moderated comments
- Writer authentication and dashboard workflows
- AI-assisted blog content generation

## Overview

The application is split into two apps:

- `frontend/` - React + Vite client for readers and writers
- `backend/` - Express + MongoDB API for authentication, blogs, comments, and writer tools

Uploaded blog images are handled through ImageKit, and AI-generated writing assistance is powered by Google Gemini.

## Core Features

### Reader Experience

- Browse published blogs on the home page
- Open individual blog pages with rich-text content
- View approved comments on blog posts
- Create an account or log in to interact with content
- Like, dislike, bookmark, and share blogs
- Submit comments for writer approval
- Access a personal profile page with account details, liked blogs, saved blogs, and comment history
- Update password from the profile page
- Reset forgotten password with email verification flow

### Writer Experience

- Register and log in as a writer
- Access a writer dashboard with blog, comment, and draft counts
- Create blogs with title, subtitle, rich-text description, category, thumbnail image, and publish or draft status
- Generate additional blog content with Gemini AI
- View all authored blogs
- Publish or unpublish blogs
- Delete blogs
- Review incoming comments
- Approve or delete comments
- View writer profile data, blogs, and related comment activity
- Update password
- Reset password using email and phone verification

## Tech Stack

### Frontend

- React 19
- Vite
- React Router
- Tailwind CSS 4
- Axios
- React Hot Toast
- Quill
- Motion
- Styled Components

### Backend

- Node.js
- Express 5
- MongoDB + Mongoose
- JSON Web Tokens
- Multer
- ImageKit
- Google Gemini via `@google/genai`

## Project Structure

```text
Blog-Website-MERN-/
|-- backend/
|   |-- configs/
|   |-- controllers/
|   |-- middleware/
|   |-- models/
|   |-- routes/
|   `-- server.js
|-- frontend/
|   |-- src/
|   |   |-- components/
|   |   |-- context/
|   |   |-- pages/
|   |   `-- assets/
|   `-- vite.config.js
`-- README.md
```

## Authentication Model

This project uses two separate auth flows:

- `user` accounts for readers who want to comment, save blogs, and react to posts
- `writer` accounts for authors who manage blogs and comments

Backend middleware enforces role-based access using JWT tokens.

## Environment Variables

Create a `.env` file inside `backend/`:

```env
PORT=3000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret

IMAGEKIT_PUBLIC_KEY=your_imagekit_public_key
IMAGEKIT_PRIVATE_KEY=your_imagekit_private_key
IMAGEKIT_URL_ENDPOINT=your_imagekit_url_endpoint

GEMINI_API_KEY=your_gemini_api_key
```

Create a `.env` file inside `frontend/`:

```env
VITE_BASE_URL=http://localhost:3000
```

## Local Development Setup

### 1. Clone the repository

```bash
git clone <your-repository-url>
cd Blog-Website-MERN-
```

### 2. Install backend dependencies

```bash
cd backend
npm install
```

### 3. Install frontend dependencies

```bash
cd ../frontend
npm install
```

### 4. Start the backend server

From `backend/`:

```bash
npm run server
```

The API runs on:

```text
http://localhost:3000
```

### 5. Start the frontend app

From `frontend/`:

```bash
npm run dev
```

Vite will start the client locally and connect to the backend using `VITE_BASE_URL`.

## Available Scripts

### Backend

- `npm run server` - Start the backend with nodemon
- `npm run dev` - Start the backend with Node.js

### Frontend

- `npm run dev` - Start the Vite development server
- `npm run build` - Create a production build
- `npm run preview` - Preview the production build locally
- `npm run lint` - Run ESLint

## API Areas

The backend is organized into three route groups:

- `/api/blog` - blog CRUD, comments, engagement, AI content generation
- `/api/user` - reader auth, profile, password management
- `/api/writer` - writer auth, dashboard, blog management, comment moderation

## Notes

- Only published blogs are shown publicly.
- User comments must be approved before they appear on blog pages.
- Blog images are uploaded to ImageKit and stored as hosted URLs.
- Blog descriptions are stored as HTML content.
- The backend appends `/blog` to `MONGODB_URI`, so the provided MongoDB connection string should point to your cluster base URI.

## Requirements

- Node.js 18+
- MongoDB Atlas or a compatible MongoDB instance
- ImageKit account
- Google Gemini API key

## Live Demo

https://blog-website-mern-x6jv.vercel.app/

## Status

This repository currently includes application code and setup scripts, but no automated test suite is configured yet.
