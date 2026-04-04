import React, { useState } from "react";
import { sendOtp } from "../services/authService";
import { setConfirmation } from "../services/otpSession";
import { useNavigate } from "react-router-dom";
import styles from "./auth.module.css";

export default function LoginScreen() {
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSend = async (e) => {
    e.preventDefault();
    setError("");
    const trimmed = phone.trim();
    if (!/^\+\d{10,15}$/.test(trimmed)) {
      setError("Enter phone with country code e.g. +919876543210");
      return;
    }
    setLoading(true);
    try {
      const confirmation = await sendOtp(trimmed);
      setConfirmation(confirmation);
      navigate("/otp", { state: { phone: trimmed } });
    } catch (err) {
      setError(err.message || "Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <div className={styles.logo}>🛡️</div>
        <h1 className={styles.brand}>SurakshaSetu AI</h1>
        <p className={styles.tagline}>Worker Insurance Platform</p>

        <div className={styles.card}>
          <h2 className={styles.cardTitle}>Login with Phone</h2>
          <form onSubmit={handleSend}>
            <div className={styles.field}>
              <label className={styles.label}>Phone Number</label>
              <input
                className={styles.input}
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+919876543210"
                autoComplete="tel"
              />
            </div>
            {error && <p className={styles.error}>{error}</p>}
            <button className={styles.btn} type="submit" disabled={loading}>
              {loading ? <span className={styles.btnSpinner} /> : "Send OTP"}
            </button>
          </form>
          <p style={{ marginTop: 16, fontSize: 12, color: "#999", textAlign: "center" }}>
            
          </p>
        </div>
      </div>
    </div>
  );
}
