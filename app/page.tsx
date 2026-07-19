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
