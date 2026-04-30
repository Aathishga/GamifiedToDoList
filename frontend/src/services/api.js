import axios from "axios";

// 🔧 Base API instance
const API = axios.create({
  baseURL: "http://localhost:5000/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// Add a request interceptor to attach token
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// 🧠 Global error handler (optional but useful)
const handleError = (error) => {
  console.error("API Error:", error.response?.data || error.message);
  throw error;
};

// ✅ Complete Task
export const completeTask = async (taskId) => {
  try {
    const res = await API.put(`/tasks/${taskId}/complete`);
    return res.data;
  } catch (error) {
    handleError(error);
  }
};

// ✅ Get All Tasks
export const getTasks = async () => {
  try {
    const res = await API.get("/tasks");
    return res.data;
  } catch (error) {
    handleError(error);
  }
};

// ✅ Create Task
export const createTask = async (task) => {
  try {
    const res = await API.post("/tasks", task);
    return res.data;
  } catch (error) {
    handleError(error);
  }
};

// 🎭 Update Mood
export const updateMood = async (mood) => {
  try {
    const res = await API.put("/users/mood", { mood });
    return res.data;
  } catch (error) {
    handleError(error);
  }
};

// ⚔️ Update Role
export const updateRole = async (role) => {
  try {
    const res = await API.put("/users/role", { role });
    return res.data;
  } catch (error) {
    handleError(error);
  }
};

// ⚔️ Complete Sub-Step
export const completeSubStep = async (taskId, subStepIndex) => {
  try {
    const res = await API.put(`/tasks/${taskId}/substep`, { subStepIndex });
    return res.data;
  } catch (error) {
    handleError(error);
  }
};

// 🎒 Consume Item
export const consumeItem = async (itemId) => {
  try {
    const res = await API.post("/users/use-item", { itemId });
    return res.data;
  } catch (error) {
    handleError(error);
  }
};

// 🧬 Get User DNA
export const getUserDNA = async () => {
  try {
    const res = await API.get("/users/dna");
    return res.data;
  } catch (error) {
    handleError(error);
  }
};

// ❗ Mark Task as Missed
export const markAsMissed = async (taskId, reason) => {
  try {
    const res = await API.put(`/tasks/${taskId}/missed`, { reason });
    return res.data;
  } catch (error) {
    handleError(error);
  }
};

// 📊 Reports
export const getDailyReport = async () => {
  try {
    const res = await API.get("/reports/daily");
    return res.data;
  } catch (error) {
    handleError(error);
  }
};

export const getWeeklyReport = async () => {
  try {
    const res = await API.get("/reports/weekly");
    return res.data;
  } catch (error) {
    handleError(error);
  }
};

export const getMissedAnalysis = async () => {
  try {
    const res = await API.get("/reports/analysis/missed");
    return res.data;
  } catch (error) {
    handleError(error);
  }
};

// 🎭 Update Avatar
export const updateAvatar = async (avatar) => {
  try {
    const res = await API.put("/users/avatar", { avatar });
    return res.data;
  } catch (error) {
    handleError(error);
  }
};

// 🗑️ Delete Task
export const deleteTask = async (taskId) => {
  try {
    const res = await API.delete(`/tasks/${taskId}`);
    return res.data;
  } catch (error) {
    handleError(error);
  }
};

// 🏪 Buy Item from Shop
export const buyItem = async (itemId) => {
  try {
    const res = await API.post("/users/buy-item", { itemId });
    return res.data;
  } catch (error) {
    handleError(error);
  }
};
