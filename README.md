# 📝 Blog CRUD App

A full-stack **Blog CRUD Application** with containerized architecture using **FastAPI**, **React (Vite)**, **PostgreSQL (master-slave replication)**, and **Podman**.

---

## 📦 Tech Stack

* **Frontend:** React (Vite) + Tailwind CSS
* **Backend:** FastAPI (with raw SQL, no ORM)
* **Database:** PostgreSQL (Master-Slave Replication)
* **Containerization:** Podman (pods + custom networks)

---

## 🎯 Features

* ✅ Add, view, edit, and delete blog posts
* ✅ Posts include: `id`, `title`, `content`
* ✅ Clean UI with TailwindCSS
* ✅ Master-slave DB replication for read/write separation
* ✅ Frontend & backend run in same Podman pod

---

## 📁 Project Structure

```
blog-crud-app/
├── backend/         # FastAPI backend
│   ├── app/main.py
│   ├── app/db.py
│   ├── Dockerfile
│   └── .env
│
├── frontend/        # React frontend (Vite + Tailwind)
│   ├── src/App.jsx
│   ├── Dockerfile
│   └── index.html
│
├── postgres/        # Custom PG replication setup (optional)
│   └── init scripts / Dockerfiles
```

---

## 🚀 Getting Started

### 1. Create Podman Network

```bash
podman network create pg-network
```

### 2. Create Podman Pod

```bash
podman pod create --name blog-pod --network pg-network -p 3000:80 -p 8000:8000
```

### 3. Build Backend Image

```bash
cd backend
podman build -t blog-backend .
```

### 4. Build Frontend Image

```bash
cd ../frontend
podman build -t blog-frontend .
```

### 5. Run Backend in Pod

```bash
podman run -d \
  --name blog-backend \
  --pod blog-pod \
  --env-file .env \
  blog-backend
```

### 6. Run Frontend in Pod

```bash
podman run -d \
  --name blog-frontend \
  --pod blog-pod \
  blog-frontend
```

---

## 🌐 Access

* **Frontend UI:** [http://localhost:3000](http://localhost:3000)
* **Backend API:** [http://localhost:8000](http://localhost:8000)

---

## 🔗 API Endpoints (FastAPI)

| Method | Endpoint             | Description       |
| ------ | -------------------- | ----------------- |
| GET    | `/read-posts`        | Get all posts     |
| GET    | `/read-posts/{id}`   | Get posts by ID   |
| POST   | `/create-posts`      | Create new post   |
| PUT    | `/update-posts/{id}` | Update post by ID |
| DELETE | `/delete-posts/{id}` | Delete post by ID |

---

## 📄 Environment Variables (backend/.env)

```env
DB_HOST_MASTER=pg-master pod IP
DB_PORT_MASTER=5432
DB_USER_MASTER=postgres
DB_PASSWORD_MASTER=your_password

DB_HOST_SLAVE=pg-slave pod IP
DB_PORT_SLAVE=5432
DB_USER_SLAVE=postgres
DB_PASSWORD_SLAVE=your_password
```

> These are passed using `--env-file` to backend container.

---

## 🧪 Development Scripts

```bash
# Frontend dev (Vite)
cd frontend
npm install
npm run dev

# Backend dev
cd backend
uvicorn main:app --reload --port 8000
```

---

## 🎨 UI Highlights

* Navbar with "Create Post" button
* Modal-like overlay form for adding posts
* Posts displayed in responsive cards (3 per row)
* Colored feedback messages:

  * 🟥 Delete = Red
  * 🟨 Update = Yellow
  * 🟩 Success = Green

---

## 🪪 License

MIT License. Free to use for personal and commercial projects.

---

## 👨‍💻 Author

**Mayank Arya**
