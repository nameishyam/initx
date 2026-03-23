import { useState, useEffect } from "react";
import "./index.css";

const App = () => {
  const [status, setStatus] = useState("idle");

  const checkConnection = async () => {
    setStatus("loading");
    try {
      const response = await fetch("/api/status");

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.json();
      console.log(data.status);
      if (data.status === "ok") {
        setStatus("connected");
      } else {
        setStatus("error");
      }
    } catch (error) {
      console.error("Connection error:", error);
      setStatus("error");
    }
  };

  useEffect(() => {
    checkConnection();
  }, []);

  return (
    <div className="app-container">
      <header className="app-header">
        <h1>InitX Fullstack Tool</h1>
      </header>

      <main className="status-section">
        <h2>Backend Connection Status</h2>

        <div className={`status-indicator ${status}`}>
          {status === "idle" && <p>Waiting to check...</p>}
          {status === "loading" && <p>Checking connection...</p>}
          {status === "connected" && (
            <p className="success-text">
              ✅ Okay, it's connected and API is working!
            </p>
          )}
          {status === "error" && (
            <p className="error-text">
              ❌ Error: Could not connect to the backend.
            </p>
          )}
        </div>

        <button
          onClick={checkConnection}
          className="retry-button"
          disabled={status === "loading"}
        >
          {status === "loading" ? "Checking..." : "Check Connection Again"}
        </button>
      </main>

      <footer className="developer-footer">
        <p>Developed by: Syam Gowtham Geddam</p>
        <div className="social-links">
          <a
            href="https://github.com/nameishyam"
            target="_blank"
            rel="noopener noreferrer"
          >
            GitHub
          </a>
          <a
            href="https://www.linkedin.com/in/nameishyam"
            target="_blank"
            rel="noopener noreferrer"
          >
            LinkedIn
          </a>
          <a
            href="https://portfolio-syam.vercel.app"
            target="_blank"
            rel="noopener noreferrer"
          >
            Website
          </a>
        </div>
      </footer>
    </div>
  );
};

export default App;
