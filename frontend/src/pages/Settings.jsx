import { useState, useEffect } from "react";
import { getUserRole, getUserName } from "../utils/auth";
import { getCurrentUser, updateUserProfile } from "../api/user";

// Default settings
const DEFAULT_SETTINGS = {
  notifications: true,
  emailAlerts: true,
  smsAlerts: false,
  darkMode: true,
  language: "en",
  timezone: "UTC",
  currency: "USD",
};

// Load settings from localStorage
const loadClientSettings = () => {
  try {
    const saved = localStorage.getItem("crmSettings");
    if (saved) {
      return { ...DEFAULT_SETTINGS, ...JSON.parse(saved) };
    }
  } catch (error) {
    console.error("Error loading settings:", error);
  }
  return DEFAULT_SETTINGS;
};

// Save settings to localStorage
const saveClientSettings = (settings) => {
  try {
    const clientSettings = {
      notifications: settings.notifications,
      emailAlerts: settings.emailAlerts,
      smsAlerts: settings.smsAlerts,
      darkMode: settings.darkMode,
      language: settings.language,
      timezone: settings.timezone,
      currency: settings.currency,
    };
    localStorage.setItem("crmSettings", JSON.stringify(clientSettings));
  } catch (error) {
    console.error("Error saving settings:", error);
  }
};

