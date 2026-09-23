/* =========================================
   ADMIN PROFILE
========================================= */


/* =========================================
   DEFAULT ADMIN INFORMATION
========================================= */

const DEFAULT_ADMIN = {

    name: "Admin User",

    email: "admin@rento.com",

    phone: "9800000000"

};


/* =========================================
   GET ELEMENTS
========================================= */

const adminProfileForm =
    document.getElementById("admin-profile-form");

const adminNameInput =
    document.getElementById("admin-name-input");

const adminEmailInput =
    document.getElementById("admin-email-input");

const adminPhoneInput =
    document.getElementById("admin-phone-input");

const adminPasswordInput =
    document.getElementById("admin-password-input");

const adminConfirmPasswordInput =
    document.getElementById("admin-confirm-password-input");

const adminProfileMessage =
    document.getElementById("admin-profile-message");

const adminNameLabel =
    document.querySelector(".admin-name");


/* =========================================
   GET SAVED PROFILE
========================================= */

let adminProfile =
    JSON.parse(
        localStorage.getItem("rentoAdminProfile")
    );

if (!adminProfile) {

    adminProfile = {
        ...DEFAULT_ADMIN
    };

    localStorage.setItem(
        "rentoAdminProfile",
        JSON.stringify(adminProfile)
    );

}


/* =========================================
   FILL FORM
========================================= */

function fillForm() {

    adminNameInput.value = adminProfile.name;

    adminEmailInput.value = adminProfile.email;

    adminPhoneInput.value = adminProfile.phone || "";

    adminPasswordInput.value = "";

    adminConfirmPasswordInput.value = "";

}


/* =========================================
   RESET FORM
========================================= */

function resetForm() {

    fillForm();

    adminProfileMessage.textContent = "";

    adminProfileMessage.className = "profile-message";

}


/* =========================================
   SAVE PROFILE
========================================= */

adminProfileForm.addEventListener("submit", function (event) {

    event.preventDefault();

    const newPassword =
        adminPasswordInput.value;

    const confirmPassword =
        adminConfirmPasswordInput.value;


    /* Validate password match, if the
       admin is trying to change it */

    if (
        newPassword ||
        confirmPassword
    ) {

        if (newPassword !== confirmPassword) {

            adminProfileMessage.textContent =
                "Passwords do not match.";

            adminProfileMessage.className =
                "profile-message error";

            return;

        }

    }


    adminProfile.name = adminNameInput.value.trim();

    adminProfile.email = adminEmailInput.value.trim();

    adminProfile.phone = adminPhoneInput.value.trim();


    localStorage.setItem(
        "rentoAdminProfile",
        JSON.stringify(adminProfile)
    );


    if (adminNameLabel) {

        adminNameLabel.textContent =
            adminProfile.name;

    }


    adminProfileMessage.textContent =
        "Profile updated successfully.";

    adminProfileMessage.className =
        "profile-message success";


    adminPasswordInput.value = "";

    adminConfirmPasswordInput.value = "";

});


/* =========================================
   INITIAL LOAD
========================================= */

fillForm();

if (adminNameLabel) {

    adminNameLabel.textContent =
        adminProfile.name;

}