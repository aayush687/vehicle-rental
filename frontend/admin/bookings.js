/* =========================================
   ADMIN — MANAGE BOOKINGS
========================================= */


/* =========================================
   GET ELEMENTS
========================================= */

const bookingsTableBody =
    document.getElementById("bookings-table-body");

const bookingSearchInput =
    document.getElementById("booking-search");

const bookingFilterStatus =
    document.getElementById("booking-filter-status");


/* =========================================
   GET BOOKINGS
========================================= */

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


function saveBookings(bookings) {

    localStorage.setItem(
        "rentoBookings",
        JSON.stringify(bookings)
    );

}


/* =========================================
   GET / SAVE VEHICLES
   (same storage the admin Vehicles page
    reads and writes, so status changes
    here are reflected everywhere else)
========================================= */

function getVehicles() {

    const savedVehicles =
        JSON.parse(
            localStorage.getItem("rentoVehicles")
        );

    if (
        savedVehicles &&
        Array.isArray(savedVehicles)
    ) {

        return savedVehicles;

    }

    if (typeof VEHICLES !== "undefined") {

        return VEHICLES;

    }

    return [];

}


function saveVehicles(vehicles) {

    localStorage.setItem(
        "rentoVehicles",
        JSON.stringify(vehicles)
    );

}


/* =========================================
   SYNC VEHICLE STATUS TO BOOKING STATUS

   A booking and its vehicle are two separate
   records, so changing one doesn't automatically
   change the other. This keeps them in sync:
     - confirmed  -> vehicle becomes "booked"
     - completed  -> vehicle becomes "available" (returned)
     - cancelled  -> vehicle becomes "available" (never went out)
     - pending    -> vehicle is left as-is (not
                      reserved until an admin confirms it)
========================================= */

function syncVehicleStatus(booking, newStatus) {

    const vehicles =
        getVehicles();

    const vehicle =
        vehicles.find(function (item) {

            /* Prefer matching by vehicleId
               (bookings made through the
               customer booking page have this),
               otherwise fall back to matching
               by vehicle name. */

            if (booking.vehicleId) {

                return Number(item.id) ===
                    Number(booking.vehicleId);

            }

            return item.name === booking.vehicle;

        });

    if (!vehicle) {
        return;
    }

    if (newStatus === "confirmed") {

        vehicle.status = "booked";

    } else if (
        newStatus === "completed" ||
        newStatus === "cancelled"
    ) {

        vehicle.status = "available";

    }

    saveVehicles(vehicles);

}


/* =========================================
   RENDER BOOKINGS TABLE
========================================= */

function renderBookings() {

    const bookings =
        getBookings();

    const searchTerm =
        bookingSearchInput.value
            .trim()
            .toLowerCase();

    const statusFilter =
        bookingFilterStatus.value;

    const filtered =
        bookings.filter(function (booking) {

            const customer =
                (booking.customer || "").toLowerCase();

            const vehicle =
                (booking.vehicle || "").toLowerCase();

            const matchesSearch =
                !searchTerm ||
                customer.includes(searchTerm) ||
                vehicle.includes(searchTerm);

            const status =
                booking.status || "pending";

            const matchesStatus =
                statusFilter === "all" ||
                status === statusFilter;

            return (
                matchesSearch &&
                matchesStatus
            );

        });

    bookingsTableBody.innerHTML = "";


    if (filtered.length === 0) {

        bookingsTableBody.innerHTML = `
            <tr>
                <td colspan="8" class="admin-empty">
                    No bookings found.
                </td>
            </tr>
        `;

        return;

    }


    const sorted =
        [...filtered].sort(function (a, b) {

            return Number(b.id) - Number(a.id);

        });


    sorted.forEach(function (booking) {

        const row =
            document.createElement("tr");

        const status =
            booking.status || "pending";

        row.innerHTML = `

            <td>#${escapeHTML(booking.id)}</td>

            <td>${escapeHTML(booking.customer || "Unknown")}</td>

            <td>${escapeHTML(booking.vehicle || "Unknown")}</td>

            <td>${formatDate(booking.start)}</td>

            <td>${formatDate(booking.end)}</td>

            <td>Rs. ${Number(booking.total || 0).toLocaleString("en-IN")}</td>

            <td>
                <span class="admin-status status-${escapeHTML(status)}">
                    ${formatStatus(status)}
                </span>
            </td>

            <td>
                <div class="admin-table-actions">

                    <select
                        class="admin-status-select"
                        onchange="updateBookingStatus(${booking.id}, this.value)">

                        <option value="pending" ${status === "pending" ? "selected" : ""}>Pending</option>
                        <option value="confirmed" ${status === "confirmed" ? "selected" : ""}>Confirmed</option>
                        <option value="completed" ${status === "completed" ? "selected" : ""}>Completed</option>
                        <option value="cancelled" ${status === "cancelled" ? "selected" : ""}>Cancelled</option>

                    </select>

                    <button
                        class="admin-delete-btn"
                        onclick="deleteBooking(${booking.id})">
                        Delete
                    </button>

                </div>
            </td>

        `;

        bookingsTableBody.appendChild(row);

    });

}


/* =========================================
   UPDATE BOOKING STATUS
========================================= */

function updateBookingStatus(id, newStatus) {

    const bookings =
        getBookings();

    const booking =
        bookings.find(function (item) {
            return Number(item.id) === Number(id);
        });

    if (!booking) {
        return;
    }

    booking.status = newStatus;

    saveBookings(bookings);

    syncVehicleStatus(booking, newStatus);

    renderBookings();

    if (typeof showToast === "function") {

        showToast("Booking status updated.");

    }

}


/* =========================================
   DELETE BOOKING
========================================= */

function deleteBooking(id) {

    const confirmDelete =
        confirm(
            "Are you sure you want to delete this booking?"
        );

    if (!confirmDelete) {
        return;
    }

    const bookings =
        getBookings();

    const bookingToDelete =
        bookings.find(function (item) {
            return Number(item.id) === Number(id);
        });

    const updatedBookings =
        bookings.filter(function (item) {
            return Number(item.id) !== Number(id);
        });

    saveBookings(updatedBookings);

    /* If the booking being removed had the
       vehicle reserved, free it back up. */

    if (
        bookingToDelete &&
        bookingToDelete.status === "confirmed"
    ) {

        syncVehicleStatus(bookingToDelete, "cancelled");

    }

    renderBookings();

    if (typeof showToast === "function") {

        showToast("Booking deleted.");

    }

}


/* =========================================
   FORMAT DATE
========================================= */

function formatDate(dateString) {

    if (!dateString) {
        return "-";
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
            month: "short",
            day: "numeric"
        }
    );

}


/* =========================================
   FORMAT STATUS
========================================= */

function formatStatus(status) {

    switch (String(status).toLowerCase()) {

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


/* =========================================
   ESCAPE HTML
========================================= */

function escapeHTML(value) {

    return String(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");

}


/* =========================================
   EVENT LISTENERS
========================================= */

bookingSearchInput.addEventListener("input", renderBookings);

bookingFilterStatus.addEventListener("change", renderBookings);


/* =========================================
   INITIAL LOAD
========================================= */

renderBookings();