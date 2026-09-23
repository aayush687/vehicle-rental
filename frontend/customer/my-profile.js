// =========================================
// CUSTOMER PROFILE
// =========================================


// =========================================
// DEFAULT CUSTOMER INFORMATION
// =========================================

const DEFAULT_CUSTOMER = {

    name: "Ram Thapa",

    email: "ram@gmail.com",

    phone: "9876543210"

};


// =========================================
// GET SAVED PROFILE
// =========================================

let customerProfile =
    JSON.parse(
        localStorage.getItem("rentoCustomerProfile")
    );


// If no profile has been saved yet,
// create the default demo profile.

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
// DISPLAY PROFILE
// =========================================

document.getElementById("profile-name").textContent =
    customerProfile.name;

document.getElementById("profile-full-name").textContent =
    customerProfile.name;

document.getElementById("profile-email").textContent =
    customerProfile.email;

document.getElementById("profile-phone").textContent =
    customerProfile.phone || "Not added";


// =========================================
// PROFILE AVATAR
// =========================================

const avatar =
    document.querySelector(".profile-avatar");


// Create initials from name

const nameParts =
    customerProfile.name
        .trim()
        .split(" ");

let initials = "";

if (nameParts.length >= 2) {

    initials =
        nameParts[0].charAt(0) +
        nameParts[nameParts.length - 1].charAt(0);

} else {

    initials =
        customerProfile.name
            .substring(0, 2);

}

avatar.textContent =
    initials.toUpperCase();


// =========================================
// GET BOOKINGS
// =========================================

const savedBookings =
    JSON.parse(
        localStorage.getItem("rentoBookings")
    ) || [];


// =========================================
// FILTER CUSTOMER BOOKINGS
// =========================================

const customerBookings =
    savedBookings.filter(function (booking) {

        return booking.customer ===
            customerProfile.name;

    });


// =========================================
// BOOKING COUNTS
// =========================================

const totalBookings =
    customerBookings.length;


const pendingBookings =
    customerBookings.filter(function (booking) {

        return booking.status === "pending";

    }).length;


const confirmedBookings =
    customerBookings.filter(function (booking) {

        return booking.status === "confirmed";

    }).length;


const completedBookings =
    customerBookings.filter(function (booking) {

        return booking.status === "completed";

    }).length;


// =========================================
// DISPLAY COUNTS
// =========================================

document.getElementById("total-bookings")
    .textContent = totalBookings;


document.getElementById("pending-bookings")
    .textContent = pendingBookings;


document.getElementById("confirmed-bookings")
    .textContent = confirmedBookings;


document.getElementById("completed-bookings")
    .textContent = completedBookings;