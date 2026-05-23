# 💼 JobBoard — Three Tier Architecture Project

> A full-stack Job Listing & Application Portal built with **React + Node.js + PostgreSQL**, deployed on AWS using a **Three Tier Architecture** pattern.

---

## 📸 Project Screenshots

### 1. Nginx Default Page — Web Server Running
<!-- Add screenshot here -->

![Nginx Web Server](screenshots/nginx-default.png)

---

### 2. API Health Check — Backend Running on Port 8080
<!-- Add screenshot here -->

![API Health Check](screenshots/api-health-check.png)

---

### 3. JobBoard Application — Live on Port 80
<!-- Add screenshot here -->

![JobBoard Application](screenshots/jobboard-app.png)

---

## 📐 Architecture Overview

```
                  ┌──────────────────────────────────┐
                  │          USER BROWSER             │
                  └─────────────┬────────────────────┘
                                │
                            Port 80
                                │
                  ┌─────────────▼────────────────────┐
                  │      TIER 1 — FRONTEND            │
                  │    Nginx serving React Build      │
                  │         /var/www/html/            │
                  └─────────────┬────────────────────┘
                                │
                            Port 8080
                                │
                  ┌─────────────▼────────────────────┐
                  │      TIER 2 — BACKEND / API       │
                  │    Node.js + Express + Prisma     │
                  │        Managed by PM2             │
                  └─────────────┬────────────────────┘
                                │
                            Port 5432
                                │
                  ┌─────────────▼────────────────────┐
                  │      TIER 3 — DATABASE            │
                  │          PostgreSQL               │
                  │   Stores Jobs & Applications      │
                  └──────────────────────────────────┘
```

---

## 🛠️ Application Stack

| Layer      | Technology        | Port |
|------------|-------------------|------|
| Frontend   | React + Vite      | 80   |
| Web Server | Nginx             | 80   |
| Backend    | Node.js + Express | 8080 |
| ORM        | Prisma            | —    |
| Database   | PostgreSQL        | 5432 |
| Process    | PM2               | —    |

---

## ✨ Features

- 📢 **Post Jobs** — Add listings with title, company, location, salary, type, and description
- 🔍 **Browse & Search** — Filter by title, company, location, or job type
- 📋 **View Job Details** — Full description with applicant count
- ✅ **Apply to Jobs** — Submit applications with name, email, and cover letter
- 👥 **View Applications** — See all applicants in a sidebar panel
- 🗑️ **Delete Listings** — Remove job postings when filled

---

## 📁 Project Structure

```
jobboard/
├── api/                                     ← Node.js Backend
│   ├── src/
│   │   └── index.js                         ← Express server & all API routes
│   ├── prisma/
│   │   ├── schema.prisma                    ← Database schema (Job + Application)
│   │   └── migrations/
│   │       └── 20240101000000_init/
│   │           └── migration.sql            ← Raw SQL migration file
│   ├── package.json                         ← Backend dependencies & scripts
│   └── .env.example                         ← Environment variable template
│
├── webapp/                                  ← React Frontend
│   ├── src/
│   │   ├── main.jsx                         ← React entry point
│   │   ├── App.jsx                          ← Root component & page routing
│   │   ├── api.js                           ← Axios config (reads VITE_API_URL)
│   │   ├── components/
│   │   │   ├── JobCard.jsx                  ← Job preview card component
│   │   │   ├── JobForm.jsx                  ← Post new job form
│   │   │   └── ApplyForm.jsx                ← Apply to job form
│   │   └── pages/
│   │       ├── JobList.jsx                  ← All jobs listing with search
│   │       └── JobDetail.jsx                ← Job detail + applications sidebar
│   ├── index.html                           ← HTML entry point for Vite
│   ├── vite.config.js                       ← Vite build configuration
│   ├── package.json                         ← Frontend dependencies & scripts
│   └── .env.example                         ← Environment variable template
│
├── .gitignore
└── README.md
```

---

## ☁️ Server Requirements

| Requirement | Specification          |
|-------------|------------------------|
| Cloud       | AWS EC2 / Azure VM     |
| Instance    | t2.medium / B2S        |
| CPU         | 2 vCPU                 |
| RAM         | 4 GB minimum           |
| Storage     | 8 GB minimum           |
| OS          | Ubuntu 22.04 LTS       |

### AWS Security Group — Inbound Rules

| Type       | Protocol | Port | Source    | Purpose         |
|------------|----------|------|-----------|-----------------|
| SSH        | TCP      | 22   | 0.0.0.0/0 | Server Login    |
| Custom TCP | TCP      | 5432 | 0.0.0.0/0 | PostgreSQL DB   |
| Custom TCP | TCP      | 8080 | 0.0.0.0/0 | Node.js API     |
| HTTP       | TCP      | 80   | 0.0.0.0/0 | React Frontend  |

---

## 🚀 Deployment Guide

### Prerequisites

