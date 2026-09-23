/* =========================================
   ADMIN — MANAGE CUSTOMERS

   There is no separate customer database yet,
   so the customer list is built from everyone
   who appears in the bookings, plus the saved
   customer profile (if one exists). Once the
   Java backend is ready this can be replaced
   with a real /api/customers fetch().
========================================= */


/* =========================================
   GET ELEMENTS
========================================= */

const customersTableBody =
    document.getElementById("customers-table-body");

const customerSearchInput =
    document.getElementById("customer-search");


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


/* =========================================
   BUILD CUSTOMER LIST FROM BOOKINGS
========================================= */

function buildCustomerList() {

    const bookings =
        getBookings();

    const customerMap = {};


    bookings.forEach(function (booking) {

        const name =
            booking.customer || "Unknown";

        if (!customerMap[name]) {

            customerMap[name] = {
                name: name,
                email: booking.email || "-",
                phone: booking.phone || "-",
                totalBookings: 0,
                totalSpent: 0
            };

        }

        customerMap[name].totalBookings += 1;

        customerMap[name].totalSpent +=
            Number(booking.total || 0);


        /* Fill in contact details if this
           booking has them and an earlier
           one for the same customer didn't. */

        if (
            booking.email &&
            customerMap[name].email === "-"
        ) {

            customerMap[name].email = booking.email;

        }

        if (
            booking.phone &&
            customerMap[name].phone === "-"
        ) {

            customerMap[name].phone = booking.phone;

        }

    });


    /* Include the saved customer profile too,
       in case they haven't booked anything yet. */

    const savedProfile =
        JSON.parse(
            localStorage.getItem("rentoCustomerProfile")
        );

    if (
        savedProfile &&
        !customerMap[savedProfile.name]
    ) {

        customerMap[savedProfile.name] = {
            name: savedProfile.name,
            email: savedProfile.email || "-",
            phone: savedProfile.phone || "-",
            totalBookings: 0,
            totalSpent: 0
        };

    }


    return Object.values(customerMap);

}


/* =========================================
   RENDER CUSTOMERS TABLE
========================================= */

function renderCustomers() {

    const customers =
        buildCustomerList();

    const searchTerm =
        customerSearchInput.value
            .trim()
            .toLowerCase();

    const filtered =
        customers.filter(function (customer) {

            return (
                !searchTerm ||
                customer.name.toLowerCase().includes(searchTerm) ||
                customer.email.toLowerCase().includes(searchTerm)
            );

        });

    customersTableBody.innerHTML = "";


    if (filtered.length === 0) {

        customersTableBody.innerHTML = `
            <tr>
                <td colspan="5" class="admin-empty">
                    No customers found.
                </td>
            </tr>
        `;

        return;

    }


    const sorted =
        [...filtered].sort(function (a, b) {

            return b.totalBookings - a.totalBookings;

        });


    sorted.forEach(function (customer) {

        const row =
            document.createElement("tr");

        row.innerHTML = `

            <td>
                <div class="admin-customer-name">

                    <div class="admin-customer-avatar">
                        ${escapeHTML(getInitials(customer.name))}
                    </div>

                    <span>${escapeHTML(customer.name)}</span>

                </div>
            </td>

            <td>${escapeHTML(customer.email)}</td>

            <td>${escapeHTML(customer.phone)}</td>

            <td>${customer.totalBookings}</td>

            <td>Rs. ${customer.totalSpent.toLocaleString("en-IN")}</td>

        `;

        customersTableBody.appendChild(row);

    });

}


/* =========================================
   GET INITIALS
========================================= */

function getInitials(name) {

    const parts =
        String(name)
            .trim()
            .split(" ");

    if (parts.length >= 2) {

        return (
            parts[0].charAt(0) +
            parts[parts.length - 1].charAt(0)
        ).toUpperCase();

    }

    return name.substring(0, 2).toUpperCase();

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

customerSearchInput.addEventListener("input", renderCustomers);


/* =========================================
   INITIAL LOAD
========================================= */

renderCustomers();