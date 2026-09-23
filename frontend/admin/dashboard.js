/* =========================================
   ADMIN DASHBOARD
========================================= */


/* =========================================
   GET BOOKINGS
========================================= */

function getBookings() {

    const savedBookings =
        JSON.parse(
            localStorage.getItem("rentoBookings")
        );


    /*
       If customer bookings exist in
       localStorage, use them.
    */

    if (
        savedBookings &&
        Array.isArray(savedBookings)
    ) {

        return savedBookings;

    }


    /*
       Otherwise use the sample
       bookings from data.js.
    */

    if (
        typeof BOOKINGS !== "undefined"
    ) {

        return BOOKINGS;

    }


    return [];

}



/* =========================================
   LOAD VEHICLE STATISTICS
========================================= */

function loadVehicleStatistics() {

    /*
       Get vehicles from data.js
    */

    const vehicles =
        typeof VEHICLES !== "undefined"
            ? VEHICLES
            : [];


    const totalVehicles =
        vehicles.length;


    const availableVehicles =
        vehicles.filter(function (vehicle) {

            return vehicle.status === "available";

        }).length;


    /*
       Display values
    */

    document.getElementById(
        "total-vehicles"
    ).textContent =
        totalVehicles;


    document.getElementById(
        "available-vehicles"
    ).textContent =
        availableVehicles;

}



/* =========================================
   LOAD BOOKING STATISTICS
========================================= */

function loadBookingStatistics() {

    const bookings =
        getBookings();


    /*
       Total bookings
    */

    const totalBookings =
        bookings.length;


    /*
       Pending bookings
    */

    const pendingBookings =
        bookings.filter(function (booking) {

            return booking.status === "pending";

        }).length;


    /*
       Confirmed bookings
    */

    const confirmedBookings =
        bookings.filter(function (booking) {

            return booking.status === "confirmed";

        }).length;


    /*
       Completed bookings
    */

    const completedBookings =
        bookings.filter(function (booking) {

            return booking.status === "completed";

        }).length;


    /*
       Display values
    */

    document.getElementById(
        "total-bookings"
    ).textContent =
        totalBookings;


    document.getElementById(
        "pending-bookings"
    ).textContent =
        pendingBookings;


    document.getElementById(
        "confirmed-bookings"
    ).textContent =
        confirmedBookings;


    document.getElementById(
        "completed-bookings"
    ).textContent =
        completedBookings;

}



/* =========================================
   LOAD RECENT BOOKINGS
========================================= */

function loadRecentBookings() {

    const bookings =
        getBookings();


    const tableBody =
        document.getElementById(
            "recent-bookings"
        );


    tableBody.innerHTML = "";


    /*
       No bookings
    */

    if (bookings.length === 0) {

        tableBody.innerHTML = `

            <tr>

                <td
                    colspan="7"
                    class="admin-empty"
                >
                    No bookings found.
                </td>

            </tr>

        `;

        return;

    }


    /*
       Sort bookings
       newest first
    */

    const recentBookings =
        [...bookings]
            .sort(function (a, b) {

                return (
                    Number(b.id) -
                    Number(a.id)
                );

            })
            .slice(0, 5);


    /*
       Display bookings
    */

    recentBookings.forEach(function (booking) {

        const row =
            document.createElement("tr");


        const status =
            booking.status || "pending";


        row.innerHTML = `

            <td>
                #${escapeHTML(booking.id)}
            </td>

            <td>
                ${escapeHTML(
                    booking.customer ||
                    "Unknown"
                )}
            </td>

            <td>
                ${escapeHTML(
                    booking.vehicle ||
                    "Unknown"
                )}
            </td>

            <td>
                ${formatDate(
                    booking.start
                )}
            </td>

            <td>
                ${formatDate(
                    booking.end
                )}
            </td>

            <td>
                Rs.
                ${Number(
                    booking.total || 0
                ).toLocaleString("en-IN")}
            </td>

            <td>

                <span
                    class="admin-status status-${escapeHTML(status)}"
                >
                    ${formatStatus(status)}
                </span>

            </td>

        `;


        tableBody.appendChild(row);

    });

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


    if (
        isNaN(
            date.getTime()
        )
    ) {

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

    switch (
        String(status).toLowerCase()
    ) {

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

        .replace(
            /&/g,
            "&amp;"
        )

        .replace(
            /</g,
            "&lt;"
        )

        .replace(
            />/g,
            "&gt;"
        )

        .replace(
            /"/g,
            "&quot;"
        )

        .replace(
            /'/g,
            "&#039;"
        );

}



/* =========================================
   START DASHBOARD
========================================= */

loadVehicleStatistics();

loadBookingStatistics();

loadRecentBookings();