- AWS/Azure account with a running **t2.medium Ubuntu 22.04** instance
- Security Group configured with ports **22, 80, 5432, 8080**
- SSH access to the server

---

### Step 1 — Connect to Your Server

```bash
chmod 400 your-key.pem
ssh -i your-key.pem ubuntu@YOUR-PUBLIC-IP
```

---

### Step 2 — Update Server & Check Baseline

```bash
sudo apt update -y

# Check what is currently running — note the baseline
sudo ss -ntpl
```

---

## 🗄️ Phase 1 — Database Tier (PostgreSQL — Port 5432)

### Step 3 — Install PostgreSQL

```bash
sudo apt install -y postgresql postgresql-contrib
```

### Step 4 — Verify PostgreSQL is Running

```bash
sudo ss -ntpl
# Port 5432 must appear in the output
```

### Step 5 — Set the Database Password

```bash
sudo su - postgres
psql
\password
# Type your password and confirm it
\q
exit
```

> ⚠️ **Remember this password** — you will use it in `api/.env` in the next phase.

---

## ⚙️ Phase 2 — Backend Tier (Node.js API — Port 8080)

### Step 6 — Install Node.js 16

```bash
node -v    # check if installed (likely not on a fresh server)

curl -sL https://deb.nodesource.com/setup_16.x | sudo bash -
sudo apt-get install -y nodejs

node -v    # should show v16.x.x
npm -v
```

### Step 7 — Clone the Repository

```bash
cd ~
git clone -b main https://github.com/PrajwalP0571/jobboard.git
ls
# You should see: jobboard/
```

### Step 8 — Create the API Environment File

```bash
cd ~/jobboard/api
vi .env
```

Paste the following — replace `YOUR-PASSWORD` with the password from Step 5:

```env
MODE=dev
PORT=8080
DATABASE_URL=postgresql://postgres:YOUR-PASSWORD@localhost:5432/postgres
```

> Save and exit vi: press `Esc` → type `:wq` → press `Enter`

> ⚠️ **Why .env?** This file tells the backend how to connect to PostgreSQL.
> Without it, `prisma db push` will fail and the API will crash on startup.
> Never commit this file to GitHub — it contains your database password.

### Step 9 — Install Backend Dependencies

```bash
npm install
# Reads package.json and downloads all libraries into node_modules/
```

### Step 10 — View the SQL Migration File (Learning Step)

```bash
cat prisma/migrations/20240101000000_init/migration.sql
# Shows the SQL that creates your Job and Application tables
```

### Step 11 — Apply Database Schema

```bash
sudo npx prisma generate && sudo npx prisma db push
```

Verify the tables were created:

```bash
sudo su - postgres
psql
\dt
# Should show: Job and Application tables
\q
exit
```

### Step 12 — Build the Backend

```bash
ls build        # No such file or directory — not built yet
npm run build
ls build        # Should now show: index.js
```

### Step 13 — Start the API with PM2

PM2 is a process manager that keeps Node.js running after terminal closes or server restarts.

```bash
sudo npm install -g pm2
pm2 start build/index.js
pm2 status      # should show: online
```

### Step 14 — Verify the API is Running

```bash
sudo ss -ntpl
# Port 8080 must appear

curl http://localhost:8080/api
# Expected: {"message":"success","mode":"dev"}
```

Also verify in your browser:

```
http://YOUR-PUBLIC-IP:8080/api
```

---

## 🌐 Phase 3 — Frontend Tier (React + Nginx — Port 80)

### Step 15 — Create the Frontend Environment File

```bash
cd ~/jobboard/webapp
vi .env
```

Paste the following — replace `YOUR-PUBLIC-IP` with your actual server public IP:

```env
VITE_API_URL=http://YOUR-PUBLIC-IP:8080/api
```

> ⚠️ **Critical:** Set this **before** running `npm run build`.
> Vite bakes the API URL into the compiled files at build time.
> If you change `.env` after building, you must run `npm run build` again.

### Step 16 — Install Dependencies and Build

```bash
npm install

ls dist         # No such file or directory — not built yet
npm run build
ls dist         # Should now show: index.html  assets/
```

### Step 17 — Install Nginx

```bash
sudo apt install -y nginx

sudo ss -ntpl
# Port 80 must now appear

# Browse: http://YOUR-PUBLIC-IP → Nginx default welcome page
```

### Step 18 — Deploy Frontend to Nginx

```bash
# Remove Nginx default page
sudo rm -rf /var/www/html/*

# Copy your React build to Nginx document root
sudo cp -r ~/jobboard/webapp/dist/* /var/www/html

# Fix file permissions so Nginx can read the files
sudo chown -R www-data:www-data /var/www/html
sudo chmod -R 755 /var/www/html

# Verify files are in place
ls /var/www/html
# Should show: index.html  assets/
```

### Step 19 — Restart Nginx

```bash
sudo systemctl restart nginx
```

---

