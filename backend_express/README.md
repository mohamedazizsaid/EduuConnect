# EduConnect Backend (Node.js/Express)

Backend REST API for EduConnect, built with Express, TypeScript, and MongoDB.

## Prerequisites
- Node.js (v18+)
- MongoDB (running locally or via Atlas)

## Installation

```bash
cd backend_express
npm install
```

## Configuration

Copy `.env.example` to `.env` (if not done):

```bash
cp .env.example .env
```

Ensure `DATABASE_URL` matches your MongoDB instance.

## Seeding Data (Important)

Before running the app, populate the database with initial data (Students, Teachers, Courses):

```bash
npm run seed
```

This ensures you have users to log in with (e.g., `student@educonnect.com` / `password123`).

## Running Locally

To start the development server:

```bash
npm run dev
```

The server will start at `http://localhost:3000`.

## API Documentation
Swagger documentation is available at `http://localhost:3000/api-docs`.