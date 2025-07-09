import api from "./api";
const register = (username, email, password) =>
  api.post("/auth/signup", { username, email, password });
const login = (username, password) => {
  return api.post("/auth/signin", { username, password }).then((response) => {
    if (response.data.token) {
      localStorage.setItem("user", JSON.stringify(response.data));
    }
    return response.data;
  });
};
const logout = () => localStorage.removeItem("user");
const getCurrentUser = () => JSON.parse(localStorage.getItem("user"));
const AuthService = { register, login, logout, getCurrentUser };
export default AuthService;
