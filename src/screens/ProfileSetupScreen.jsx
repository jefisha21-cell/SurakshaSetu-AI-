import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { createUserProfile } from "../services/firestoreService";
import styles from "./auth.module.css";

export default function ProfileSetupScreen() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const { uid, phone } = state || {};
  const [form, setForm] = useState({ name: "", employeeId: "", city: "", avgWeeklyIncome: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const update = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const handleSave = async (e) => {
    e.preventDefault();
    setError("");
    const { name, employeeId, city, avgWeeklyIncome } = form;
    if (!name || !employeeId || !city || !avgWeeklyIncome) {
      setError("Please fill in all fields"); return;
    }
    if (isNaN(Number(avgWeeklyIncome))) {
      setError("Average weekly income must be a number"); return;
    }
    setLoading(true);
    try {
      await createUserProfile(uid, phone, form);
      navigate("/plan-selection", { state: { uid }, replace: true });
    } catch (err) {
      setError(err.message || "Failed to save profile");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.container} style={{ maxWidth: 480 }}>
        <div className={styles.logo}>👤</div>
        <h1 className={styles.brand}>Set Up Profile</h1>
        <p className={styles.tagline}>Tell us a bit about yourself</p>

        <div className={styles.card}>
          <form onSubmit={handleSave}>
            {[
              { key: "name", label: "Full Name", placeholder: "e.g. Jefisha", type: "text" },
              { key: "employeeId", label: "Employee ID", placeholder: "e.g. ZOM123", type: "text" },
              { key: "city", label: "City / Work Location", placeholder: "e.g. Chennai", type: "text" },
              { key: "avgWeeklyIncome", label: "Average Weekly Income (₹)", placeholder: "e.g. 4800", type: "number" },
            ].map(({ key, label, placeholder, type }) => (
              <div className={styles.field} key={key}>
                <label className={styles.label}>{label}</label>
                <input
                  className={styles.input}
                  type={type}
                  value={form[key]}
                  onChange={update(key)}
                  placeholder={placeholder}
                />
              </div>
            ))}
            {error && <p className={styles.error}>{error}</p>}
            <button className={styles.btn} type="submit" disabled={loading}>
              {loading ? <span className={styles.btnSpinner} /> : "Save & Continue"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
