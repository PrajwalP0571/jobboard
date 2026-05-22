// JobBoard API — Express + Prisma + PostgreSQL
// Mirrors LMS API structure exactly

require("dotenv").config();

const express = require("express");
const cors = require("cors");
const { PrismaClient } = require("@prisma/client");

const app = express();
const prisma = new PrismaClient();

const PORT = process.env.PORT || 8080;
const MODE = process.env.MODE || "dev";

app.use(cors());
app.use(express.json());

// ─────────────────────────────────────────────────
// HEALTH CHECK — same as LMS: {"message":"success","mode":"dev"}
// ─────────────────────────────────────────────────
app.get("/api", (req, res) => {
  res.json({ message: "success", mode: MODE });
});

// ─────────────────────────────────────────────────
// JOBS — GET ALL
// ─────────────────────────────────────────────────
app.get("/api/jobs", async (req, res) => {
  try {
    const jobs = await prisma.job.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        _count: { select: { applications: true } },
      },
    });
    res.json(jobs);
  } catch (error) {
    console.error("GET /api/jobs error:", error);
    res.status(500).json({ error: "Failed to fetch jobs" });
  }
});

// ─────────────────────────────────────────────────
// JOBS — GET ONE
// ─────────────────────────────────────────────────
app.get("/api/jobs/:id", async (req, res) => {
  try {
    const job = await prisma.job.findUnique({
      where: { id: Number(req.params.id) },
      include: { applications: true },
    });
    if (!job) {
      return res.status(404).json({ error: "Job not found" });
    }
    res.json(job);
  } catch (error) {
    console.error("GET /api/jobs/:id error:", error);
    res.status(500).json({ error: "Failed to fetch job" });
  }
});

// ─────────────────────────────────────────────────
// JOBS — CREATE
// ─────────────────────────────────────────────────
app.post("/api/jobs", async (req, res) => {
  try {
    const { title, company, location, salary, description, type } = req.body;

    if (!title || !company || !location || !salary || !description) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const job = await prisma.job.create({
      data: {
        title,
        company,
        location,
        salary,
        description,
        type: type || "Full-Time",
      },
    });

    res.status(201).json(job);
  } catch (error) {
    console.error("POST /api/jobs error:", error);
    res.status(500).json({ error: "Failed to create job" });
  }
});

// ─────────────────────────────────────────────────
// JOBS — DELETE
// ─────────────────────────────────────────────────
app.delete("/api/jobs/:id", async (req, res) => {
  try {
    await prisma.job.delete({
      where: { id: Number(req.params.id) },
    });
    res.json({ message: "Job deleted successfully" });
  } catch (error) {
    console.error("DELETE /api/jobs/:id error:", error);
    res.status(500).json({ error: "Failed to delete job" });
  }
});

// ─────────────────────────────────────────────────
// APPLICATIONS — CREATE (Apply to a job)
// ─────────────────────────────────────────────────
app.post("/api/jobs/:id/apply", async (req, res) => {
  try {
    const { name, email, coverLetter } = req.body;

    if (!name || !email) {
      return res.status(400).json({ error: "Name and email are required" });
    }

    // Verify the job exists first
    const job = await prisma.job.findUnique({
      where: { id: Number(req.params.id) },
    });
    if (!job) {
      return res.status(404).json({ error: "Job not found" });
    }

    const application = await prisma.application.create({
      data: {
        name,
        email,
        coverLetter: coverLetter || "",
        jobId: Number(req.params.id),
      },
    });

    res.status(201).json(application);
  } catch (error) {
    console.error("POST /api/jobs/:id/apply error:", error);
    res.status(500).json({ error: "Failed to submit application" });
  }
});

// ─────────────────────────────────────────────────
// APPLICATIONS — GET ALL for a job
// ─────────────────────────────────────────────────
app.get("/api/jobs/:id/applications", async (req, res) => {
  try {
    const applications = await prisma.application.findMany({
      where: { jobId: Number(req.params.id) },
      orderBy: { createdAt: "desc" },
    });
    res.json(applications);
  } catch (error) {
    console.error("GET /api/jobs/:id/applications error:", error);
    res.status(500).json({ error: "Failed to fetch applications" });
  }
});

// ─────────────────────────────────────────────────
// START SERVER
// ─────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`JobBoard API running on port ${PORT} | mode: ${MODE}`);
});
