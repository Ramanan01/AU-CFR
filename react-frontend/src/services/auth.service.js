import axios from "axios";

const API_URL = "http://localhost:9000/";

const register = (username, email, password) => {
  return axios.post(API_URL + "api/auth/signup", {
    username,
    email,
    password,
  });
};

const login = (email, password) => {
  return axios
    .post(API_URL + "api/auth/signin", {
      email,
      password,
    })
    .then((response) => {
      if (response.data.tokenString) {
        localStorage.setItem("user", JSON.stringify(response.data));
      }

      return response.data;
    });
};

const logout = () => {
  localStorage.removeItem("user");
};

export default {
  register,
  login,
  logout,
};
