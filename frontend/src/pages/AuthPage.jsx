import { useMemo, useState } from "react";
import API from "../api/axios";

const initialForm = {
  full_name: "",
  email: "",
  password: "",
  confirmPassword: "",
};

const AuthPage = ({ onAuthenticated }) => {
  const [mode, setMode] = useState("login");
  const [form, setForm] = useState(initialForm);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const isSignup = mode === "signup";
  const title = useMemo(
    () => (isSignup ? "Create Your Inventory Workspace" : "Welcome Back"),
    [isSignup],
  );

  const submit = async (event) => {
    event.preventDefault();
    setError("");

    if (isSignup && form.password !== form.confirmPassword) {
      setError("Password and confirm password must match.");
      return;
    }

    try {
      setLoading(true);
      const endpoint = isSignup ? "/auth/signup" : "/auth/login";
      const payload = isSignup
        ? { full_name: form.full_name.trim(), email: form.email.trim(), password: form.password }
        : { email: form.email.trim(), password: form.password };

      const response = await API.post(endpoint, payload);
      onAuthenticated(response.data);
    } catch (requestError) {
      const message = requestError.response?.data?.detail || "Authentication failed. Please try again.";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const switchMode = (nextMode) => {
    setMode(nextMode);
    setError("");
    setForm(initialForm);
  };

  return (
    <div className="auth-shell">
      <div className="auth-backdrop-one" />
      <div className="auth-backdrop-two" />

      <section className="auth-brand">
        <p className="auth-eyebrow">InvenTrack Pro</p>
        <h1>Secure, Fast, and Built for Modern Inventory Teams</h1>
        <p className="auth-copy">
          Track stock movement, supplier flow, and product performance with a secure dashboard
          experience made for daily operations.
        </p>
        <div className="auth-metrics">
          <article>
            <strong>JWT Protected</strong>
            <span>All inventory endpoints are token secured.</span>
          </article>
          <article>
            <strong>Live Operations</strong>
            <span>Designed for teams handling frequent stock updates.</span>
          </article>
          <article>
            <strong>Action Driven</strong>
            <span>Dashboard-first workflow for quick decisions.</span>
          </article>
        </div>
      </section>

      <section className="auth-panel">
        <div className="auth-tabs">
          <button
            type="button"
            className={mode === "login" ? "active" : ""}
            onClick={() => switchMode("login")}
          >
            Log In
          </button>
          <button
            type="button"
            className={mode === "signup" ? "active" : ""}
            onClick={() => switchMode("signup")}
          >
            Sign Up
          </button>
        </div>

        <h2>{title}</h2>
        <p className="auth-subtitle">
          {isSignup
            ? "Start with an account and access your inventory workspace."
            : "Enter your credentials to open your inventory dashboard."}
        </p>

        <form className="auth-form" onSubmit={submit}>
          {isSignup && (
            <label>
              Full Name
              <input
                type="text"
                value={form.full_name}
                onChange={(event) => setForm({ ...form, full_name: event.target.value })}
                placeholder="Aman Sharma"
                required
                minLength={2}
              />
            </label>
          )}

          <label>
            Email
            <input
              type="email"
              value={form.email}
              onChange={(event) => setForm({ ...form, email: event.target.value })}
              placeholder="you@company.com"
              required
            />
          </label>

          <label>
            Password
            <input
              type="password"
              value={form.password}
              onChange={(event) => setForm({ ...form, password: event.target.value })}
              placeholder="Minimum 8 characters"
              required
              minLength={8}
            />
          </label>

          {isSignup && (
            <label>
              Confirm Password
              <input
                type="password"
                value={form.confirmPassword}
                onChange={(event) => setForm({ ...form, confirmPassword: event.target.value })}
                placeholder="Repeat your password"
                required
                minLength={8}
              />
            </label>
          )}

          {error && <div className="auth-error">{error}</div>}

          <button className="auth-submit" type="submit" disabled={loading}>
            {loading ? "Please wait..." : isSignup ? "Create Account" : "Log In"}
          </button>
        </form>
      </section>
    </div>
  );
};

export default AuthPage;
