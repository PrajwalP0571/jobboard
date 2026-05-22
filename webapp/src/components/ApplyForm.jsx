import React, { useState } from "react";
import api from "../api.js";

export default function ApplyForm({ jobId, jobTitle, onApplied }) {
  const [form, setForm] = useState({ name: "", email: "", coverLetter: "" });
  const [loading,  setLoading]  = useState(false);
  const [error,    setError]    = useState("");
  const [success,  setSuccess]  = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email) {
      setError("Name and email are required.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      await api.post(`/jobs/${jobId}/apply`, form);
      setSuccess(true);
      onApplied && onApplied();
    } catch {
      setError("Failed to submit application. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div style={styles.successBox}>
        <p style={styles.successIcon}>🎉</p>
        <h3 style={styles.successTitle}>Application Submitted!</h3>
        <p style={styles.successMsg}>
          You applied for <strong>{jobTitle}</strong>. Good luck!
        </p>
      </div>
    );
  }

  return (
    <div style={styles.card}>
      <h3 style={styles.heading}>Apply for this Position</h3>

      <form onSubmit={handleSubmit}>
        <Field label="Full Name *">
          <input style={styles.input} name="name"
            value={form.name} onChange={handleChange}
            placeholder="Your full name" />
        </Field>

        <Field label="Email Address *">
          <input style={styles.input} name="email" type="email"
            value={form.email} onChange={handleChange}
            placeholder="your@email.com" />
        </Field>

        <Field label="Cover Letter (optional)">
          <textarea
            style={{ ...styles.input, height: "100px", resize: "vertical" }}
            name="coverLetter"
            value={form.coverLetter}
            onChange={handleChange}
            placeholder="Tell us why you're a great fit..."
          />
        </Field>

        {error && <p style={styles.error}>{error}</p>}

        <button style={styles.applyBtn} type="submit" disabled={loading}>
          {loading ? "Submitting..." : "Submit Application →"}
        </button>
      </form>
    </div>
  );
}

function Field({ label, children }) {
  return (
    <div style={{ marginBottom: "16px" }}>
      <label style={styles.label}>{label}</label>
      {children}
    </div>
  );
}

const styles = {
  card: {
    background: "#f0f7ff",
    border: "1px solid #cce0ff",
    borderRadius: "12px",
    padding: "24px",
    marginTop: "24px",
  },
  heading: { fontSize: "17px", fontWeight: "700", color: "#1a1a2e", marginBottom: "20px" },
  label: { display: "block", fontSize: "13px", fontWeight: "600", color: "#444", marginBottom: "6px" },
  input: {
    width: "100%",
    padding: "10px 14px",
    border: "1px solid #cce0ff",
    borderRadius: "8px",
    fontSize: "14px",
    fontFamily: "inherit",
    outline: "none",
    background: "#fff",
  },
  error: { color: "#e74c3c", fontSize: "13px", marginBottom: "12px" },
  applyBtn: {
    width: "100%",
    padding: "12px",
    background: "#00b4d8",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    fontSize: "15px",
    fontWeight: "600",
    cursor: "pointer",
  },
  successBox: {
    background: "#e8f5e9",
    border: "1px solid #a5d6a7",
    borderRadius: "12px",
    padding: "32px",
    textAlign: "center",
    marginTop: "24px",
  },
  successIcon:  { fontSize: "40px", marginBottom: "12px" },
  successTitle: { fontSize: "20px", fontWeight: "700", color: "#2e7d32", marginBottom: "8px" },
  successMsg:   { fontSize: "14px", color: "#388e3c" },
};
