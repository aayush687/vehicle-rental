
const loginForm = document.getElementById("login-form");
const togglePassword = document.getElementById("toggle-password");
const passwordInput = document.getElementById("password");
loginForm.addEventListener("submit", function (event) {
    event.preventDefault();
    const email = document.getElementById("email");
    const password = passwordInput;
    const role = document.getElementById("role").value;
    let isValid = true;
    if (!email.value.includes("@")) {
    document.getElementById("email-error").style.display = "block";
    isValid = false;
    } else {
    document.getElementById("email-error").style.display = "none";
    }
    if (password.value.length === 0) {
    document.getElementById("password-error").style.display = "block";
    isValid = false;
    } else {
    document.getElementById("password-error").style.display = "none";
    }
    if (!isValid) {
    return;
    }
    if (role === "staff") {
    window.location.href = "../admin/dashboard.html";
    } else {
    window.location.href = "../customer/dashboard.html";
    }
});