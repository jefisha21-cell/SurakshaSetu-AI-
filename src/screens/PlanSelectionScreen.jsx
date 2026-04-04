import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { saveUserPolicy } from "../services/firestoreService";
import styles from "./plan.module.css";

const PLANS = [
  { id: "basic", label: "Basic Plan", premium: 50, coverage: 1500, icon: "🛡️", color: "#E8F4FD", border: "#90CAF9" },
  { id: "premium", label: "Premium Plan", premium: 90, coverage: 2500, icon: "⭐", color: "#FFF8E1", border: "#FFD54F" },
];

export default function PlanSelectionScreen() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const { uid } = state || {};
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleConfirm = async () => {
    if (!selected) { setError("Please choose a plan to continue"); return; }
    setLoading(true);
    try {
      await saveUserPolicy(uid, selected);
      navigate("/dashboard", { replace: true });
    } catch (err) {
      setError(err.message || "Failed to save plan");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <div className={styles.header}>
          <span className={styles.logo}>📋</span>
          <h1 className={styles.title}>Choose Your Plan</h1>
          <p className={styles.sub}>Select the insurance plan that suits you best</p>
        </div>

        <div className={styles.plans}>
          {PLANS.map((plan) => {
            const isSelected = selected === plan.id;
            return (
              <div
                key={plan.id}
                className={`${styles.card} ${isSelected ? styles.cardSelected : ""}`}
                style={{ background: plan.color, borderColor: isSelected ? "#1A73E8" : plan.border }}
                onClick={() => setSelected(plan.id)}
              >
                <div className={styles.cardTop}>
                  <span className={styles.planIcon}>{plan.icon}</span>
                  <span className={styles.planLabel}>{plan.label}</span>
                  {isSelected && <span className={styles.check}>✅</span>}
                </div>
                <div className={styles.stats}>
                  <div className={styles.stat}>
                    <span className={styles.statLabel}>Weekly Premium</span>
                    <span className={styles.statValue}>₹{plan.premium}</span>
                  </div>
                  <div className={styles.divider} />
                  <div className={styles.stat}>
                    <span className={styles.statLabel}>Coverage Amount</span>
                    <span className={styles.statValue}>₹{plan.coverage}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {error && <p className={styles.error}>{error}</p>}
        <button
          className={styles.btn}
          onClick={handleConfirm}
          disabled={loading || !selected}
        >
          {loading ? <span className={styles.spinner} /> : "Confirm Plan"}
        </button>
      </div>
    </div>
  );
}