export default function Settings() {
  const role = getUserRole();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [emailError, setEmailError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [user, setUser] = useState({ name: "", email: "" });
  
  const clientSettings = loadClientSettings();
  const [settings, setSettings] = useState({
    email: "",
    ...clientSettings,
  });

  // Load user profile on mount
  useEffect(() => {
    const loadUserProfile = async () => {
      try {
        setLoading(true);
        const userData = await getCurrentUser();
        setUser({
          name: userData.name || getUserName() || "User",
          email: userData.email || "",
        });
        setSettings((prev) => ({
          ...prev,
          email: userData.email || "",
        }));
      } catch (error) {
        console.error("Error loading user profile:", error);
        setError("Failed to load user profile");
        // Fallback to token data
        setUser({
          name: getUserName() || "User",
          email: "",
        });
      } finally {
        setLoading(false);
      }
    };
    loadUserProfile();
  }, []);

  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userName");
    localStorage.removeItem("lastLoginTime");
    window.location.href = "/login";
  };

  const handleLogoutClick = () => {
    setShowLogoutConfirm(true);
  };

  const handleLogoutConfirm = () => {
    logout();
  };

  const handleLogoutCancel = () => {
    setShowLogoutConfirm(false);
  };

  const handleChange = (key, value) => {
    setSettings({ ...settings, [key]: value });
    setError(null);
    setEmailError(null);
    setSuccess(false);
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      setError(null);
      setEmailError(null);
      setSuccess(false);

      // Update profile (email) on backend
      if (settings.email !== user.email && settings.email) {
        try {
          const updatedUser = await updateUserProfile({ email: settings.email });
          setUser({
            ...user,
            email: updatedUser.email,
          });
          setSettings((prev) => ({
            ...prev,
            email: updatedUser.email,
          }));
        } catch (profileError) {
          const errorMsg = profileError.response?.data?.message || "Failed to update email";
          setEmailError(errorMsg);
          throw new Error(errorMsg);
        }
      }

      // Save client-side settings to localStorage
      saveClientSettings(settings);

      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      if (!emailError) {
        setError(err.message || "Failed to save settings");
      }
    } finally {
      setSaving(false);
    }
  };

  const handleReset = () => {
    if (window.confirm("Are you sure you want to reset all settings to default?")) {
      setSettings({
        email: user.email || "",
        ...DEFAULT_SETTINGS,
      });
      localStorage.removeItem("crmSettings");
      setError(null);
      setEmailError(null);
      setSuccess(false);
    }
  };

  if (loading) {
    return (
      <div className="layout">
        {/* SIDEBAR */}
        <aside className="sidebar">
          <h2 className="logo-header">
            <svg className="logo-icon" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <linearGradient id="blueGradient" x1="8" y1="6" x2="24" y2="24" gradientUnits="userSpaceOnUse">
                  <stop offset="0%" stopColor="#60a5fa"/>
                  <stop offset="50%" stopColor="#3b82f6"/>
                  <stop offset="100%" stopColor="#2563eb"/>
                </linearGradient>
              </defs>
              <path d="M6 10L10 8V24L6 22V10Z" fill="#000000"/>
              <path d="M10 8H22V24H10V8Z" fill="url(#blueGradient)"/>
              <path d="M10 8L6 10L6 22L10 24V8Z" fill="#1a1a1a"/>
              <path d="M4 22C4 22 3 23 3 25C3 27 4.5 28 6 28C7.5 28 9 27 9 25C9 23 8 22 7 22H4Z" fill="#000000"/>
              <path d="M24 22C24 22 25 23 25 25C25 27 23.5 28 22 28C20.5 28 19 27 19 25C19 23 20 22 21 22H24Z" fill="#000000"/>
            </svg>
            <span>CRM</span>
          </h2>
          <a href="/">Dashboard</a>
          <a href="/leads">Leads</a>
          <a href="/analytics">Analytics</a>
          <a className="active">Settings</a>
          <div style={{ marginTop: "40px", opacity: 0.7, fontSize: "13px" }}>
            Role: <span className="role-badge">{role || "..."}</span>
          </div>
        </aside>

        {/* MAIN CONTENT */}
        <main className="main">
          {/* TOP BAR SKELETON */}
          <div className="topbar">
            <div>
              <div className="skeleton skeleton-title"></div>
              <div className="skeleton skeleton-text"></div>
            </div>
            <div className="skeleton skeleton-button"></div>
          </div>

          {/* SETTINGS GRID SKELETON */}
          <div className="settings-container">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="settings-section skeleton-card">
                <div className="skeleton skeleton-title-small" style={{ marginBottom: "16px" }}></div>
                <div className="skeleton" style={{ height: "60px", marginBottom: "12px" }}></div>
                <div className="skeleton" style={{ height: "60px", marginBottom: "12px" }}></div>
                <div className="skeleton" style={{ height: "60px" }}></div>
              </div>
            ))}
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="layout">
      {/* SIDEBAR */}
      <aside className="sidebar">
        <h2>CRM</h2>
        <a href="/">Dashboard</a>
        <a href="/leads">Leads</a>
        <a href="/analytics">Analytics</a>
        <a className="active">Settings</a>
        <div style={{ marginTop: "40px", opacity: 0.7, fontSize: "13px" }}>
          Role: <span className="role-badge">{role}</span>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="main">
        {/* TOP BAR */}
        <div className="topbar">
          <div>
            <h1>Settings</h1>
            <p>Manage your account preferences and system settings</p>
          </div>
          <button className="btn btn-danger" onClick={handleLogoutClick}>
            Logout
          </button>
        </div>

        {/* LOGOUT CONFIRMATION POPUP */}
        {showLogoutConfirm && (
          <LogoutConfirmation
            onConfirm={handleLogoutConfirm}
            onCancel={handleLogoutCancel}
          />
        )}

        {/* SETTINGS GRID */}
        <div className="settings-container">
          {/* PROFILE SETTINGS */}
          <div className="settings-section">
            <div className="settings-header">
              <h2>👤 Profile Settings</h2>
              <p>Update your personal information</p>
            </div>
            <div className="settings-content">
              <div className="settings-field">
                <label>Full Name</label>
                <input
                  type="text"
                  value={user.name}
                  readOnly
                  className="settings-input"
                  placeholder="Your full name"
                  disabled={loading}
                />
              </div>
              <div className="settings-field">
                <label>Email Address</label>
                <input
                  type="email"
                  value={settings.email}
                  onChange={(e) => handleChange("email", e.target.value)}
                  className="settings-input"
                  placeholder="your.email@example.com"
                  disabled={loading || saving}
                />
                {emailError && (
                  <small style={{ color: "#ef4444", fontSize: "12px", marginTop: "4px", display: "block" }}>
                    {emailError}
                  </small>
                )}
              </div>
              <div className="settings-field">
                <label>Role</label>
                <input
                  type="text"
                  value={role}
                  readOnly
                  className="settings-input"
                />
              </div>
            </div>
          </div>

          {/* NOTIFICATION SETTINGS */}
          <div className="settings-section">
            <div className="settings-header">
              <h2>🔔 Notifications</h2>
              <p>Control how you receive updates</p>
            </div>
            <div className="settings-content">
              <ToggleField
                label="Push Notifications"
                value={settings.notifications}
                onChange={(val) => handleChange("notifications", val)}
                description="Receive real-time updates"
                disabled={loading || saving}
              />
              <ToggleField
                label="Email Alerts"
                value={settings.emailAlerts}
                onChange={(val) => handleChange("emailAlerts", val)}
                description="Get notified via email"
                disabled={loading || saving}
              />
              <ToggleField
                label="SMS Alerts"
                value={settings.smsAlerts}
                onChange={(val) => handleChange("smsAlerts", val)}
                description="Receive text message notifications"
                disabled={loading || saving}
              />
            </div>
          </div>

          {/* APPEARANCE SETTINGS */}
          <div className="settings-section">
            <div className="settings-header">
              <h2>🎨 Appearance</h2>
              <p>Customize the look and feel</p>
            </div>
            <div className="settings-content">
              <ToggleField
                label="Dark Mode"
                value={settings.darkMode}
                onChange={(val) => handleChange("darkMode", val)}
                description="Switch between light and dark theme"
                disabled={loading || saving}
              />
              <div className="settings-field">
                <label>Language</label>
                <select
                  value={settings.language}
                  onChange={(e) => handleChange("language", e.target.value)}
                  className="settings-input"
                  disabled={loading || saving}
                >
                  <option value="en">English</option>
                  <option value="es">Spanish</option>
                  <option value="fr">French</option>
                  <option value="de">German</option>
                  <option value="hi">Hindi</option>
                </select>
              </div>
            </div>
          </div>

          {/* SYSTEM SETTINGS */}
          <div className="settings-section">
            <div className="settings-header">
              <h2>⚙️ System Preferences</h2>
              <p>Configure system-level settings</p>
            </div>
            <div className="settings-content">
              <div className="settings-field">
                <label>Timezone</label>
                <select
                  value={settings.timezone}
                  onChange={(e) => handleChange("timezone", e.target.value)}
                  className="settings-input"
                  disabled={loading || saving}
                >
                  <option value="UTC">UTC</option>
                  <option value="EST">Eastern Time</option>
                  <option value="PST">Pacific Time</option>
                  <option value="IST">Indian Standard Time</option>
                  <option value="GMT">Greenwich Mean Time</option>
                </select>
              </div>
              <div className="settings-field">
                <label>Currency</label>
                <select
                  value={settings.currency}
                  onChange={(e) => handleChange("currency", e.target.value)}
                  className="settings-input"
                  disabled={loading || saving}
                >
                  <option value="USD">USD ($)</option>
                  <option value="EUR">EUR (€)</option>
                  <option value="GBP">GBP (£)</option>
                  <option value="INR">INR (₹)</option>
                </select>
              </div>
            </div>
          </div>

          {/* ACTION BUTTONS */}
          <div className="settings-actions">
            {loading && (
              <div className="settings-loading" style={{ marginBottom: "16px", color: "#60a5fa" }}>
                Loading settings...
              </div>
            )}
            {error && !emailError && !loading && (
              <div className="settings-error" style={{ 
                marginBottom: "16px", 
                color: "#ef4444",
                background: "rgba(239, 68, 68, 0.1)",
                padding: "12px 16px",
                borderRadius: "8px",
                border: "1px solid rgba(239, 68, 68, 0.3)"
              }}>
                ❌ {error}
              </div>
            )}
            {success && (
              <div className="settings-saved" style={{ 
                marginBottom: "16px", 
                color: "#10b981",
                background: "rgba(16, 185, 129, 0.1)",
                padding: "12px 16px",
                borderRadius: "8px",
                border: "1px solid rgba(16, 185, 129, 0.3)"
              }}>
                ✅ Settings saved successfully!
              </div>
            )}
            <button 
              className="btn btn-primary settings-save-btn" 
              onClick={handleSave}
              disabled={loading || saving}
              style={{ opacity: loading || saving ? 0.6 : 1, cursor: loading || saving ? "not-allowed" : "pointer" }}
            >
              {saving ? "Saving..." : "Save Changes"}
            </button>
            <button 
              className="btn btn-secondary settings-reset-btn"
              onClick={handleReset}
              disabled={loading || saving}
              style={{ opacity: loading || saving ? 0.6 : 1, cursor: loading || saving ? "not-allowed" : "pointer" }}
            >
              Reset to Default
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}