## ✅ Phase 4 — Final Verification

### Step 20 — Verify All Four Ports are Listening

```bash
sudo ss -ntpl
```

All four ports must be present:

| Port | Process    | Status    |
|------|------------|-----------|
| 22   | sshd       | ✅ LISTEN |
| 5432 | postgres   | ✅ LISTEN |
| 8080 | node (PM2) | ✅ LISTEN |
| 80   | nginx      | ✅ LISTEN |

### Step 21 — Test the Full Application

```bash
# Test API health check from terminal
curl http://localhost:8080/api
# Expected: {"message":"success","mode":"dev"}
```

Open in browser:

```
http://YOUR-PUBLIC-IP          →  JobBoard application (React)
http://YOUR-PUBLIC-IP:8080/api →  API health check (JSON)
```

---

## 🔧 Troubleshooting Guide

### Database Not Connecting

```bash
sudo systemctl status postgresql
sudo systemctl restart postgresql
sudo ss -ntpl | grep 5432
```

**Most common cause:** Wrong password in `DATABASE_URL` inside `api/.env`

---

### API / Backend Issues

```bash
pm2 status          # check if process is online or errored
pm2 logs            # see live error messages — most useful
pm2 restart 0       # restart the process
sudo ss -ntpl | grep 8080
```

**Most common causes:**
- `.env` file missing or wrong `DATABASE_URL`
- PostgreSQL not running when API tried to connect

---

### Frontend Shows 403 Forbidden

```bash
# Fix file permissions
sudo chown -R www-data:www-data /var/www/html
sudo chmod -R 755 /var/www/html
sudo systemctl restart nginx
```

**Cause:** Nginx runs as `www-data` user but files are owned by `root` with restricted permissions.

---

### Frontend Shows Blank Page or Cannot Reach API

```bash
# Rebuild the frontend with correct IP
cd ~/jobboard/webapp
vi .env
# Fix: VITE_API_URL=http://CORRECT-IP:8080/api

npm run build
sudo rm -rf /var/www/html/*
sudo cp -r dist/* /var/www/html
sudo chown -R www-data:www-data /var/www/html
sudo chmod -R 755 /var/www/html
sudo systemctl restart nginx
```

**Cause:** `VITE_API_URL` was wrong or empty when the frontend was built.

---

### Nginx Config Error

```bash
sudo nginx -t               # test config for syntax errors
sudo systemctl status nginx # check service status
sudo systemctl restart nginx
```

---

## 📡 API Endpoints Reference

| Method | Endpoint                     | Description                       |
|--------|------------------------------|-----------------------------------|
| GET    | `/api`                       | Health check                      |
| GET    | `/api/jobs`                  | Get all job listings              |
| GET    | `/api/jobs/:id`              | Get one job with its applicants   |
| POST   | `/api/jobs`                  | Create a new job listing          |
| DELETE | `/api/jobs/:id`              | Delete a job listing              |
| POST   | `/api/jobs/:id/apply`        | Submit an application for a job   |
| GET    | `/api/jobs/:id/applications` | Get all applications for a job    |

---

## 🗄️ Database Schema

```
Job
├── id           INT  — Auto Primary Key
├── title        TEXT — Job title
├── company      TEXT — Company name
├── location     TEXT — City or Remote
├── salary       TEXT — Salary range
├── description  TEXT — Full job description
├── type         TEXT — Full-Time / Part-Time / Remote / Contract / Internship
├── createdAt    TIMESTAMP
├── updatedAt    TIMESTAMP
└── applications → [Application]  (One Job → Many Applications)

Application
├── id           INT  — Auto Primary Key
├── name         TEXT — Applicant full name
├── email        TEXT — Applicant email address
├── coverLetter  TEXT — Optional cover letter
├── jobId        INT  — Foreign Key → Job.id (Cascade Delete)
└── createdAt    TIMESTAMP
```

---

## ⚠️ Important Notes

- **Never commit `.env` files to GitHub** — they contain database passwords
- **Always terminate your server** after the lab to avoid AWS/Azure charges
- **Rebuild frontend** every time you change `webapp/.env`
- **Use `pm2 logs`** as your first debugging step for any backend issue
- **Port 5432 listens on 127.0.0.1** — this is correct and secure (DB not exposed to internet)

---

## 👨‍💻 Author

**PRAJWAL PAWAR
- GitHub: [@PrajwalP0571](https://github.com/PrajwalP0571)
- Project: DevOps Learning Journey — Topic 3: Three Tier Architecture

---

## 📚 What I Learned

- Deploying a production-style three tier architecture on AWS EC2
- Installing and configuring PostgreSQL on Ubuntu
- Running a Node.js API in production using PM2 process manager
- Building React applications with Vite and serving them via Nginx
- Using Prisma ORM to define and migrate database schemas
- Managing environment variables securely across all three tiers
- Diagnosing and fixing real-world issues — permission errors, port conflicts, build mismatches
