import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { confirmOtp } from "../services/authService";
import { checkUserExists } from "../services/firestoreService";
import { getConfirmation, clearConfirmation } from "../services/otpSession";
import styles from "./auth.module.css";

export default function OtpScreen() {
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { state } = useLocation();
  const { phone } = state || {};

  const handleVerify = async (e) => {
    e.preventDefault();
    setError("");
    if (code.length !== 6) { setError("Please enter the 6-digit OTP"); return; }
    const confirmation = getConfirmation();
    setLoading(true);
    try {
      const user = await confirmOtp(confirmation, code, phone);
      clearConfirmation();
      const exists = await checkUserExists(user.uid);
      if (exists) {
        navigate("/dashboard", { replace: true });
      } else {
        navigate("/profile-setup", { state: { uid: user.uid, phone }, replace: true });
      }
    } catch (err) {
      setError(err.message || "Invalid OTP. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <div className={styles.logo}>🔐</div>
        <h1 className={styles.brand}>Verify OTP</h1>
        <p className={styles.tagline}>SurakshaSetu AI</p>

        <div className={styles.card}>
          <h2 className={styles.cardTitle}>Enter OTP</h2>
          <p className={styles.info}>OTP sent to <strong>{phone}</strong></p>
          <form onSubmit={handleVerify}>
            <div className={styles.field}>
              <label className={styles.label}>6-digit OTP</label>
              <input
                className={styles.input}
                type="number"
                value={code}
                onChange={(e) => setCode(e.target.value.slice(0, 6))}
                placeholder="123456"
                autoComplete="one-time-code"
              />
            </div>
            {error && <p className={styles.error}>{error}</p>}
            <button className={styles.btn} type="submit" disabled={loading}>
              {loading ? <span className={styles.btnSpinner} /> : "Verify OTP"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