/* =====================
   LOGOUT CONFIRMATION POPUP
===================== */
function LogoutConfirmation({ onConfirm, onCancel }) {
  return (
    <div className="logout-modal-overlay" onClick={onCancel}>
      <div className="logout-modal" onClick={(e) => e.stopPropagation()}>
        <div className="logout-modal-header">
          <h3>Confirm Logout</h3>
        </div>
        <div className="logout-modal-body">
          <p>Are you sure you want to logout?</p>
        </div>
        <div className="logout-modal-actions">
          <button className="btn btn-secondary" onClick={onCancel}>
            Cancel
          </button>
          <button className="btn btn-danger" onClick={onConfirm}>
            Yes, Logout
          </button>
        </div>
      </div>
    </div>
  );
}

function ToggleField({ label, value, onChange, description, disabled = false }) {
  return (
    <div className="toggle-field">
      <div className="toggle-content">
        <label className="toggle-label">{label}</label>
        <p className="toggle-description">{description}</p>
      </div>
      <label className="toggle-switch" style={{ opacity: disabled ? 0.6 : 1, cursor: disabled ? "not-allowed" : "pointer" }}>
        <input
          type="checkbox"
          checked={value}
          onChange={(e) => !disabled && onChange(e.target.checked)}
          disabled={disabled}
        />
        <span className="toggle-slider"></span>
      </label>
    </div>
  );
}

