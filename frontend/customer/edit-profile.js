// =========================================
// EDIT PROFILE
// =========================================


// DEFAULT CUSTOMER
const DEFAULT_CUSTOMER = {
    name: "Aayush Subedi",
    email: "aayush@gmail.com",
    phone: "",
    password: ""
};


// =========================================
// GET SAVED PROFILE
// =========================================

let customerProfile =
    JSON.parse(localStorage.getItem("rentoCustomerProfile"));


// If profile doesn't exist, create one
if (!customerProfile) {

    customerProfile = {
        ...DEFAULT_CUSTOMER
    };

    localStorage.setItem(
        "rentoCustomerProfile",
        JSON.stringify(customerProfile)
    );
}


// =========================================
// GET FORM ELEMENTS
// =========================================

const editProfileForm =
    document.getElementById("edit-profile-form");

const editName =
    document.getElementById("edit-name");

const editEmail =
    document.getElementById("edit-email");

const editPhone =
    document.getElementById("edit-phone");

const editPassword =
    document.getElementById("edit-password");

const editConfirmPassword =
    document.getElementById("edit-confirm-password");

const profileMessage =
    document.getElementById("profile-message");


// =========================================
// DISPLAY CURRENT INFORMATION
// =========================================

editName.value =
    customerProfile.name || "";

editEmail.value =
    customerProfile.email || "";

editPhone.value =
    customerProfile.phone || "";


// =========================================
// SAVE PROFILE
// =========================================

editProfileForm.addEventListener("submit", function (event) {

    event.preventDefault();


    // Get values
    const name =
        editName.value.trim();

    const email =
        editEmail.value.trim();

    const phone =
        editPhone.value.trim();

    const password =
        editPassword.value;

    const confirmPassword =
        editConfirmPassword.value;


    // =========================================
    // VALIDATION
    // =========================================

    if (name === "") {

        showMessage(
            "Please enter your full name.",
            "error"
        );

        editName.focus();

        return;
    }


    if (email === "") {

        showMessage(
            "Please enter your email address.",
            "error"
        );

        editEmail.focus();

        return;
    }


    // =========================================
    // PASSWORD VALIDATION
    // =========================================

    if (password !== "" || confirmPassword !== "") {

        if (password !== confirmPassword) {

            showMessage(
                "Passwords do not match.",
                "error"
            );

            editConfirmPassword.focus();

            return;
        }


        if (password.length < 6) {

            showMessage(
                "Password must be at least 6 characters.",
                "error"
            );

            editPassword.focus();

            return;
        }

    }


    // =========================================
    // UPDATE PROFILE
    // =========================================

    customerProfile.name = name;

    customerProfile.email = email;

    customerProfile.phone = phone;


    // Only change password if a new one was entered
    if (password !== "") {

        customerProfile.password = password;

    }


    // =========================================
    // SAVE TO LOCAL STORAGE
    // =========================================

    localStorage.setItem(
        "rentoCustomerProfile",
        JSON.stringify(customerProfile)
    );


    // =========================================
    // SUCCESS MESSAGE
    // =========================================

    showMessage(
        "Profile updated successfully!",
        "success"
    );


    // =========================================
    // REDIRECT
    // =========================================

    setTimeout(function () {

        window.location.href =
            "my-profile.html";

    }, 1000);

});


// =========================================
// MESSAGE FUNCTION
// =========================================

function showMessage(message, type) {

    profileMessage.textContent =
        message;

    profileMessage.className =
        "profile-message " + type;

}