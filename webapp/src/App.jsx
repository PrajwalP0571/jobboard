import React, { useState } from "react";
import JobList from "./pages/JobList.jsx";
import JobDetail from "./pages/JobDetail.jsx";
import JobForm from "./components/JobForm.jsx";

export default function App() {
  // Simple state-based routing — no react-router needed
  const [page, setPage] = useState("list");       // "list" | "detail" | "post"
  const [selectedJobId, setSelectedJobId] = useState(null);
  const [listRefresh, setListRefresh] = useState(0);

  const goToDetail = (jobId) => {
    setSelectedJobId(jobId);
    setPage("detail");
  };

  const goToList = () => {
    setPage("list");
    setSelectedJobId(null);
  };

  const goToPost = () => setPage("post");

  const onJobPosted = () => {
    setListRefresh((r) => r + 1);
    setPage("list");
  };

  return (
    <div>
      {/* ── HEADER ── */}
      <header style={styles.header}>
        <div style={styles.headerInner}>
          <div style={styles.logo} onClick={goToList}>
            💼 JobBoard
          </div>
          <nav style={styles.nav}>
            <button style={styles.navBtn} onClick={goToList}>Browse Jobs</button>
            <button style={styles.navBtnPrimary} onClick={goToPost}>Post a Job</button>
          </nav>
        </div>
      </header>

      {/* ── PAGES ── */}
      <main style={styles.main}>
        {page === "list" && (
          <JobList
            key={listRefresh}
            onViewJob={goToDetail}
          />
        )}
        {page === "detail" && selectedJobId && (
          <JobDetail
            jobId={selectedJobId}
            onBack={goToList}
          />
        )}
        {page === "post" && (
          <div>
            <button style={styles.backBtn} onClick={goToList}>← Back to Jobs</button>
            <JobForm onJobPosted={onJobPosted} />
          </div>
        )}
      </main>

      {/* ── FOOTER ── */}
      <footer style={styles.footer}>
        <p>JobBoard — Built with React + Node.js + PostgreSQL</p>
      </footer>
    </div>
  );
}

const styles = {
  header: {
    background: "linear-gradient(135deg, #0f2027, #203a43, #2c5364)",
    color: "#fff",
    padding: "0 40px",
    boxShadow: "0 2px 10px rgba(0,0,0,0.3)",
  },
  headerInner: {
    maxWidth: "1100px",
    margin: "0 auto",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    height: "64px",
  },
  logo: {
    fontSize: "22px",
    fontWeight: "700",
    cursor: "pointer",
    letterSpacing: "-0.5px",
  },
  nav: { display: "flex", gap: "12px" },
  navBtn: {
    background: "transparent",
    color: "#fff",
    border: "1px solid rgba(255,255,255,0.4)",
    borderRadius: "6px",
    padding: "8px 16px",
    cursor: "pointer",
    fontSize: "14px",
    fontWeight: "500",
  },
  navBtnPrimary: {
    background: "#00b4d8",
    color: "#fff",
    border: "none",
    borderRadius: "6px",
    padding: "8px 18px",
    cursor: "pointer",
    fontSize: "14px",
    fontWeight: "600",
  },
  main: {
    maxWidth: "1100px",
    margin: "32px auto",
    padding: "0 20px",
    minHeight: "calc(100vh - 160px)",
  },
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
  footer: {
    textAlign: "center",
    padding: "20px",
    color: "#888",
    fontSize: "13px",
    borderTop: "1px solid #e0e0e0",
    marginTop: "40px",
  },
};
