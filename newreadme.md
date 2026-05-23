<div align="center">

# 💼 JobBoard

### A Production-Style Three Tier Architecture Project

[![React](https://img.shields.io/badge/React-18.2.0-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-16.x-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)](https://nodejs.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15-4169E1?style=for-the-badge&logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![Prisma](https://img.shields.io/badge/Prisma-ORM-2D3748?style=for-the-badge&logo=prisma&logoColor=white)](https://www.prisma.io/)
[![Nginx](https://img.shields.io/badge/Nginx-1.24-009639?style=for-the-badge&logo=nginx&logoColor=white)](https://nginx.org/)
[![AWS](https://img.shields.io/badge/AWS-EC2-FF9900?style=for-the-badge&logo=amazonaws&logoColor=white)](https://aws.amazon.com/)
[![Vite](https://img.shields.io/badge/Vite-4.4-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![License](https://img.shields.io/badge/License-MIT-yellow?style=for-the-badge)](LICENSE)

<br/>

**JobBoard** is a full-stack web application where companies can post job listings and candidates can browse and apply — built and deployed entirely from scratch on AWS using a real-world three tier architecture.

[View Demo](#-project-screenshots) · [Fork & Deploy](#-fork--deploy-this-project) · [Report Bug](https://github.com/PrajwalP0571/jobboard/issues)

</div>

---

## 📖 Table of Contents

- [About The Project](#-about-the-project)
- [Architecture](#-architecture-overview)
- [Tech Stack](#-tech-stack)
- [Features](#-features)
- [Project Screenshots](#-project-screenshots)
- [Project Structure](#-project-structure)
- [Fork & Deploy This Project](#-fork--deploy-this-project)
- [Deployment Guide](#-deployment-guide)
- [Troubleshooting](#-troubleshooting-guide)
- [API Reference](#-api-endpoints-reference)
- [Database Schema](#-database-schema)
- [What I Learned](#-what-i-learned)
- [Author](#-author)

---

## 🎯 About The Project

### What Does This Project Do?

JobBoard is a **Job Listing and Application Portal** where:
- **Companies / Recruiters** can post job openings with full details — title, company name, location, salary range, job type, and description
- **Candidates** can browse all available jobs, filter by type, search by keyword, view full job details, and submit their application with a cover letter
- **Anyone** can view the list of applicants for any job listing in real time

### Why Did I Build This?

This project was built as part of my **DevOps learning journey** to practice and demonstrate the complete deployment of a **Three Tier Architecture** on AWS EC2. The goal was not just to write code, but to understand every layer of a production system:

- How a **database tier** is installed, configured, and secured on a Linux server
- How a **backend API tier** is built, compiled, and kept running in production using a process manager
- How a **frontend tier** is compiled from source code and served through a web server

This is the kind of setup you will encounter at any real software company. Understanding it end to end — from `sudo apt install postgresql` all the way to the app loading in a browser — is a fundamental DevOps skill.

### Challenges Faced

- **Environment Variable Management** — Understanding why `.env` files must exist before the build step, and what breaks when they don't
- **File Permission Errors** — Nginx returning `403 Forbidden` because `www-data` couldn't read files owned by `root` — fixed with `chown` and `chmod`
- **Process Management** — Understanding why running `node index.js` directly in a terminal is not production-ready and how PM2 solves this
- **Build-Time vs Run-Time Configuration** — Vite bakes environment variables into the compiled bundle at build time, meaning the API URL must be correct before `npm run build` is executed

### What Makes This Project Stand Out?

Unlike a simple tutorial project, this is deployed on **real cloud infrastructure** — an AWS EC2 `t2.medium` instance — with all three tiers running as independent services communicating over defined ports, exactly how production applications work at scale.

---

## 📐 Architecture Overview

```
                    ┌─────────────────────────────────────┐
                    │            USER BROWSER              │
                    │    Accesses app via Public IP        │
                    └──────────────┬──────────────────────┘
                                   │
                               HTTP :80
                                   │
                    ┌──────────────▼──────────────────────┐
                    │        TIER 1 — FRONTEND             │
                    │                                      │
                    │   Nginx Web Server (Port 80)         │
                    │   Serves compiled React build        │
                    │   Document Root: /var/www/html/      │
                    └──────────────┬──────────────────────┘
                                   │
                               API Calls :8080
                                   │
                    ┌──────────────▼──────────────────────┐
                    │        TIER 2 — BACKEND              │
                    │                                      │
                    │   Node.js + Express API (Port 8080)  │
                    │   Business Logic & REST Endpoints    │
                    │   Prisma ORM for DB communication    │
                    │   Process Manager: PM2               │
                    └──────────────┬──────────────────────┘
                                   │
                               SQL Queries :5432
                                   │
                    ┌──────────────▼──────────────────────┐
                    │        TIER 3 — DATABASE             │
                    │                                      │
                    │   PostgreSQL (Port 5432)             │
                    │   Stores Jobs & Applications         │
                    │   Listens on localhost only          │
                    │   (Not exposed to internet)          │
                    └─────────────────────────────────────┘
```

> **Note:** PostgreSQL listens on `127.0.0.1:5432` (localhost only) — not exposed to the public internet. Only the Node.js API on the same server can connect to it. This is correct and secure by design.

---

## 🛠️ Tech Stack

| Layer          | Technology              | Version  | Purpose                                  |
|----------------|-------------------------|----------|------------------------------------------|
| **Frontend**   | React                   | 18.2.0   | UI component library                     |
| **Build Tool** | Vite                    | 4.4.9    | Fast frontend bundler — outputs `dist/`  |
| **HTTP Client**| Axios                   | 1.6.0    | API calls from frontend to backend       |
| **Web Server** | Nginx                   | 1.24     | Serves compiled React build on port 80   |
| **Backend**    | Node.js                 | 16.x     | JavaScript runtime for the API server    |
| **Framework**  | Express                 | 4.18.2   | REST API framework for Node.js           |
| **ORM**        | Prisma                  | 4.16.2   | Type-safe database client & migrations   |
| **Database**   | PostgreSQL              | 15       | Relational database for persistent data  |
| **Process Mgr**| PM2                     | Latest   | Keeps Node.js running in production      |
| **Cloud**      | AWS EC2                 | —        | t2.medium Ubuntu 22.04 server            |

---

## ✨ Features

- 📢 **Post Job Listings** — Full form with title, company, location, salary, type, and description
- 🔍 **Search & Filter** — Real-time search by title, company, or location + filter by job type
- 📋 **Job Detail View** — Full job description, meta information, and live applicant count
- ✅ **Apply to Jobs** — Application form with name, email, and optional cover letter
- 👥 **Applications Sidebar** — View all applicants for any job listing in real time
- 🗑️ **Delete Listings** — Remove job postings when the position is filled
- 💡 **Success Confirmation** — Instant feedback after submitting an application
- 📱 **Responsive Layout** — Clean, professional UI that works across screen sizes

---

## 📸 Project Screenshots

### Nginx Default Page — Confirms Web Server is Running

> After installing Nginx, browse to `http://YOUR-PUBLIC-IP` to confirm port 80 is live before deploying the frontend.

<!-- Add your Nginx default page screenshot here -->
![Nginx Default Page](screenshots/nginx-default.png)

---

### API Health Check — Backend Successfully Running

> After starting the API with PM2, visit `http://YOUR-PUBLIC-IP:8080/api` to confirm the backend is live and connected to PostgreSQL.

<!-- Add your API health check screenshot here -->
![API Health Check](screenshots/api-health-check.png)

---

### JobBoard Application — Live on Port 80

> After deploying the React build to Nginx, the full application is accessible at `http://YOUR-PUBLIC-IP`.

<!-- Add your JobBoard app screenshot here -->
![JobBoard Application](screenshots/jobboard-app.png)

---

## 📁 Project Structure

```
jobboard/
│
├── api/                                        ← Node.js Backend (Tier 2)
│   ├── src/
│   │   └── index.js                            ← Express server + all API routes
│   ├── prisma/
│   │   ├── schema.prisma                       ← Database schema definition
│   │   └── migrations/
│   │       └── 20240101000000_init/
│   │           └── migration.sql               ← Raw SQL (view with cat command)
│   ├── package.json                            ← Dependencies + npm run build script
│   └── .env.example                            ← Template — copy to .env on server
│
├── webapp/                                     ← React Frontend (Tier 1)
│   ├── src/
│   │   ├── main.jsx                            ← React DOM entry point
│   │   ├── App.jsx                             ← Root component + page routing state
│   │   ├── api.js                              ← Axios instance (reads VITE_API_URL)
│   │   ├── components/
│   │   │   ├── JobCard.jsx                     ← Job preview card with meta info
│   │   │   ├── JobForm.jsx                     ← Post a new job listing form
│   │   │   └── ApplyForm.jsx                   ← Apply to a job form
│   │   └── pages/
│   │       ├── JobList.jsx                     ← All jobs + search bar + type filters
│   │       └── JobDetail.jsx                   ← Full job view + applications sidebar
│   ├── index.html                              ← Vite HTML entry point
│   ├── vite.config.js                          ← Vite bundler configuration
│   ├── package.json                            ← Frontend dependencies + build script
│   └── .env.example                            ← Template — copy to .env on server
│
├── .gitignore                                  ← Excludes node_modules, dist, .env
└── README.md                                   ← You are here
```

---

## 🍴 Fork & Deploy This Project

Follow these steps to get your own copy of this project running on your own AWS server.

### Step 1 — Fork the Repository

1. Go to [https://github.com/PrajwalP0571/jobboard](https://github.com/PrajwalP0571/jobboard)
2. Click the **Fork** button at the top right of the page
3. Select your GitHub account as the destination
4. You now have your own copy at `https://github.com/YOUR-USERNAME/jobboard`

### Step 2 — Clone Your Fork on the Server

After launching your AWS server and SSH-ing in, clone **your fork** (not the original):

```bash
git clone -b main https://github.com/YOUR-USERNAME/jobboard.git
```

### Step 3 — Follow the Deployment Guide Below

Everything from server setup to the live application is covered step by step in the section below.

> The two files you will create on the server — `api/.env` and `webapp/.env` — are listed in `.gitignore` and will never be pushed to GitHub. They contain your database password and must stay private.

---

## 🚀 Deployment Guide

### ☁️ Server Requirements

| Requirement  | Specification             |
|--------------|---------------------------|
| Provider     | AWS EC2 / Azure VM        |
| Instance     | **t2.medium** / B2S       |
| CPU          | 2 vCPU                    |
| RAM          | **4 GB minimum**          |
| Storage      | 8 GB minimum              |
| OS           | **Ubuntu 22.04 LTS**      |

> ⚠️ **Do not use t2.micro.** The `npm run build` step requires significant memory. A t2.micro (1GB RAM) will freeze or kill the process mid-build.

### 🔒 AWS Security Group — Inbound Rules

| Type         | Protocol | Port  | Source     | Purpose               |
|--------------|----------|-------|------------|-----------------------|
| SSH          | TCP      | 22    | 0.0.0.0/0  | Server login via SSH  |
| Custom TCP   | TCP      | 5432  | 0.0.0.0/0  | PostgreSQL database   |
| Custom TCP   | TCP      | 8080  | 0.0.0.0/0  | Node.js REST API      |
| HTTP         | TCP      | 80    | 0.0.0.0/0  | React frontend        |

---

### Step 1 — Connect to Your Server

```bash
chmod 400 your-key.pem
ssh -i your-key.pem ubuntu@YOUR-PUBLIC-IP
```

### Step 2 — Update Server & Check Baseline

```bash
sudo apt update -y

# Check what is currently listening — note your baseline before installing anything
sudo ss -ntpl
```

---

## 🗄️ Phase 1 — Database Tier (PostgreSQL · Port 5432)

### Step 3 — Install PostgreSQL

```bash
sudo apt install -y postgresql postgresql-contrib
```

### Step 4 — Verify PostgreSQL is Running

```bash
sudo ss -ntpl
# ✅ Port 5432 must appear under Local Address:Port
```

### Step 5 — Set the Database Password

```bash
sudo su - postgres     # switch to the postgres system user
psql                   # open the PostgreSQL shell
\password              # set password for the postgres superuser
# Type your password → press Enter → Confirm password → press Enter
\q                     # exit psql shell
exit                   # return to ubuntu user
```

> 💡 **Why this step?** By default, PostgreSQL uses peer authentication (only the matching Linux user can connect). Setting a password enables password-based authentication, which the Node.js API needs to connect from the application layer.

> ⚠️ **Remember this password** — you will use it in `api/.env` in the next phase.

---

## ⚙️ Phase 2 — Backend Tier (Node.js API · Port 8080)

### Step 6 — Install Node.js 16

```bash
node -v    # check if installed — likely "command not found" on a fresh server

curl -sL https://deb.nodesource.com/setup_16.x | sudo bash -
sudo apt-get install -y nodejs

node -v    # ✅ should now show v16.x.x
npm -v     # ✅ should show 8.x.x
```

> 💡 **Why Node.js 16 specifically?** This project was written for Node.js 16. Using a newer version (18/20) can cause dependency compatibility errors during `npm install` or at runtime.

### Step 7 — Clone Your Forked Repository

```bash
cd ~
git clone -b main https://github.com/YOUR-USERNAME/jobboard.git
ls
# ✅ You should see: jobboard/
```

### Step 8 — Create the API Environment File

```bash
cd ~/jobboard/api
vi .env
```

Add the following content — replace `YOUR-PASSWORD` with the password you set in Step 5:

```env
MODE=dev
PORT=8080
DATABASE_URL=postgresql://postgres:YOUR-PASSWORD@localhost:5432/postgres
```

> Save and exit vi: `Esc` → `:wq` → `Enter`

> 💡 **Why .env?** This file tells Prisma and Express how to connect to PostgreSQL — the database host, port, credentials, and name. Without it, `prisma db push` cannot reach the database and the API will crash immediately on startup with an "Environment variable not found" error.

### Step 9 — Install Backend Dependencies

```bash
npm install
# Reads package.json → downloads all libraries into node_modules/
# This may take 2-3 minutes on a fresh server
```

### Step 10 — View the Migration SQL (Learning Step)

```bash
cat prisma/migrations/20240101000000_init/migration.sql
# Shows the exact SQL that will be used to create your tables
```

### Step 11 — Generate Prisma Client & Push Schema to Database

```bash
sudo npx prisma generate && sudo npx prisma db push
```

Verify the tables were created in PostgreSQL:

```bash
sudo su - postgres
psql
\dt
# ✅ Should show: Job and Application tables
\q
exit
```

### Step 12 — Build the Backend

```bash
ls build        # ❌ No such file or directory — not built yet

npm run build   # copies src/ → build/

ls build        # ✅ Should now show: index.js
```

> 💡 **Why build?** The `npm run build` script copies your source files to a `build/` folder — the production-ready output that PM2 will run. This mirrors the same concept as compiling Java into a `.jar` or building React into `dist/`.

### Step 13 — Install PM2 and Start the API

```bash
sudo npm install -g pm2
pm2 start build/index.js
pm2 status      # ✅ should show: online
```

> 💡 **Why PM2?** If you run `node build/index.js` directly in the terminal — closing the terminal kills the process. PM2 is a production process manager that keeps Node.js running permanently, restarts it if it crashes, and survives server reboots.

### Step 14 — Verify the API is Running

```bash
sudo ss -ntpl | grep 8080
# ✅ Port 8080 must appear

curl http://localhost:8080/api
# ✅ Expected output: {"message":"success","mode":"dev"}
```

Also verify in your browser:
```
http://YOUR-PUBLIC-IP:8080/api
```

<!-- Add your API success screenshot here -->
![API Health Check](https://github.com/PrajwalP0571/jobboard/blob/main/api.png)

---

## 🌐 Phase 3 — Frontend Tier (React + Nginx · Port 80)

### Step 15 — Create the Frontend Environment File

```bash
cd ~/jobboard/webapp
vi .env
```

Add the following — replace `YOUR-PUBLIC-IP` with your actual server public IP address:

```env
VITE_API_URL=http://YOUR-PUBLIC-IP:8080/api
```

> Save and exit: `Esc` → `:wq` → `Enter`

> ⚠️ **Critical:** This `.env` must be created **before** running `npm run build`. Vite reads environment variables at **build time** and bakes the API URL directly into the compiled JavaScript bundle. If you change `.env` after building, you must run `npm run build` again.

### Step 16 — Install Frontend Dependencies and Build

```bash
npm install

ls dist         # ❌ No such file or directory — not built yet

npm run build   # Vite compiles React JSX → plain HTML/CSS/JS in dist/

ls dist         # ✅ Should now show: index.html  assets/
```

### Step 17 — Install Nginx

```bash
sudo apt install -y nginx

sudo ss -ntpl | grep 80
# ✅ Port 80 must now appear

# Browse: http://YOUR-PUBLIC-IP → Nginx default welcome page confirms port 80 is live
```

<!-- Add your Nginx default page screenshot here -->
![Nginx Default Page](nginx)

### Step 18 — Deploy Frontend to Nginx Document Root

```bash
# Remove Nginx default welcome page
sudo rm -rf /var/www/html/*

# Copy your compiled React app to Nginx's serving directory
sudo cp -r ~/jobboard/webapp/dist/* /var/www/html

# Fix permissions — Nginx runs as www-data and needs read access
sudo chown -R www-data:www-data /var/www/html
sudo chmod -R 755 /var/www/html

# Confirm files are deployed
ls /var/www/html
# ✅ Should show: index.html  assets/
```

> 💡 **Why chown and chmod?** Nginx runs as the `www-data` system user. Files copied by `sudo cp` are owned by `root`. Without fixing ownership and permissions, Nginx cannot read the files and returns `403 Forbidden`.

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

| Port   | Process      | Required |
|--------|--------------|----------|
| `22`   | sshd         | ✅       |
| `5432` | postgres     | ✅       |
| `8080` | node (PM2)   | ✅       |
| `80`   | nginx        | ✅       |

> All four must be present. If any port is missing, refer to the Troubleshooting section below.

### Step 21 — Test the Full Application

```bash
curl http://localhost:8080/api
# ✅ Expected: {"message":"success","mode":"dev"}
```

Open in browser:

```
http://YOUR-PUBLIC-IP          →  JobBoard application (React app served by Nginx)
http://YOUR-PUBLIC-IP:8080/api →  API health check (JSON response)
```

<!-- Add your final JobBoard application screenshot here -->
![JobBoard Application Live](screenshots/jobboard-app.png)

> 🎉 **If you see the JobBoard app — all three tiers are working correctly.** The database is running, the API is connected to it, the frontend is built and served through Nginx, and all layers are communicating.

> ⚠️ **Terminate your server** after completing the lab to avoid AWS charges.

---

## 🔧 Troubleshooting Guide

### 🔴 Database Not Connecting

```bash
sudo systemctl status postgresql       # check if service is running
sudo systemctl restart postgresql      # restart the service
sudo ss -ntpl | grep 5432              # verify port is listening
```

**Most common cause:** Wrong password in `DATABASE_URL` inside `api/.env`

**Fix:** Edit `api/.env`, correct the password, then restart the API:
```bash
vi ~/jobboard/api/.env
pm2 restart 0
```

---

### 🔴 API Returning Error / PM2 Status Shows "errored"

```bash
pm2 status          # check process state
pm2 logs            # ← most useful — shows the actual error message
pm2 restart 0       # restart the process after fixing the issue
```

**Most common causes:**
- `api/.env` file missing or `DATABASE_URL` is wrong
- PostgreSQL not running when API attempted to connect at startup

---

### 🔴 Frontend Shows 403 Forbidden

```bash
# Fix file ownership and permissions
sudo chown -R www-data:www-data /var/www/html
sudo chmod -R 755 /var/www/html
sudo systemctl restart nginx
```

**Cause:** Nginx (`www-data` user) cannot read files owned by `root`.

---

### 🔴 Frontend Shows Blank Page or "Cannot Reach API"

This means `VITE_API_URL` was wrong or empty when the frontend was built.

```bash
cd ~/jobboard/webapp
vi .env
# Correct: VITE_API_URL=http://YOUR-CORRECT-PUBLIC-IP:8080/api

# Rebuild and redeploy
npm run build
sudo rm -rf /var/www/html/*
sudo cp -r dist/* /var/www/html
sudo chown -R www-data:www-data /var/www/html
sudo chmod -R 755 /var/www/html
sudo systemctl restart nginx
```

---

### 🔴 Nginx Returns Error on Restart

```bash
sudo nginx -t                  # test config file for syntax errors
sudo systemctl status nginx    # view detailed error output
sudo systemctl restart nginx
```

---

## 📡 API Endpoints Reference

| Method     | Endpoint                       | Description                          | Body Required                        |
|------------|--------------------------------|--------------------------------------|--------------------------------------|
| `GET`      | `/api`                         | Health check                         | None                                 |
| `GET`      | `/api/jobs`                    | Get all job listings                 | None                                 |
| `GET`      | `/api/jobs/:id`                | Get one job + all its applicants     | None                                 |
| `POST`     | `/api/jobs`                    | Create a new job listing             | `title, company, location, salary, description` |
| `DELETE`   | `/api/jobs/:id`                | Delete a job listing                 | None                                 |
| `POST`     | `/api/jobs/:id/apply`          | Submit an application for a job      | `name, email, coverLetter (optional)` |
| `GET`      | `/api/jobs/:id/applications`   | Get all applications for a job       | None                                 |

---

## 🗄️ Database Schema

```
┌─────────────────────────────────────────┐
│                  Job                     │
├─────────────────────────────────────────┤
│ id           INT    PK  Auto-increment  │
│ title        TEXT   NOT NULL            │
│ company      TEXT   NOT NULL            │
│ location     TEXT   NOT NULL            │
│ salary       TEXT   NOT NULL            │
│ description  TEXT   NOT NULL            │
│ type         TEXT   DEFAULT 'Full-Time' │
│ createdAt    TIMESTAMP  DEFAULT NOW()   │
│ updatedAt    TIMESTAMP  AUTO-UPDATE     │
└──────────────────┬──────────────────────┘
                   │ One Job → Many Applications
                   │
┌──────────────────▼──────────────────────┐
│              Application                 │
├─────────────────────────────────────────┤
│ id           INT    PK  Auto-increment  │
│ name         TEXT   NOT NULL            │
│ email        TEXT   NOT NULL            │
│ coverLetter  TEXT   OPTIONAL            │
│ jobId        INT    FK → Job.id         │
│ createdAt    TIMESTAMP  DEFAULT NOW()   │
└─────────────────────────────────────────┘

Relationship: One Job has Many Applications (Cascade Delete)
```

---

## 📚 What I Learned

| Area | Skill Gained |
|------|-------------|
| **Infrastructure** | Deploying and configuring a multi-tier application on AWS EC2 from scratch |
| **Database** | Installing PostgreSQL, managing credentials, running schema migrations with Prisma |
| **Backend** | Building a REST API with Express, managing environment variables, understanding the build step |
| **Process Management** | Using PM2 to run Node.js in production — keeping it alive through crashes and reboots |
| **Frontend** | Building React with Vite, understanding build-time vs run-time configuration |
| **Web Server** | Configuring Nginx as a reverse proxy and static file server |
| **Linux** | File permissions (`chown`, `chmod`), service management (`systemctl`), network inspection (`ss -ntpl`) |
| **Debugging** | Diagnosing 403 errors, API connection failures, and build configuration issues on a live server |

---

## 👨‍💻 Author

**Prajwal P**

[![GitHub](https://img.shields.io/badge/GitHub-PrajwalP0571-181717?style=for-the-badge&logo=github)](https://github.com/PrajwalP0571)

> Part of my **DevOps Learning Journey** — Topic 3: Three Tier Architecture Deployment on AWS

---

## 📄 License

This project is licensed under the **MIT License** — feel free to fork, modify, and use it for your own learning.

---

<div align="center">

**⭐ If this project helped you, consider starring the repository!**

Made with 💙 while learning DevOps

</div>
