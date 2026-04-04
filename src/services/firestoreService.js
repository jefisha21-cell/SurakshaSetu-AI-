// Local storage based service — no Firestore/network needed

const key = (collection, uid) => `${collection}_${uid}`;

export const createUserProfile = async (uid, phone, profileData) => {
  const data = { uid, phone, ...profileData, avgWeeklyIncome: Number(profileData.avgWeeklyIncome) };
  localStorage.setItem(key("users", uid), JSON.stringify(data));
};

export const getUserProfile = async (uid) => {
  const raw = localStorage.getItem(key("users", uid));
  return raw ? JSON.parse(raw) : null;
};

export const checkUserExists = async (uid) => {
  return !!localStorage.getItem(key("users", uid));
};

export const saveUserPolicy = async (uid, planType) => {
  const plans = { basic: { weeklyPremium: 50, coverageAmount: 1500 }, premium: { weeklyPremium: 90, coverageAmount: 2500 } };
  const data = { uid, planType, ...plans[planType], status: "active" };
  localStorage.setItem(key("policies", uid), JSON.stringify(data));
};

export const getUserPolicy = async (uid) => {
  const raw = localStorage.getItem(key("policies", uid));
  return raw ? JSON.parse(raw) : null;
};
