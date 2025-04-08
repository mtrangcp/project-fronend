let account = JSON.parse(localStorage.getItem("proUsers")) || [];
let statusLogin = localStorage.getItem("proRememberMe");

if (statusLogin) {
    window.location.href = "../index.html";

} else {
    window.location.href = "../pages/login.html";
}
























