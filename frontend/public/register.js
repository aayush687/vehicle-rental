
const registerForm = document.getElementById("register-form");

registerForm.addEventListener("submit", function (event) {
    event.preventDefault();
    const name = document.getElementById("name");
    const email = document.getElementById("email");
    const phone = document.getElementById("phone");
    const password = document.getElementById("password");
    let isValid = true;
    if (name.value.trim().length === 0) {
    document.getElementById("name-error").style.display = "block";
    isValid = false;
    } else {
    document.getElementById("name-error").style.display = "none";
    }
    if (!email.value.includes("@")) {
    document.getElementById("email-error").style.display = "block";
    isValid = false;
    } else {
    document.getElementById("email-error").style.display = "none";
    }
    if (!/^\d{7,15}$/.test(phone.value.trim())) {
    document.getElementById("phone-error").style.display = "block";
    isValid = false;
    } else {
    document.getElementById("phone-error").style.display = "none";
    }
    if (password.value.length < 8) {
    document.getElementById("password-error").style.display = "block";
    isValid = false;
    } else {
    document.getElementById("password-error").style.display = "none";
    }
    if (!isValid) {
    return;
    }

    showToast("Account created. Redirecting to login...");
    setTimeout(function () {
    window.location.href = "login.html";
    }, 1200);
});
