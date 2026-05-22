import React from "react";

const TYPE_COLORS = {
  "Full-Time":  { bg: "#e8f5e9", color: "#2e7d32" },
  "Part-Time":  { bg: "#fff3e0", color: "#e65100" },
  "Remote":     { bg: "#e3f2fd", color: "#1565c0" },
  "Contract":   { bg: "#f3e5f5", color: "#6a1b9a" },
  "Internship": { bg: "#fce4ec", color: "#880e4f" },
};

export default function JobCard({ job, onView }) {
  const typeStyle = TYPE_COLORS[job.type] || TYPE_COLORS["Full-Time"];

  // Format date to readable string
  const postedDate = new Date(job.createdAt).toLocaleDateString("en-US", {
    month: "short", day: "numeric", year: "numeric",
  });

  return (
    <div style={styles.card}>
      {/* Top Row */}
      <div style={styles.topRow}>
        <div style={styles.companyIcon}>
          {job.company.charAt(0).toUpperCase()}
        </div>
        <div style={styles.topInfo}>
          <h3 style={styles.title}>{job.title}</h3>
          <p style={styles.company}>{job.company}</p>
        </div>
        <span style={{ ...styles.typeBadge, background: typeStyle.bg, color: typeStyle.color }}>
          {job.type}
        </span>
      </div>

      {/* Meta Info */}
      <div style={styles.meta}>
        <span style={styles.metaItem}>📍 {job.location}</span>
        <span style={styles.metaItem}>💰 {job.salary}</span>
        <span style={styles.metaItem}>👥 {job._count?.applications || 0} applicants</span>
        <span style={styles.metaItem}>📅 {postedDate}</span>
      </div>

      {/* Description Preview */}
      <p style={styles.desc}>
        {job.description.length > 150
          ? job.description.substring(0, 150) + "..."
          : job.description}
      </p>

      {/* Action */}
      <div style={styles.footer}>
        <button style={styles.viewBtn} onClick={() => onView(job.id)}>
          View & Apply →
        </button>
      </div>
    </div>
  );
}

const styles = {
  card: {
    background: "#fff",
    borderRadius: "12px",
    padding: "24px",
    marginBottom: "16px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.07)",
    border: "1px solid #eee",
    transition: "box-shadow 0.2s",
  },
  topRow: {
    display: "flex",
    alignItems: "flex-start",
    gap: "16px",
    marginBottom: "14px",
  },
  companyIcon: {
    width: "48px",
    height: "48px",
    borderRadius: "10px",
    background: "linear-gradient(135deg, #0f2027, #2c5364)",
    color: "#fff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "20px",
    fontWeight: "700",
    flexShrink: 0,
  },
  topInfo: { flex: 1 },
  title: { fontSize: "17px", fontWeight: "700", color: "#1a1a2e", marginBottom: "2px" },
  company: { fontSize: "14px", color: "#555" },
  typeBadge: {
    fontSize: "12px",
    fontWeight: "600",
    padding: "4px 12px",
    borderRadius: "20px",
    whiteSpace: "nowrap",
  },
  meta: {
    display: "flex",
    flexWrap: "wrap",
    gap: "16px",
    marginBottom: "12px",
  },
  metaItem: { fontSize: "13px", color: "#666" },
  desc: {
    fontSize: "14px",
    color: "#555",
    lineHeight: "1.6",
    marginBottom: "16px",
  },
  footer: { display: "flex", justifyContent: "flex-end" },
  viewBtn: {
    background: "linear-gradient(135deg, #0f2027, #2c5364)",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    padding: "10px 20px",
    fontSize: "14px",
    fontWeight: "600",
    cursor: "pointer",
  },
};
