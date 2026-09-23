const CURRENT_CUSTOMER = "Aayush Subedi";

// Same pattern as my-bookings.js / my-profile.js: prefer whatever is
// saved in localStorage (which is what admin edits update), and only
// fall back to the sample BOOKINGS from data.js if nothing is saved.
function getBookings() {

    const savedBookings =
        JSON.parse(
            localStorage.getItem("rentoBookings")
        );

    if (
        savedBookings &&
        Array.isArray(savedBookings)
    ) {

        return savedBookings;

    }

    if (typeof BOOKINGS !== "undefined") {

        return BOOKINGS;

    }

    return [];

}

const customerBookings = getBookings().filter(function (booking) {
    return booking.customer === CURRENT_CUSTOMER;
});

const upcomingBookings = customerBookings.filter(function (booking) {
    return booking.status === "confirmed" ||
        booking.status === "pending";
});
const activeBookings = customerBookings.filter(function (booking) {
    return booking.status === "active";
});
const completedBookings = customerBookings.filter(function (booking) {
    return booking.status === "completed";
});
const cancelledBookings = customerBookings.filter(function (booking) {
    return booking.status === "cancelled";
});

document.getElementById("upcoming-count").textContent =
    upcomingBookings.length;
document.getElementById("active-count").textContent =
    activeBookings.length;
document.getElementById("completed-count").textContent =
    completedBookings.length;
document.getElementById("cancelled-count").textContent =
    cancelledBookings.length;

const recentBookingBox =
    document.getElementById("recent-booking");


if (customerBookings.length === 0) {

    recentBookingBox.innerHTML = `
        <div class="empty-booking">
            <h3>No bookings yet</h3>
            <p>
                You haven't made any vehicle bookings yet.
            </p>
            <a href="browse-vehicles.html" class="btn">
                Browse Vehicles
            </a>
        </div>
    `;

} else {

    // Sort bookings by ID so the latest booking appears first
    const recentBooking = [...customerBookings].sort(function (a, b) {
        return b.id - a.id;
    })[0];
    recentBookingBox.innerHTML = `
        <div class="booking-main">
            <div>
                <span class="booking-number">
                    Booking #${recentBooking.id}
                </span>
                <h3>
                    ${recentBooking.vehicle}
                </h3>
            </div>
            <span class="status status-${recentBooking.status}">
                ${recentBooking.status}
            </span>
        </div>

        <div class="booking-details">
            <div>
                <span class="booking-label">
                    Pick-up
                </span>
                <strong>
                    ${formatDate(recentBooking.start)}
                </strong>
            </div>

            <div>
                <span class="booking-label">
                    Return
                </span>
                <strong>
                    ${formatDate(recentBooking.end)}
                </strong>
            </div>

            <div>
                <span class="booking-label">
                    Total
                </span>
                <strong>
                    ${money(recentBooking.total)}
                </strong>
            </div>
        </div>

        <div class="booking-actions">
            <a href="booking-details.html?id=${recentBooking.id}"
            class="btn btn-small">
                View booking
            </a>
        </div>
    `;
}

const vehicleContainer =
    document.getElementById("customer-vehicles");
// Only show vehicles that are currently available
const availableVehicles = VEHICLES
    .filter(function (vehicle) {
        return vehicle.status === "available";
    })
    .slice(0, 3);

function customerVehicleCard(vehicle) {
    return `
        <div class="vehicle-card">
            <div class="vc-header">
                <div>
                    <span class="vc-name">
                        ${vehicle.name}
                    </span>
                    <span class="vc-subtitle">
                        or similar ${vehicle.category}
                    </span>
                </div>
            </div>

            <div class="vc-specs">
                <span>
                    ⚙️ ${vehicle.transmission}
                </span>
                <span>
                    👤 ${vehicle.seats}
                </span>
                <span>
                    ❄️ A/C
                </span>
            </div>

            <div class="vc-body">
    ${vehiclePictureHTML(
        {
            ...vehicle,
            image: "../public/" + vehicle.image
        },
        "vc-photo"
    )}

    <div class="vc-price-block">
        <div class="vc-price">
            ${money(vehicle.pricePerDay)}
        </div>
        <div class="vc-price-sub">
            per day
        </div>
    </div>
</div>

            <div class="vc-rating-row">
                <div class="vc-rating-score">
                    ${vehicle.rating.toFixed(1)} ★
                </div>
                <div class="vc-rating-label">
                    ${ratingLabel(vehicle.rating)}
                </div>
            </div>

            <button
                class="vc-book-btn"
                onclick="bookVehicle(${vehicle.id})">
                Book now
            </button>

        </div>
    `;
}
if (availableVehicles.length === 0) {
    vehicleContainer.innerHTML = `
        <p>No vehicles are currently available.</p>
    `;
} else {
    availableVehicles.forEach(function (vehicle) {
        vehicleContainer.innerHTML +=
            customerVehicleCard(vehicle);
    });
}
function bookVehicle(vehicleId) {
    window.location.href =
        "vehicle-details.html?id=" + vehicleId;
}
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric"
    });
}