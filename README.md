# JobBoard — Job Listing & Application Portal

A full-stack three-tier web application for posting and applying to jobs.

## Application Stack
- **Database** : PostgreSQL (Port 5432)
- **Backend**  : Node.js + Express + Prisma (Port 8080)
- **Frontend** : React + Vite + Nginx (Port 80)

## Architecture
```
[Browser] → Port 80 → [Nginx → React Build]
                              ↓
                         Port 8080
                              ↓
                     [Node.js Express API]
                              ↓
                         Port 5432
                              ↓
                       [PostgreSQL DB]
```

## Security Group Rules (AWS)
| Protocol | Port | Purpose         |
|----------|------|-----------------|
| SSH      | 22   | Server Login    |
| TCP      | 5432 | PostgreSQL DB   |
| TCP      | 8080 | Node.js API     |
| HTTP     | 80   | React Frontend  |

## Server Requirement
- AWS t2.medium (2 CPU, 4GB RAM) or Azure B2S
- Ubuntu 22.04
- Storage: 8GB minimum

## Features
- Post job listings (title, company, location, salary, description)
- View all available jobs
- Apply to jobs with name and email
- View all applications for a job
- Delete job listings

## Project Structure
```
jobboard/
├── api/                          ← Node.js Backend
│   ├── src/
│   │   └── index.js              ← Express server entry point
│   ├── prisma/
│   │   ├── schema.prisma         ← Database schema
│   │   └── migrations/
│   │       └── 20240101000000_init/
│   │           └── migration.sql ← SQL migration file
│   ├── package.json              ← Backend metadata & scripts
│   └── .env.example              ← Copy to .env and fill values
│
├── webapp/                       ← React Frontend
│   ├── src/
│   │   ├── main.jsx              ← React entry point
│   │   ├── App.jsx               ← Root component
│   │   ├── api.js                ← Axios API config
│   │   ├── components/
│   │   │   ├── JobCard.jsx       ← Single job display card
│   │   │   ├── JobForm.jsx       ← Post new job form
│   │   │   └── ApplyForm.jsx     ← Apply to job form
│   │   └── pages/
│   │       ├── JobList.jsx       ← All jobs listing page
│   │       └── JobDetail.jsx     ← Single job detail page
│   ├── index.html                ← HTML entry point
│   ├── vite.config.js            ← Vite configuration
│   ├── package.json              ← Frontend metadata & scripts
│   └── .env.example              ← Copy to .env and fill values
│
├── .gitignore
└── README.md
```

## Deployment Steps (Summary)
See detailed deployment guide below in this README.

### Phase 1 — Database
```bash
sudo apt update -y
sudo apt install -y postgresql postgresql-contrib
sudo su - postgres
psql
\password        # set password
\q
exit
sudo ss -ntpl    # verify port 5432
```

### Phase 2 — Backend
```bash
curl -sL https://deb.nodesource.com/setup_16.x | sudo bash -
sudo apt-get install -y nodejs
git clone -b main https://github.com/YOUR-USERNAME/jobboard.git
cd ~/jobboard/api
vi .env          # fill in your values (see .env.example)
npm install
sudo npx prisma generate && sudo npx prisma db push
npm run build
sudo npm install -g pm2
pm2 start build/index.js
sudo ss -ntpl    # verify port 8080
curl http://localhost:8080/api
```

### Phase 3 — Frontend
```bash
cd ~/jobboard/webapp
vi .env          # set VITE_API_URL=http://YOUR-PUBLIC-IP:8080/api
npm install
npm run build
sudo apt install -y nginx
sudo rm -rf /var/www/html/*
sudo cp -r ~/jobboard/webapp/dist/* /var/www/html
sudo ss -ntpl    # verify port 80
# Browse: http://YOUR-PUBLIC-IP
```

## Troubleshoot
```bash
# Database
sudo systemctl status postgresql
sudo systemctl restart postgresql

# API
pm2 status
pm2 logs
pm2 restart 0

# Frontend
sudo systemctl status nginx
sudo systemctl restart nginx
sudo nginx -t
```
