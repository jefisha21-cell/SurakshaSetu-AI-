const API_KEY = import.meta.env.VITE_WEATHER_API_KEY;
const BASE = "https://api.openweathermap.org/data/2.5";

export const getWeather = async (city) => {
  const res = await fetch(`${BASE}/weather?q=${encodeURIComponent(city)}&appid=${API_KEY}&units=metric`);
  if (!res.ok) throw new Error("Weather unavailable");
  return res.json();
};

// Returns a disruption alert based on weather conditions
export const getDisruptionAlert = (weather) => {
  const id = weather?.weather?.[0]?.id;
  const wind = weather?.wind?.speed;
  const temp = weather?.main?.temp;

  if (!id) return null;

  if (id >= 200 && id < 300) return { level: "high", msg: "⛈️ Thunderstorm alert — avoid outdoor work", color: "#b71c1c" };
  if (id >= 300 && id < 400) return { level: "low", msg: "🌦️ Light drizzle — take care on roads", color: "#e65100" };
  if (id >= 500 && id < 600) return { level: "high", msg: "🌧️ Heavy rain — work disruption likely", color: "#b71c1c" };
  if (id >= 600 && id < 700) return { level: "medium", msg: "❄️ Snow conditions — outdoor work affected", color: "#1565c0" };
  if (id >= 700 && id < 800) return { level: "medium", msg: "🌫️ Poor visibility — travel with caution", color: "#4527a0" };
  if (wind > 10) return { level: "medium", msg: "💨 Strong winds — secure equipment", color: "#e65100" };
  if (temp > 40) return { level: "medium", msg: "🌡️ Extreme heat — limit outdoor exposure", color: "#bf360c" };

  return { level: "none", msg: "✅ Clear conditions — safe to work", color: "#2e7d32" };
};
