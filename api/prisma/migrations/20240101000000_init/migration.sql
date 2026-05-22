-- JobBoard Database Migration
-- Creates Job and Application tables

CREATE TABLE "Job" (
    "id"          SERIAL PRIMARY KEY,
    "title"       TEXT NOT NULL,
    "company"     TEXT NOT NULL,
    "location"    TEXT NOT NULL,
    "salary"      TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "type"        TEXT NOT NULL DEFAULT 'Full-Time',
    "createdAt"   TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt"   TIMESTAMP(3) NOT NULL
);

CREATE TABLE "Application" (
    "id"          SERIAL PRIMARY KEY,
    "name"        TEXT NOT NULL,
    "email"       TEXT NOT NULL,
    "coverLetter" TEXT,
    "jobId"       INTEGER NOT NULL,
    "createdAt"   TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

ALTER TABLE "Application"
    ADD CONSTRAINT "Application_jobId_fkey"
    FOREIGN KEY ("jobId")
    REFERENCES "Job"("id")
    ON DELETE CASCADE
    ON UPDATE CASCADE;
