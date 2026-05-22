import React, { useEffect, useState } from "react";
import api from "../api.js";
import ApplyForm from "../components/ApplyForm.jsx";

export default function JobDetail({ jobId, onBack }) {
  const [job,     setJob]     = useState(null);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState("");
  const [applied, setApplied] = useState(false);

  const fetchJob = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await api.get(`/jobs/${jobId}`);
      setJob(res.data);
    } catch {
      setError("Could not load job details.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJob();
  }, [jobId]);

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this job listing?")) return;
    try {
      await api.delete(`/jobs/${jobId}`);
      onBack();
    } catch {
      alert("Failed to delete job.");
    }
  };

  const postedDate = job
    ? new Date(job.createdAt).toLocaleDateString("en-US", {
        weekday: "long", year: "numeric", month: "long", day: "numeric",
      })
    : "";

  if (loading) return <p style={{ textAlign: "center", padding: "60px", color: "#888" }}>Loading job details...</p>;
  if (error)   return <p style={{ textAlign: "center", padding: "60px", color: "#e74c3c" }}>⚠️ {error}</p>;
  if (!job)    return null;

  return (
    <div>
      <button style={styles.backBtn} onClick={onBack}>← Back to All Jobs</button>

      <div style={styles.layout}>
        {/* ── LEFT: Job Details ── */}
        <div style={styles.main}>
          {/* Job Header */}
          <div style={styles.headerCard}>
            <div style={styles.companyIcon}>
              {job.company.charAt(0).toUpperCase()}
            </div>
            <div style={styles.headerInfo}>
              <h1 style={styles.title}>{job.title}</h1>
              <p style={styles.company}>{job.company}</p>
            </div>
          </div>

          {/* Meta Pills */}
          <div style={styles.pills}>
            <span style={styles.pill}>📍 {job.location}</span>
            <span style={styles.pill}>💰 {job.salary}</span>
            <span style={styles.pill}>🕐 {job.type}</span>
            <span style={styles.pill}>📅 Posted {postedDate}</span>
            <span style={styles.pill}>👥 {job.applications?.length || 0} applicants</span>
          </div>

          {/* Description */}
          <div style={styles.section}>
            <h2 style={styles.sectionTitle}>Job Description</h2>
            <p style={styles.description}>{job.description}</p>
          </div>

          {/* Apply Form */}
          {!applied && (
            <ApplyForm
              jobId={job.id}
              jobTitle={job.title}
              onApplied={() => { setApplied(true); fetchJob(); }}
            />
          )}

          {/* Delete Button */}
          <div style={{ marginTop: "24px", textAlign: "right" }}>
            <button style={styles.deleteBtn} onClick={handleDelete}>
              🗑 Remove Listing
            </button>
          </div>
        </div>

        {/* ── RIGHT: Applications Sidebar ── */}
        <div style={styles.sidebar}>
          <h3 style={styles.sidebarTitle}>
            Applications ({job.applications?.length || 0})
          </h3>

          {job.applications?.length === 0 && (
            <p style={styles.noApps}>No applications yet. Be the first!</p>
          )}

          {job.applications?.map((app) => (
            <div key={app.id} style={styles.appCard}>
              <div style={styles.appAvatar}>
                {app.name.charAt(0).toUpperCase()}
              </div>
              <div>
                <p style={styles.appName}>{app.name}</p>
                <p style={styles.appEmail}>{app.email}</p>
                {app.coverLetter && (
                  <p style={styles.appCover}>
                    {app.coverLetter.length > 80
                      ? app.coverLetter.substring(0, 80) + "..."
                      : app.coverLetter}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

const styles = {
  backBtn: {
    background: "none",
    border: "none",
    color: "#0077b6",
    fontSize: "14px",
    fontWeight: "600",
    cursor: "pointer",
    marginBottom: "20px",
    padding: "0",
  },
  layout: {
    display: "grid",
    gridTemplateColumns: "1fr 300px",
    gap: "24px",
    alignItems: "start",
  },
  main: {},
  headerCard: {
    background: "#fff",
    borderRadius: "12px",
    padding: "24px",
    display: "flex",
    alignItems: "center",
    gap: "20px",
    marginBottom: "16px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.07)",
  },
  companyIcon: {
    width: "60px",
    height: "60px",
    borderRadius: "12px",
    background: "linear-gradient(135deg, #0f2027, #2c5364)",
    color: "#fff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "24px",
    fontWeight: "700",
    flexShrink: 0,
  },
  headerInfo: {},
  title:   { fontSize: "22px", fontWeight: "700", color: "#1a1a2e", marginBottom: "4px" },
  company: { fontSize: "15px", color: "#555" },
  pills: {
    display: "flex",
    flexWrap: "wrap",
    gap: "10px",
    marginBottom: "20px",
  },
  pill: {
    background: "#fff",
    border: "1px solid #e0e0e0",
    borderRadius: "20px",
    padding: "6px 14px",
    fontSize: "13px",
    color: "#444",
    boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
  },
  section: {
    background: "#fff",
    borderRadius: "12px",
    padding: "24px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.07)",
  },
  sectionTitle: {
    fontSize: "16px",
    fontWeight: "700",
    color: "#1a1a2e",
    marginBottom: "14px",
    paddingBottom: "10px",
    borderBottom: "1px solid #eee",
  },
  description: { fontSize: "14px", color: "#444", lineHeight: "1.8" },
  deleteBtn: {
    background: "none",
    border: "1px solid #ffcdd2",
    color: "#e53935",
    borderRadius: "6px",
    padding: "8px 16px",
    fontSize: "13px",
    cursor: "pointer",
  },
  sidebar: {
    background: "#fff",
    borderRadius: "12px",
    padding: "20px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.07)",
    position: "sticky",
    top: "20px",
  },
  sidebarTitle: {
    fontSize: "15px",
    fontWeight: "700",
    color: "#1a1a2e",
    marginBottom: "16px",
    paddingBottom: "10px",
    borderBottom: "1px solid #eee",
  },
  noApps: { color: "#888", fontSize: "13px", textAlign: "center", padding: "20px 0" },
  appCard: {
    display: "flex",
    gap: "12px",
    marginBottom: "14px",
    paddingBottom: "14px",
    borderBottom: "1px solid #f5f5f5",
    alignItems: "flex-start",
  },
  appAvatar: {
    width: "36px",
    height: "36px",
    borderRadius: "50%",
    background: "#e3f2fd",
    color: "#1565c0",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "15px",
    fontWeight: "700",
    flexShrink: 0,
  },
  appName:  { fontSize: "14px", fontWeight: "600", color: "#222" },
  appEmail: { fontSize: "12px", color: "#888", marginTop: "2px" },
  appCover: { fontSize: "12px", color: "#555", marginTop: "4px", lineHeight: "1.5" },
};
