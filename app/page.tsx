"use client";

import { useRef, useState } from "react";

export default function Home() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<string>("");

  function openCamera() {
    fileInputRef.current?.click();
  }

  function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];

    if (file) {
      setSelectedFile(file.name);
    }
  }

  return (
    <main className="app-shell">
      <header className="topbar">
        <div>
          <div className="brand">
            <div className="brand-mark">A</div>

            <div>
              <h1>ArchZen Connect</h1>
              <p>Your AI networking assistant</p>
            </div>
          </div>
        </div>

        <button className="profile-button" type="button">
          ES
        </button>
      </header>

      <section className="welcome-section">
        <div>
          <p className="eyebrow">YOUR NETWORK</p>
          <h2>Good morning, Esh 👋</h2>
          <p className="welcome-copy">
            Keep every person you meet, every conversation and every follow-up
            organised in one private place.
          </p>
        </div>

        <button className="primary-button desktop-scan" onClick={openCamera}>
          <span>＋</span>
          Scan a business card
        </button>
      </section>

      <section className="stats-grid">
        <article className="stat-card">
          <div className="stat-icon">👥</div>
          <div>
            <span>Total contacts</span>
            <strong>0</strong>
          </div>
        </article>

        <article className="stat-card">
          <div className="stat-icon">✉️</div>
          <div>
            <span>Draft emails</span>
            <strong>0</strong>
          </div>
        </article>

        <article className="stat-card">
          <div className="stat-icon">⏰</div>
          <div>
            <span>Follow-ups</span>
            <strong>0</strong>
          </div>
        </article>
      </section>

      <section className="action-grid">
        <button className="action-card scan-card" onClick={openCamera}>
          <div className="action-icon">📷</div>

          <div>
            <h3>Scan business card</h3>
            <p>Take a photo or upload an existing card.</p>
          </div>

          <span className="arrow">→</span>
        </button>

        <button className="action-card">
          <div className="action-icon">👤</div>

          <div>
            <h3>My contacts</h3>
            <p>Search and review everyone you have met.</p>
          </div>

          <span className="arrow">→</span>
        </button>

        <button className="action-card">
          <div className="action-icon">✉️</div>

          <div>
            <h3>Email drafts</h3>
            <p>Review personalised messages before sending.</p>
          </div>

          <span className="arrow">→</span>
        </button>

        <button className="action-card">
          <div className="action-icon">🔔</div>

          <div>
            <h3>Follow-ups</h3>
            <p>Never forget to reconnect with someone.</p>
          </div>

          <span className="arrow">→</span>
        </button>
      </section>

      <section className="activity-panel">
        <div className="section-heading">
          <div>
            <p className="eyebrow">RECENT ACTIVITY</p>
            <h3>Your latest connections</h3>
          </div>

          <button className="text-button">View all</button>
        </div>

        <div className="empty-state">
          <div className="empty-icon">📇</div>
          <h4>No contacts yet</h4>
          <p>Scan your first business card to start building your network.</p>
          <button className="secondary-button" onClick={openCamera}>
            Scan first card
          </button>
        </div>
      </section>

      {selectedFile && (
        <div className="file-notice">
          <span>✓</span>
          Card selected: <strong>{selectedFile}</strong>
        </div>
      )}

      <button className="mobile-scan-button" onClick={openCamera}>
        <span>📷</span>
        Scan card
      </button>

      <input
        ref={fileInputRef}
        className="hidden-input"
        type="file"
        accept="image/*"
        capture="environment"
        onChange={handleFileChange}
      />
    </main>
  );
}
