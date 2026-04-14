# Welcome to your  project

TODO:
# Task Management Frontend

A React-based frontend for the Task Management System. It connects with a Laravel API backend to manage tasks, users, and workflow efficiently.

---

## API Configuration
src/lib/api.ts

By default, the project uses a local API:

```js
const api = axios.create({
  baseURL: 'http://localhost:8000/api/',
  headers: { 'Content-Type': 'application/json' },
});
```

### Use Live Server API

If you want to connect to live server, update the baseURL:

```js
baseURL: 'https://task.ipsitacomputersltd.com/backend/public/api/'
```

---

## Getting Started

### Clone the Repository
```bash
git clone https://github.com/csesiddiqul/task-management-frontend
cd task-management-frontend
```

### Install Dependencies
```bash
npm install
```

### Run the Project
```bash
npm run dev
```

---

## API Connection Setup

### Option 1: Use Local API (Recommended for Development)

Make sure your Laravel backend is running:

```bash
php artisan serve
```

Then keep:

```js
baseURL: 'http://localhost:8000/api/'
```

---

### Option 2: Use Live API Server

If you don't want to run backend locally, use live API:

```js
baseURL: 'https://task.ipsitacomputersltd.com/backend/public/api/'
```

---

## Notes

- Ensure backend server is running before using local API  
- Update API URL based on your environment  
- If facing CORS issues, configure backend properly  
