// Mock auth — no Firebase phone/anonymous auth needed
// Uses localStorage to persist a fake uid across refreshes

const MOCK_OTP = "123456";

const getOrCreateUid = (phone) => {
  const key = `uid_${phone}`;
  let uid = localStorage.getItem(key);
  if (!uid) {
    uid = "user_" + Math.random().toString(36).slice(2, 10);
    localStorage.setItem(key, uid);
  }
  return uid;
};

export const sendOtp = async (phoneNumber) => {
  await new Promise((r) => setTimeout(r, 700));
  return { phone: phoneNumber };
};

export const confirmOtp = async (_confirmation, code, phone) => {
  if (code !== MOCK_OTP) throw new Error("Invalid OTP");
  const uid = getOrCreateUid(phone);
  const user = { uid, phone };
  localStorage.setItem("currentUser", JSON.stringify(user));
  return user;
};

export const logoutUser = async () => {
  localStorage.removeItem("currentUser");
};

export const getCurrentUser = () => {
  const u = localStorage.getItem("currentUser");
  return u ? JSON.parse(u) : null;
};
