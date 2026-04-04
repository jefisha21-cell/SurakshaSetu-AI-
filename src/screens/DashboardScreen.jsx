import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getCurrentUser, logoutUser } from "../services/authService";
import { getUserProfile, getUserPolicy } from "../services/firestoreService";
import { getWeather, getDisruptionAlert } from "../services/weatherService";
import styles from "./dashboard.module.css";

export default function DashboardScreen() {
  const [profile, setProfile] = useState(null);
  const [policy, setPolicy] = useState(null);
  const [weather, setWeather] = useState(null);
  const [alert, setAlert] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const user = getCurrentUser();
    if (!user) { navigate("/login", { replace: true }); return; }
    Promise.all([getUserProfile(user.uid), getUserPolicy(user.uid)])
      .then(([p, pol]) => {
        setProfile(p);
        setPolicy(pol);
        if (p?.city) {
          getWeather(p.city)
            .then((w) => { setWeather(w); setAlert(getDisruptionAlert(w)); })
            .catch(() => setAlert({ level: "none", msg: "Weather data unavailable", color: "#888" }));
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const handleLogout = async () => {
    if (!window.confirm("Are you sure you want to logout?")) return;
    await logoutUser();
    navigate("/login", { replace: true });
  };

  if (loading) {
    return (
      <div className={styles.centered}>
        <div className={styles.spinner} />
        <p>Loading your dashboard...</p>
      </div>
    );
  }

  const isPremium = policy?.planType === "premium";
  const weatherIcon = weather?.weather?.[0]?.icon;
  const weatherDesc = weather?.weather?.[0]?.description;
  const temp = weather?.main?.temp;
  const humidity = weather?.main?.humidity;
  const windSpeed = weather?.wind?.speed;

  return (
    <div className={styles.page}>
      <div className={styles.container}>

        {/* Top Header */}
        <div className={styles.headerCard}>
          <div className={styles.headerTop}>
            <div>
              <p className={styles.greeting}>👋 Welcome back</p>
              <h1 className={styles.name}>{profile?.name || "Worker"}</h1>
              <p className={styles.phone}>{profile?.phone}</p>
            </div>
            <div className={styles.avatarWrap}>
              <div className={styles.avatar}>{(profile?.name || "W")[0].toUpperCase()}</div>
              <span className={`${styles.badge} ${isPremium ? styles.badgePremium : styles.badgeBasic}`}>
                {isPremium ? "⭐ Premium" : "🛡️ Basic"}
              </span>
            </div>
          </div>
        </div>

        {/* Weather + Disruption Alert */}
        {alert && (
          <div className={styles.alertBanner} style={{ borderLeftColor: alert.color }}>
            <div className={styles.alertLeft}>
              <p className={styles.alertMsg} style={{ color: alert.color }}>{alert.msg}</p>
              <p className={styles.alertSub}>Work disruption indicator for {profile?.city}</p>
            </div>
            {weatherIcon && (
              <div className={styles.weatherMini}>
                <img src={`https://openweathermap.org/img/wn/${weatherIcon}@2x.png`} alt={weatherDesc} className={styles.weatherIcon} />
                <span className={styles.tempBig}>{Math.round(temp)}°C</span>
              </div>
            )}
          </div>
        )}

        {/* Weather Details */}
        {weather && (
          <div className={styles.weatherCard}>
            <p className={styles.weatherTitle}>🌤️ Weather in {profile?.city}</p>
            <div className={styles.weatherRow}>
              <div className={styles.weatherStat}>
                <span className={styles.weatherStatIcon}>🌡️</span>
                <span className={styles.weatherStatVal}>{Math.round(temp)}°C</span>
                <span className={styles.weatherStatLabel}>Temperature</span>
              </div>
              <div className={styles.weatherStat}>
                <span className={styles.weatherStatIcon}>💧</span>
                <span className={styles.weatherStatVal}>{humidity}%</span>
                <span className={styles.weatherStatLabel}>Humidity</span>
              </div>
              <div className={styles.weatherStat}>
                <span className={styles.weatherStatIcon}>💨</span>
                <span className={styles.weatherStatVal}>{windSpeed} m/s</span>
                <span className={styles.weatherStatLabel}>Wind</span>
              </div>
              <div className={styles.weatherStat}>
                <span className={styles.weatherStatIcon}>☁️</span>
                <span className={styles.weatherStatVal} style={{ textTransform: "capitalize", fontSize: 12 }}>{weatherDesc}</span>
                <span className={styles.weatherStatLabel}>Condition</span>
              </div>
            </div>
          </div>
        )}

        {/* Coverage Stats */}
        <p className={styles.sectionTitle}>Your Coverage</p>
        <div className={styles.statsRow}>
          <div className={`${styles.statCard} ${styles.statBlue}`}>
            <span className={styles.statIcon}>💳</span>
            <span className={styles.statLabel}>Weekly Premium</span>
            <span className={styles.statValue}>₹{policy?.weeklyPremium ?? "–"}</span>
          </div>
          <div className={`${styles.statCard} ${styles.statGreen}`}>
            <span className={styles.statIcon}>🏥</span>
            <span className={styles.statLabel}>Coverage Amount</span>
            <span className={styles.statValue}>₹{policy?.coverageAmount ?? "–"}</span>
          </div>
        </div>

        {/* Policy Status */}
        <div className={styles.statusCard}>
          <div className={styles.statusLeft}>
            <span className={styles.statusDot} />
            <div>
              <p className={styles.statusLabel}>Policy Status</p>
              <p className={styles.statusValue}>{policy?.status?.toUpperCase() || "–"}</p>
            </div>
          </div>
          <div className={styles.statusRight}>
            <p className={styles.statusLabel}>Plan Type</p>
            <p className={styles.statusValue}>{isPremium ? "Premium ⭐" : "Basic 🛡️"}</p>
          </div>
        </div>

        {/* Profile Details */}
        <p className={styles.sectionTitle}>Profile Details</p>
        <div className={styles.infoCard}>
          {[
            { icon: "🪪", label: "Employee ID", value: profile?.employeeId },
            { icon: "📍", label: "City", value: profile?.city },
            { icon: "💰", label: "Avg Weekly Income", value: profile?.avgWeeklyIncome ? `₹${profile.avgWeeklyIncome}` : null },
            { icon: "📱", label: "Phone", value: profile?.phone },
          ].map(({ icon, label, value }) => (
            <div className={styles.infoRow} key={label}>
              <span className={styles.infoIcon}>{icon}</span>
              <div className={styles.infoText}>
                <span className={styles.infoLabel}>{label}</span>
                <span className={styles.infoValue}>{value || "–"}</span>
              </div>
            </div>
          ))}
        </div>

        <button className={styles.logoutBtn} onClick={handleLogout}>
          Sign Out
        </button>
      </div>
    </div>
  );
}
