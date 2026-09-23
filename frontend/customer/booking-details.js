// =========================================
// BOOKING DETAILS
// =========================================


// =========================================
// GET BOOKING ID FROM URL
// =========================================

const urlParams =
    new URLSearchParams(window.location.search);

const bookingId =
    urlParams.get("id");


// =========================================
// GET ELEMENTS
// =========================================

const bookingCard =
    document.getElementById("booking-details-card");

const bookingError =
    document.getElementById("booking-error");


// =========================================
// GET BOOKINGS
// =========================================

const savedBookings =
    JSON.parse(localStorage.getItem("rentoBookings")) || [];


// =========================================
// FIND BOOKING
// =========================================

const booking =
    savedBookings.find(function (item) {

        return String(item.id) === String(bookingId);

    });


// =========================================
// CHECK IF BOOKING EXISTS
// =========================================

if (!booking) {

    bookingCard.style.display = "none";

    bookingError.style.display = "block";

} else {

    displayBooking(booking);

}



// =========================================
// DISPLAY BOOKING
// =========================================

function displayBooking(booking) {


    // =====================================
    // FIND VEHICLE
    // =====================================

    let vehicle = null;


    if (typeof VEHICLES !== "undefined") {

        vehicle =
            VEHICLES.find(function (item) {

                return String(item.id) ===
                    String(booking.vehicleId);

            });

    }


    // =====================================
    // VEHICLE NAME
    // =====================================

    document.getElementById(
        "booking-vehicle-name"
    ).textContent =
        booking.vehicle || "Vehicle";


    // =====================================
    // VEHICLE IMAGE
    // =====================================

    const vehicleImage =
        document.getElementById(
            "booking-vehicle-image"
        );


    if (vehicle && vehicle.image) {

        vehicleImage.src =
            "../public/" + vehicle.image;

        vehicleImage.alt =
            vehicle.name;

    } else {

        vehicleImage.style.display =
            "none";

    }


    // =====================================
    // VEHICLE PRICE
    // =====================================

    if (vehicle) {

        document.getElementById(
            "booking-vehicle-price"
        ).textContent =
            "NPR " +
            Number(vehicle.pricePerDay).toLocaleString() +
            " / day";

    } else {

        document.getElementById(
            "booking-vehicle-price"
        ).textContent =
            "Vehicle information unavailable";

    }


    // =====================================
    // BOOKING ID
    // =====================================

    document.getElementById(
        "booking-id"
    ).textContent =
        booking.id;


    // =====================================
    // LOCATION
    // =====================================

    document.getElementById(
        "booking-location"
    ).textContent =
        booking.location || "Not specified";


    // =====================================
    // START DATE
    // =====================================

    document.getElementById(
        "booking-start"
    ).textContent =
        formatDate(booking.start);


    // =====================================
    // END DATE
    // =====================================

    document.getElementById(
        "booking-end"
    ).textContent =
        formatDate(booking.end);


    // =====================================
    // TOTAL
    // =====================================

    document.getElementById(
        "booking-total"
    ).textContent =
        "NPR " +
        Number(booking.total || 0).toLocaleString();


    // =====================================
    // STATUS
    // =====================================

    const status =
        booking.status || "pending";


    const formattedStatus =
        formatStatus(status);


    document.getElementById(
        "booking-status"
    ).textContent =
        formattedStatus;


    document.getElementById(
        "booking-status-text"
    ).textContent =
        formattedStatus;


    // Add status class
    document.getElementById(
        "booking-status"
    ).className =
        "booking-status status-" + status;


    // =====================================
    // CUSTOMER NAME
    // =====================================

    document.getElementById(
        "customer-name"
    ).textContent =
        booking.customer || "Not available";


    // =====================================
    // CUSTOMER EMAIL
    // =====================================

    document.getElementById(
        "customer-email"
    ).textContent =
        booking.email || "Not available";


    // =====================================
    // CUSTOMER PHONE
    // =====================================

    document.getElementById(
        "customer-phone"
    ).textContent =
        booking.phone || "Not available";


    // =====================================
    // SPECIAL REQUEST
    // =====================================

    const specialRequest =
        document.getElementById(
            "booking-special-request"
        );


    if (
        booking.specialRequest &&
        booking.specialRequest.trim() !== ""
    ) {

        specialRequest.textContent =
            booking.specialRequest;

    } else {

        specialRequest.textContent =
            "No special request.";

    }

}



// =========================================
// FORMAT DATE
// =========================================

function formatDate(dateString) {

    if (!dateString) {
        return "Not specified";
    }


    const date =
        new Date(dateString);


    if (isNaN(date.getTime())) {
        return dateString;
    }


    return date.toLocaleDateString(
        "en-US",
        {
            year: "numeric",
            month: "long",
            day: "numeric"
        }
    );

}



// =========================================
// FORMAT STATUS
// =========================================

function formatStatus(status) {

    switch (status.toLowerCase()) {

        case "pending":
            return "Pending";

        case "confirmed":
            return "Confirmed";

        case "completed":
            return "Completed";

        case "cancelled":
            return "Cancelled";

        default:
            return status;
    }
}