// =========================================
// CUSTOMER BOOKING PAGE
// =========================================


// =========================================
// GET VEHICLE ID
// =========================================

const urlParams = new URLSearchParams(
    window.location.search
);

const vehicleId = Number(
    urlParams.get("id")
);


// =========================================
// GET VEHICLES
// (same pattern used elsewhere: prefer whatever
//  admin has saved in localStorage, and only fall
//  back to the sample VEHICLES from data.js)
// =========================================

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


// =========================================
// FIND VEHICLE
// =========================================

const vehicle = getVehicles().find(function (vehicle) {

    return vehicle.id === vehicleId;

});


// =========================================
// GET ELEMENTS
// =========================================

const selectedVehicle =
    document.getElementById("selected-vehicle");

const bookingSummary =
    document.getElementById("booking-summary");

const pickupDate =
    document.getElementById("pickup-date");

const returnDate =
    document.getElementById("return-date");

const pickupLocation =
    document.getElementById("pickup-location");

const specialRequest =
    document.getElementById("special-request");

const customerName =
    document.getElementById("customer-name");

const customerPhone =
    document.getElementById("customer-phone");

const customerEmail =
    document.getElementById("customer-email");

const bookingError =
    document.getElementById("booking-error");

const confirmButton =
    document.getElementById("confirm-booking");


// =========================================
// CHECK VEHICLE
// =========================================

if (!vehicle) {

    selectedVehicle.innerHTML = `

        <div class="booking-not-found">

            <h3>
                Vehicle not found
            </h3>

            <p>
                Please return to the vehicle list
                and select a vehicle.
            </p>

            <a
                href="browse-vehicles.html"
                class="btn"
            >
                Browse Vehicles
            </a>

        </div>

    `;

    confirmButton.disabled = true;

} else {

    displaySelectedVehicle();

    displaySummary();

}


// =========================================
// DISPLAY SELECTED VEHICLE
// =========================================

function displaySelectedVehicle() {

    selectedVehicle.innerHTML = `

        <div class="selected-vehicle-image">

            <img
                src="../public/${vehicle.image}"
                alt="${vehicle.name}"
            >

        </div>


        <div class="selected-vehicle-info">

            <span>
                ${vehicle.brand} • ${vehicle.category}
            </span>

            <h3>
                ${vehicle.name}
            </h3>

            <strong>
                ${money(vehicle.pricePerDay)}
                <small>/ day</small>
            </strong>

        </div>

    `;

}


// =========================================
// SET MINIMUM DATE
// =========================================

function getToday() {

    const today = new Date();

    const year =
        today.getFullYear();

    const month =
        String(today.getMonth() + 1)
        .padStart(2, "0");

    const day =
        String(today.getDate())
        .padStart(2, "0");

    return `${year}-${month}-${day}`;

}


const today = getToday();

pickupDate.min = today;

returnDate.min = today;


// =========================================
// CALCULATE RENTAL DAYS
// =========================================

function calculateDays() {

    if (
        !pickupDate.value ||
        !returnDate.value
    ) {

        return 0;

    }


    const start =
        new Date(pickupDate.value);

    const end =
        new Date(returnDate.value);


    const difference =
        end - start;


    const days =
        difference /
        (1000 * 60 * 60 * 24);


    return days;

}


// =========================================
// DISPLAY PRICE SUMMARY
// =========================================

function displaySummary() {

    if (!vehicle) {
        return;
    }


    const days =
        calculateDays();


    let rentalDays = days;


    if (days > 0) {

        rentalDays = days;

    } else {

        rentalDays = 0;

    }


    const subtotal =
        rentalDays *
        vehicle.pricePerDay;


    bookingSummary.innerHTML = `

        <div class="summary-vehicle">

            <span>
                Vehicle
            </span>

            <strong>
                ${vehicle.name}
            </strong>

        </div>


        <div class="summary-row">

            <span>
                Price per day
            </span>

            <span>
                ${money(vehicle.pricePerDay)}
            </span>

        </div>


        <div class="summary-row">

            <span>
                Rental days
            </span>

            <span>
                ${rentalDays}
            </span>

        </div>


        <div class="summary-divider"></div>


        <div class="summary-total">

            <span>
                Total
            </span>

            <strong>
                ${money(subtotal)}
            </strong>

        </div>


        <p class="summary-note">
            Final price may include additional
            charges depending on the booking.
        </p>

    `;

}


// =========================================
// DATE VALIDATION
// =========================================

function validateDates() {

    bookingError.textContent = "";


    if (!pickupDate.value) {

        bookingError.textContent =
            "Please select a pick-up date.";

        return false;

    }


    if (!returnDate.value) {

        bookingError.textContent =
            "Please select a return date.";

        return false;

    }


    const days =
        calculateDays();


    if (days <= 0) {

        bookingError.textContent =
            "Return date must be after the pick-up date.";

        return false;

    }


    return true;

}


// =========================================
// UPDATE RETURN DATE MINIMUM
// =========================================

pickupDate.addEventListener(
    "change",
    function () {

        returnDate.min =
            pickupDate.value;


        if (
            returnDate.value &&
            returnDate.value <= pickupDate.value
        ) {

            returnDate.value = "";

        }


        displaySummary();

    }
);


returnDate.addEventListener(
    "change",
    function () {

        displaySummary();

    }
);


// =========================================
// CONFIRM BOOKING
// =========================================

confirmButton.addEventListener(
    "click",
    function () {

        bookingError.textContent = "";


        // Validate dates

        if (!validateDates()) {

            return;

        }


        // Validate location

        if (!pickupLocation.value) {

            bookingError.textContent =
                "Please select a pick-up location.";

            return;

        }


        // Validate phone

        if (!customerPhone.value.trim()) {

            bookingError.textContent =
                "Please enter your phone number.";

            customerPhone.focus();

            return;

        }


        // Validate email

        if (!customerEmail.value.trim()) {

            bookingError.textContent =
                "Please enter your email.";

            customerEmail.focus();

            return;

        }


        // Calculate total

        const days =
            calculateDays();

        const total =
            days *
            vehicle.pricePerDay;


        // Create booking object

        const newBooking = {
    id: Date.now(),

    customer: customerName.value.trim(),

    phone: customerPhone.value.trim(),

    email: customerEmail.value.trim(),

    vehicle: vehicle.name,

    vehicleId: vehicle.id,

    start: pickupDate.value,

    end: returnDate.value,

    location: pickupLocation.value,

    specialRequest: specialRequest.value.trim(),

    total: total,

    status: "pending"
};


        // =====================================
        // SAVE BOOKING
        // =====================================

        let savedBookings =
            JSON.parse(
                localStorage.getItem("rentoBookings")
            ) || [];


        savedBookings.push(newBooking);


        localStorage.setItem(
            "rentoBookings",
            JSON.stringify(savedBookings)
        );


        // =====================================
        // GO TO CONFIRMATION
        // =====================================

        window.location.href =
            "booking-confirmation.html?id=" +
            newBooking.id;

    }
);