import React, { useState } from "react";
import api from "../api.js";

const JOB_TYPES = ["Full-Time", "Part-Time", "Remote", "Contract", "Internship"];

export default function JobForm({ onJobPosted }) {
  const [form, setForm] = useState({
    title: "", company: "", location: "",
    salary: "", description: "", type: "Full-Time",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { title, company, location, salary, description } = form;
    if (!title || !company || !location || !salary || !description) {
      setError("All fields are required.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      await api.post("/jobs", form);
      onJobPosted();
    } catch {
      setError("Failed to post job. Is the API running?");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.wrapper}>
      <div style={styles.card}>
        <h2 style={styles.heading}>📢 Post a New Job</h2>
        <p style={styles.sub}>Fill in the details below to list your opening.</p>

        <form onSubmit={handleSubmit}>
          <div style={styles.grid}>
            <Field label="Job Title *">
              <input style={styles.input} name="title"
                value={form.title} onChange={handleChange}
                placeholder="e.g. Senior DevOps Engineer" />
            </Field>

            <Field label="Company Name *">
              <input style={styles.input} name="company"
                value={form.company} onChange={handleChange}
                placeholder="e.g. Google" />
            </Field>

            <Field label="Location *">
              <input style={styles.input} name="location"
                value={form.location} onChange={handleChange}
                placeholder="e.g. Bangalore / Remote" />
            </Field>

            <Field label="Salary *">
              <input style={styles.input} name="salary"
                value={form.salary} onChange={handleChange}
                placeholder="e.g. ₹18-24 LPA" />
            </Field>

            <Field label="Job Type *">
              <select style={styles.input} name="type"
                value={form.type} onChange={handleChange}>
                {JOB_TYPES.map(t => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </Field>
          </div>

          <Field label="Job Description *">
            <textarea
              style={{ ...styles.input, height: "140px", resize: "vertical" }}
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="Describe the role, responsibilities, and requirements..."
            />
          </Field>

          {error && <p style={styles.error}>{error}</p>}

          <button style={styles.submitBtn} type="submit" disabled={loading}>
            {loading ? "Posting..." : "Post Job →"}
          </button>
        </form>
      </div>
    </div>
  );
}

function Field({ label, children }) {
  return (
    <div style={{ marginBottom: "18px" }}>
      <label style={styles.label}>{label}</label>
      {children}
    </div>
  );
}

const styles = {
  wrapper: { maxWidth: "720px", margin: "0 auto" },
  card: {
    background: "#fff",
    borderRadius: "12px",
    padding: "32px",
    boxShadow: "0 2px 12px rgba(0,0,0,0.08)",
  },
  heading: { fontSize: "22px", fontWeight: "700", color: "#1a1a2e", marginBottom: "6px" },
  sub: { fontSize: "14px", color: "#888", marginBottom: "28px" },
  grid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "0 24px",
  },
  label: {
    display: "block",
    fontSize: "13px",
    fontWeight: "600",
    color: "#444",
    marginBottom: "6px",
  },
  input: {
    width: "100%",
    padding: "10px 14px",
    border: "1px solid #ddd",
    borderRadius: "8px",
    fontSize: "14px",
    fontFamily: "inherit",
    outline: "none",
    background: "#fafafa",
  },
  error: { color: "#e74c3c", fontSize: "13px", marginBottom: "14px" },
  submitBtn: {
    width: "100%",
    padding: "14px",
    background: "linear-gradient(135deg, #0f2027, #2c5364)",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    fontSize: "16px",
    fontWeight: "600",
    cursor: "pointer",
    marginTop: "8px",
  },
};
