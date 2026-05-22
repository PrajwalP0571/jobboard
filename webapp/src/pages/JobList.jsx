import React, { useEffect, useState } from "react";
import api from "../api.js";
import JobCard from "../components/JobCard.jsx";

export default function JobList({ onViewJob }) {
  const [jobs,    setJobs]    = useState([]);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState("");
  const [search,  setSearch]  = useState("");
  const [filter,  setFilter]  = useState("All");

  const JOB_TYPES = ["All", "Full-Time", "Part-Time", "Remote", "Contract", "Internship"];

  useEffect(() => {
    const fetchJobs = async () => {
      setLoading(true);
      setError("");
      try {
        const res = await api.get("/jobs");
        setJobs(res.data);
      } catch {
        setError("Could not load jobs. Please check if the API is running.");
      } finally {
        setLoading(false);
      }
    };
    fetchJobs();
  }, []);

  // Filter by search text and job type
  const filtered = jobs.filter((job) => {
    const matchesSearch =
      job.title.toLowerCase().includes(search.toLowerCase()) ||
      job.company.toLowerCase().includes(search.toLowerCase()) ||
      job.location.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = filter === "All" || job.type === filter;
    return matchesSearch && matchesFilter;
  });

  return (
    <div>
      {/* ── HERO SECTION ── */}
      <div style={styles.hero}>
        <h1 style={styles.heroTitle}>Find Your Next Role 🚀</h1>
        <p style={styles.heroSub}>
          {jobs.length} job{jobs.length !== 1 ? "s" : ""} available right now
        </p>

        {/* Search Bar */}
        <input
          style={styles.searchBar}
          type="text"
          placeholder="Search by title, company, or location..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* ── FILTER TABS ── */}
      <div style={styles.filterRow}>
        {JOB_TYPES.map((type) => (
          <button
            key={type}
            style={{
              ...styles.filterBtn,
              ...(filter === type ? styles.filterActive : {}),
            }}
            onClick={() => setFilter(type)}
          >
            {type}
          </button>
        ))}
        <span style={styles.resultCount}>{filtered.length} result{filtered.length !== 1 ? "s" : ""}</span>
      </div>

      {/* ── JOB CARDS ── */}
      {loading && (
        <p style={styles.info}>Loading jobs...</p>
      )}

      {error && (
        <div style={styles.errorBox}>
          <p>⚠️ {error}</p>
        </div>
      )}

      {!loading && !error && filtered.length === 0 && (
        <div style={styles.emptyBox}>
          <p style={{ fontSize: "40px" }}>🔍</p>
          <p style={{ fontSize: "18px", fontWeight: "600", marginTop: "12px" }}>No jobs found</p>
          <p style={{ color: "#888", marginTop: "6px", fontSize: "14px" }}>
            Try adjusting your search or filters
          </p>
        </div>
      )}

      {!loading && !error && filtered.map((job) => (
        <JobCard key={job.id} job={job} onView={onViewJob} />
      ))}
    </div>
  );
}

const styles = {
  hero: {
    background: "linear-gradient(135deg, #0f2027, #203a43, #2c5364)",
    color: "#fff",
    borderRadius: "16px",
    padding: "40px",
    marginBottom: "28px",
    textAlign: "center",
  },
  heroTitle: { fontSize: "32px", fontWeight: "700", marginBottom: "8px" },
  heroSub:   { fontSize: "16px", opacity: 0.8, marginBottom: "24px" },
  searchBar: {
    width: "100%",
    maxWidth: "540px",
    padding: "14px 20px",
    borderRadius: "30px",
    border: "none",
    fontSize: "15px",
    outline: "none",
    boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
  },
  filterRow: {
    display: "flex",
    flexWrap: "wrap",
    gap: "8px",
    alignItems: "center",
    marginBottom: "20px",
  },
  filterBtn: {
    padding: "6px 16px",
    border: "1px solid #ddd",
    borderRadius: "20px",
    background: "#fff",
    cursor: "pointer",
    fontSize: "13px",
    fontWeight: "500",
  },
  filterActive: {
    background: "#0f2027",
    color: "#fff",
    border: "1px solid #0f2027",
  },
  resultCount: {
    marginLeft: "auto",
    fontSize: "13px",
    color: "#888",
  },
  info: { textAlign: "center", color: "#888", padding: "40px 0" },
  errorBox: {
    background: "#fff5f5",
    border: "1px solid #fed7d7",
    borderRadius: "10px",
    padding: "20px",
    color: "#c53030",
    textAlign: "center",
  },
  emptyBox: {
    textAlign: "center",
    padding: "60px 0",
    color: "#555",
  },
};
