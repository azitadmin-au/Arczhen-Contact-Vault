"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem("archzen-theme");

    if (savedTheme === "dark") {
      setDarkMode(true);
      document.documentElement.classList.add("dark");
    }
  }, []);

  function toggleTheme() {
    const nextTheme = !darkMode;

    setDarkMode(nextTheme);

    if (nextTheme) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("archzen-theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("archzen-theme", "light");
    }
  }

  function openCardScanner() {
    router.push("/scan");
  }

  return (
    <main className="app-shell">
      <header className="topbar">
        <div className="brand">
          <img
            src="/logo.png"
            alt="ArchZen"
            className="brand-logo"
          />

          <div className="brand-text">
            <h1>ARCHZEN CONNECT</h1>
            <p>Your AI Networking Assistant</p>
          </div>
        </div>

        <div className="topbar-actions">
          <button
            type="button"
            className="theme-button"
            onClick={toggleTheme}
            aria-label="Toggle dark mode"
          >
            {darkMode ? "☀️" : "🌙"}
          </button>

          <button className="profile-button" type="button">
            ES
          </button>
        </div>
      </header>

      <section className="hero-section">
        <div className="hero-copy">
          <p className="eyebrow">ARCHZEN CONNECT</p>

          <h2>Turn business cards into business relationships.</h2>

          <p className="hero-description">
            Scan a card, remember the conversation, prepare a personal email and
            never lose another valuable connection.
          </p>

          <div className="hero-actions">
            <button
              type="button"
              className="primary-button"
              onClick={openCardScanner}
            >
              <span>📷</span>
              Scan a business card
            </button>

            <button
              type="button"
              className="secondary-outline-button"
            >
              View people
            </button>
          </div>
        </div>

        <button
          type="button"
          className="hero-scan-card"
          onClick={openCardScanner}
        >
          <div className="scanner-visual">
            <div className="scanner-corner scanner-top-left" />
            <div className="scanner-corner scanner-top-right" />
            <div className="scanner-corner scanner-bottom-left" />
            <div className="scanner-corner scanner-bottom-right" />

            <div className="scanner-icon">📇</div>
            <div className="scanner-line" />
          </div>

          <div>
            <span className="scan-label">QUICK ACTION</span>
            <h3>Scan Business Card</h3>
            <p>Take a photo or choose an existing image.</p>
          </div>

          <span className="scan-arrow">→</span>
        </button>
      </section>

      <section className="stats-grid">
        <article className="stat-card">
          <div className="stat-icon">👥</div>

          <div>
            <span>People</span>
            <strong>0</strong>
            <small>Saved connections</small>
          </div>
        </article>

        <article className="stat-card">
          <div className="stat-icon">✨</div>

          <div>
            <span>AI Drafts</span>
            <strong>0</strong>
            <small>Ready for review</small>
          </div>
        </article>

        <article className="stat-card">
          <div className="stat-icon">✅</div>

          <div>
            <span>Tasks</span>
            <strong>0</strong>
            <small>Follow-ups due</small>
          </div>
        </article>

        <article className="stat-card">
          <div className="stat-icon">⏱️</div>

          <div>
            <span>Time saved</span>
            <strong>0h</strong>
            <small>Through automation</small>
          </div>
        </article>
      </section>

      <section className="section-block">
        <div className="section-heading">
          <div>
            <p className="eyebrow">YOUR WORKSPACE</p>
            <h3>Everything you need after meeting someone.</h3>
          </div>
        </div>

        <div className="action-grid">
          <button
            type="button"
            className="action-card dark-action"
            onClick={openCardScanner}
          >
            <div className="action-icon">📷</div>

            <div>
              <h4>Scan a card</h4>
              <p>Capture contact details from a visiting card.</p>
            </div>

            <span className="arrow">→</span>
          </button>

          <button className="action-card" type="button">
            <div className="action-icon">👤</div>

            <div>
              <h4>People</h4>
              <p>Search every person, company and conversation.</p>
            </div>

            <span className="arrow">→</span>
          </button>

          <button className="action-card" type="button">
            <div className="action-icon">✨</div>

            <div>
              <h4>AI Drafts</h4>
              <p>Review personal follow-up emails before sending.</p>
            </div>

            <span className="arrow">→</span>
          </button>

          <button className="action-card" type="button">
            <div className="action-icon">🔔</div>

            <div>
              <h4>Tasks</h4>
              <p>See reminders and upcoming follow-ups.</p>
            </div>

            <span className="arrow">→</span>
          </button>
        </div>
      </section>

      <section className="activity-panel">
        <div className="section-heading">
          <div>
            <p className="eyebrow">RECENT CONNECTIONS</p>
            <h3>Your latest people</h3>
          </div>

          <button className="text-button" type="button">
            View all
          </button>
        </div>

        <div className="empty-state">
          <div className="empty-icon">📇</div>

          <h4>Your network starts here</h4>

          <p>
            Scan your first business card and ArchZen Connect will prepare the
            contact details for your review.
          </p>

          <button
            type="button"
            className="secondary-button"
            onClick={openCardScanner}
          >
            Scan your first card
          </button>
        </div>
      </section>

      <button
        type="button"
        className="mobile-scan-button"
        onClick={openCardScanner}
      >
        <span>📷</span>
        Scan card
      </button>
    </main>
  );
}
