# 🛡️ SurakshaSetu AI
## AI-Powered Income Protection & Reward System for Delivery Partners

---

## 📌 Problem Statement

Food delivery partners working with platforms like Swiggy and Zomato rely entirely on daily and weekly earnings. External disruptions such as:

- 🌧️ Heavy rain
- 🌡️ Extreme heatwaves
- 🌫️ High pollution (AQI spikes)
- 🚧 Local shutdowns

...often prevent them from working, causing **20–30% loss in weekly income**.

There is currently no system that protects their income during such uncontrollable events.

---

## 💡 Solution Overview

**SurakshaSetu AI** is an AI-powered parametric insurance platform that:

- Protects delivery partners from income loss during disruptions
- Automatically detects disruptions using real-time environmental data
- Provides instant payouts without any manual claim process
- Rewards users who continue working during extreme conditions

---

## 👤 Target Users

- Food delivery partners (Swiggy, Zomato, etc.)
- Outdoor gig workers
- Weekly income-based earners

---

## 🏗️ System Architecture

> Architecture diagram — to be added at `./assets/architecture.png`

---

## 🔄 System Workflow

1. User registers via mobile app (OTP login)
2. User links delivery account (simulated Employee ID + work location)
3. System collects:
   - 📍 GPS location
   - ⏱️ Working hours
   - 💰 Average weekly income
4. AI calculates:
   - Risk score
   - Weekly premium
   - Coverage amount
5. User selects insurance plan (Basic / Premium)
6. System continuously monitors:
   - Weather (rainfall, temperature)
   - Air quality (AQI)
   - Income and activity levels

---

## ⚡ Decision Logic

### ❌ Case 1 — User Cannot Work
- Disruption detected
- User is inactive
- System calculates income loss → triggers **automatic payout**

### 🌟 Case 2 — User Works in Extreme Conditions
- Disruption detected
- User is still active
- System rewards user with:
  - 💰 Bonus incentive
  - 📉 Premium discount
  - 📊 Reliability score boost

---

## 💰 Weekly Insurance Model

| Parameter       | Value              |
|-----------------|--------------------|
| Premium cycle   | Weekly             |
| Coverage basis  | Average income     |
| Example income  | ₹4,800 / week      |
| Coverage        | ₹1,500             |
| Premium         | ₹50 / week         |

---

## ⚡ Parametric Triggers

| Trigger              | Condition                        |
|----------------------|----------------------------------|
| 🌧️ Rainfall          | Exceeds defined threshold        |
| 🌡️ Temperature       | Exceeds heat/cold threshold      |
| 🌫️ AQI               | Exceeds hazardous level          |
| 📉 Income drop       | Sudden drop in orders/activity   |

---

## 🌟 Resilience Reward System

A unique feature that differentiates SurakshaSetu AI:

- Detects users who work despite active disruption alerts
- Rewards them with bonus incentives
- Reduces their next premium
- Builds a long-term reliability score

> This creates a fair system — honest workers are never just penalized by bad weather, they are recognized for their resilience.

---

## 🤖 AI & Decision Logic

- Risk scoring based on location and weather data
- Dynamic premium calculation per user profile
- Income drop detection using activity signals
- Shift-aware validation (avoids false triggers outside work hours)
- Behavior-based reward system

---

## 📱 Worker App Features

- Policy status and coverage details
- Claims history
- Real-time weather and AQI alerts
- Weekly earnings summary
- Reward and reliability score tracking

---

## 🧑‍💼 Admin Dashboard Features

- Total users and active policies
- Claims vs rewards analytics
- Risk zone mapping
- Fraud detection alerts
- Predictive disruption insights

---

## ☁️ Tech Stack

| Layer            | Technology                          |
|------------------|--------------------------------------|
| Mobile App       | React Native                         |
| Admin Dashboard  | React (Web)                          |
| Backend          | Firebase (Auth + Firestore + Cloud Functions) |
| AI / Logic       | Rule-based engine , ML-ready architecture |
| Weather API      | OpenWeather API                      |
| AQI API          | AQI / pollution data API             |
| Location         | Mobile GPS + multi-signal verification |
| Payment          | Razorpay (Test Mode / Mock)          |

---

## 🔗 Platform Integration

Delivery account linking is simulated for the hackathon. Users provide:
- Employee ID
- Work area / location

**Future scope:** Secure API integration with Swiggy, Zomato, and other delivery platforms.

---

## 🛡️ Adversarial Defense & Anti-Spoofing Strategy

### 🚨 The Threat

Modern fraud syndicates organize via private groups (e.g., Telegram) and use GPS-spoofing applications to fake their location inside high-risk weather zones — triggering mass false payouts and draining the liquidity pool, without ever leaving home.

