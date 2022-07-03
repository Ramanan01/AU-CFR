export default function authHeader() {
  const user = JSON.parse(localStorage.getItem("user"));

  if (user && user.tokenString) {
    return { "tokenString": user.tokenString };
  } else {
    return {};
  }
}
