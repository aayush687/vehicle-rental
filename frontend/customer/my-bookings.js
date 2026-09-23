/* =========================================
   MY BOOKINGS
========================================= */


/* =========================================
   GET ELEMENTS
========================================= */

const bookingsList =
    document.getElementById("bookings-list");

const emptyBookings =
    document.getElementById("empty-bookings");


/* =========================================
   GET BOOKINGS
========================================= */

let bookings =
    JSON.parse(localStorage.getItem("rentoBookings")) || [];


/* =========================================
   DISPLAY BOOKINGS
========================================= */

function displayBookings() {

    bookingsList.innerHTML = "";


    /* No bookings */

    if (bookings.length === 0) {

        bookingsList.style.display = "none";

        emptyBookings.style.display = "block";

        return;
    }


    bookingsList.style.display = "grid";

    emptyBookings.style.display = "none";


    /* Newest booking first */

    bookings
        .slice()
        .reverse()
        .forEach(booking => {

            const card =
                createBookingCard(booking);

            bookingsList.appendChild(card);

        });

}


/* =========================================
   CREATE BOOKING CARD
========================================= */

function createBookingCard(booking) {

    const card =
        document.createElement("div");

    card.className =
        "my-booking-card";


    /* Find vehicle */

    let vehicle = null;

    if (typeof VEHICLES !== "undefined") {

        vehicle = VEHICLES.find(
            item =>
                Number(item.id) ===
                Number(booking.vehicleId)
        );

    }


    /* Vehicle image */

    let vehicleImage = "";

    if (vehicle && vehicle.image) {

        vehicleImage = `
            <img
                src="../public/${vehicle.image}"
                alt="${vehicle.name}"
                class="my-booking-image"
            >
        `;

    } else {

        vehicleImage = `
            <div class="my-booking-image-placeholder">
                🚗
            </div>
        `;

    }


    /* Status */

    const status =
        booking.status || "pending";


    card.innerHTML = `

        <div class="my-booking-top">

            ${vehicleImage}

            <div class="my-booking-main">

                <div class="my-booking-title-row">

                    <div>

                        <h2>
                            ${booking.vehicle || "Vehicle"}
                        </h2>

                        <p>
                            Booking #${booking.id}
                        </p>

                    </div>

                    <span
                        class="booking-status ${status}">
                        ${capitalize(status)}
                    </span>

                </div>


                <div class="my-booking-info">

                    <div>

                        <span class="booking-info-label">
                            Pickup
                        </span>

                        <strong>
                            ${formatDate(booking.start)}
                        </strong>

                    </div>


                    <div>

                        <span class="booking-info-label">
                            Return
                        </span>

                        <strong>
                            ${formatDate(booking.end)}
                        </strong>

                    </div>


                    <div>

                        <span class="booking-info-label">
                            Location
                        </span>

                        <strong>
                            ${booking.location || "Not specified"}
                        </strong>

                    </div>


                    <div>

                        <span class="booking-info-label">
                            Total
                        </span>

                        <strong>
                            ${formatMoney(booking.total)}
                        </strong>

                    </div>

                </div>


                <div class="my-booking-actions">

                    <button
                        class="view-booking-btn"
                        onclick="viewBooking(${booking.id})">

                        View Details

                    </button>


                    ${
                        status === "pending"
                        ? `
                            <button
                                class="cancel-booking-btn"
                                onclick="cancelBooking(${booking.id})">

                                Cancel Booking

                            </button>
                        `
                        : ""
                    }

                </div>

            </div>

        </div>

    `;


    return card;
}


/* =========================================
   VIEW BOOKING
========================================= */

function viewBooking(id) {

    window.location.href =
    "booking-details.html?id=" + id;

}


/* =========================================
   CANCEL BOOKING
========================================= */

function cancelBooking(id) {

    const booking =
        bookings.find(
            item => Number(item.id) === Number(id)
        );


    if (!booking) {
        return;
    }


    /* Confirm cancellation */

    const confirmCancel =
        confirm(
            "Are you sure you want to cancel this booking?"
        );


    if (!confirmCancel) {
        return;
    }


    /* Change status */

    booking.status = "cancelled";


    /* Save */

    localStorage.setItem(
        "rentoBookings",
        JSON.stringify(bookings)
    );


    /* Refresh */

    displayBookings();

}


/* =========================================
   FORMAT DATE
========================================= */

function formatDate(dateString) {

    if (!dateString) {
        return "---";
    }

    const date =
        new Date(dateString);


    return date.toLocaleDateString(
        "en-US",
        {
            year: "numeric",
            month: "short",
            day: "numeric"
        }
    );

}


/* =========================================
   FORMAT MONEY
========================================= */

function formatMoney(amount) {

    if (typeof money === "function") {

        return money(amount);

    }


    return "Rs. " +
        Number(amount || 0).toLocaleString();

}


/* =========================================
   CAPITALIZE
========================================= */

function capitalize(text) {

    if (!text) {
        return "";
    }

    return text.charAt(0).toUpperCase()
        + text.slice(1);

}


/* =========================================
   INITIAL LOAD
========================================= */

displayBookings();