**GPS alone is not reliable. Our system does not trust location — it trusts behavior.**

---

### 🧠 1. Differentiation Strategy — Real Worker vs Spoofed User

We use a **multi-signal behavioral verification system** instead of relying solely on GPS coordinates.

**Genuine worker signals:**
- Continuous, road-consistent movement patterns
- Realistic speed variations (traffic stops, delivery pauses)
- Active app usage during claimed working hours
- Consistent shift timing aligned with historical behavior

**Spoofed user patterns:**
- Static location or unnatural coordinate jumps
- Perfect straight-line movement (no real-world variation)
- Zero app interaction during claimed "movement"
- Sudden appearance inside a high-risk zone with no travel history

> Core principle: **"We validate behavior, not just location."**

---

### 📊 2. Data Signals Analyzed (Beyond GPS)

Our system combines multiple independent data streams to build a behavioral fingerprint:

**Mobility & Sensor Data**
- Accelerometer readings (movement vs stationary)
- Speed patterns consistent with walking or bike riding
- Route consistency against known road networks

**Network Intelligence**
- Cell tower triangulation (independent location approximation)
- Network latency changes during movement
- IP address consistency checks

**Device Behavior**
- Battery consumption patterns (active device vs idle)
- Screen interaction events during claimed active period
- Background app activity signals

**Activity Data**
- App open/close frequency
- Order and interaction simulation (mock for hackathon)
- Time-in-motion vs time-idle ratio

**Environmental Correlation**
- Weather severity cross-referenced with actual user activity
- Crowd-level behavior analysis — are other verified users also active in that zone?

> Key insight: **A real worker leaves a multi-dimensional footprint. A spoofer does not.**

---

### 🧩 3. Fraud Detection Architecture

We implement a **Hybrid Detection Model**:

**Rule-Based Layer (Hackathon Implementation)**
- Sudden GPS coordinate jump → flag
- No accelerometer movement + location change → flag
- No app activity during claimed active period → flag
- Multiple users with identical patterns in same zone → flag

**ML-Based Layer (Future Scope)**
- Anomaly detection model on behavioral time-series data
- Behavioral pattern clustering to identify outliers
- Fraud ring detection — group-level anomaly scoring

This ensures fast, reliable detection now with a clear path to scalable intelligence.

---

### ⚖️ 4. UX Balance — Handling Flagged Claims Fairly

Honest workers must never be unfairly penalized. A genuine network drop in bad weather can look suspicious to a naive system. Our approach:

**If suspicious activity is detected:**
- Claim is marked "Under Review"
- User receives a clear, non-alarming notification:
  > *"We are verifying your activity due to unusual signals. This usually resolves within a few hours."*

**Fair handling options:**
- **Grace Payout** — 50% of claim paid instantly; remainder held pending review
- **Manual Review Queue** — Admin validates edge cases
- **Retry Window** — User can re-verify their location and activity within a defined window

**If fraud is confirmed:**
- Claim rejected
- Account flagged for enhanced monitoring
- Repeat offenses result in policy suspension

> Guiding principle: **"Trust first, verify smartly, penalize carefully."**

---

### 🧠 5. Fraud Ring Detection

To counter coordinated syndicate attacks:

- System monitors for clusters of users sharing:
  - Identical movement patterns
  - Synchronized claim timing
  - Same spoofed location coordinates
- When a cluster is detected, all associated claims are held and flagged:
  > *"Suspicious coordinated activity detected in this zone."*
- Admin is alerted for immediate review before any payout is processed

---

### 🧾 Anti-Spoofing Strategy Summary

| Layer                  | Approach                                      |
|------------------------|-----------------------------------------------|
| Location verification  | Multi-signal (GPS + cell tower + accelerometer) |
| Behavioral analysis    | Movement, app activity, device signals        |
| Fraud detection        | Rule-based now, ML-ready for scale            |
| Flagged claim handling | Grace payout + manual review + retry window   |
| Ring detection         | Cluster anomaly analysis                      |

> **"We don't trust location — we trust behavior."**

---

## 🎯 Impact & Outcomes

- Income protection for gig workers during uncontrollable disruptions
- Fair dual-outcome system — payout for victims, rewards for the resilient
- Financial stability and predictability for daily earners
- Encourages productivity even in adverse conditions
- Scalable, fraud-resistant architecture for the gig economy

---

## 🚀 Future Scope

- Real platform API integration (Swiggy, Zomato)
- Advanced ML models for risk and fraud detection
- Multi-language support
- Voice assistant for low-literacy users
- Expansion to other gig worker categories (cab drivers, freelancers)

---

## 🏆 Pitch

> **"SurakshaSetu AI protects delivery partners when they can't work — and rewards them when they still do."**
