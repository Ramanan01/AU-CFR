import axios from "axios";

const API_URL = "http://localhost:8080/";

const register = (username, email, password) => {
  return axios.post(API_URL + "signup", {
    username,
    email,
    password,
  },
  {headers: {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin' : 'http://localhost:8081'}}
  );
};

const login = (email, password) => {
  return axios
    .post(API_URL + "signin", {
      email,
      password,
    },
    {headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin' : 'http://localhost:8081'}})
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
