// Same pattern used elsewhere: prefer whatever admin has saved in
// localStorage, and only fall back to the sample VEHICLES from
// data.js if nothing has been saved yet.
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

const urlParams = new URLSearchParams(
    window.location.search
);
const vehicleId = Number(
    urlParams.get("id")
);

const vehicle = getVehicles().find(function (vehicle) {
    return vehicle.id === vehicleId;
});

const detailsContainer =
    document.getElementById("vehicle-details");

if (!vehicle) {
    detailsContainer.innerHTML = `
        <div class="vehicle-not-found">
            <h2>
                Vehicle not found
            </h2>
            <p>
                The vehicle you are looking for
                does not exist.
            </p>
            <a
                href="browse-vehicles.html"
                class="btn"
            >
                Browse Vehicles
            </a>
        </div>
    `;
} else {
    displayVehicle(vehicle);
}

// Display vehicle

function displayVehicle(vehicle) {

    let imageHTML = "";
    if (vehicle.image) {
        imageHTML = `
            <img
                src="../public/${vehicle.image}"
                alt="${vehicle.name}"
                class="vehicle-details-image"
            >
        `;
    } else {
        imageHTML = `
            <div class="vehicle-image-placeholder">
                🚗
            </div>
        `;
    }

    // Availability
    let availabilityText = "";
    if (vehicle.status === "available") {
        availabilityText = "Available";
    } else if (vehicle.status === "booked") {
        availabilityText = "Currently Booked";
    } else if (vehicle.status === "maintenance") {
        availabilityText = "Under Maintenance";
    }

    // Book button
    let bookButton = "";
    if (vehicle.status === "available") {
        bookButton = `
            <button
                class="btn vehicle-book-button"
                onclick="bookVehicle(${vehicle.id})"
            >
                Book Now
            </button>
        `;
    } else {
        bookButton = `
            <button
                class="btn vehicle-book-button"
                disabled
            >
                Not Available
            </button>
        `;
    }

    // =====================================
    // COMPLETE HTML
    // =====================================
    detailsContainer.innerHTML = `
        <div class="vehicle-details-card">
            <!-- =============================
                IMAGE
            ============================== -->
            <div class="vehicle-details-image-container">
                ${imageHTML}
            </div>

            <!-- =============================
                INFORMATION
            ============================== -->
            <div class="vehicle-details-information">
                <div class="vehicle-details-heading">
                    <div>
                        <p class="vehicle-details-category">
                            ${vehicle.brand}
                            •
                            ${vehicle.category}
                        </p>
                        <h1>
                            ${vehicle.name}
                        </h1>
                    </div>
                    <span
                        class="
                            status
                            status-${vehicle.status}
                        "
                    >
                        ${availabilityText}
                    </span>
                </div>

                <!-- Rating -->
                <div class="vehicle-details-rating">
                    <strong>
                        ${vehicle.rating.toFixed(1)}
                    </strong>
                    <span>
                        ★
                    </span>
                    <span>
                        Customer rating
                    </span>
                </div>

                <!-- Price -->
                <div class="vehicle-details-price">
                    <strong>
                        ${money(vehicle.pricePerDay)}
                    </strong>
                    <span>
                        / day
                    </span>
                </div>

                <!-- =========================
                    SPECIFICATIONS
                ========================== -->
                <div class="vehicle-details-specs">
                    <div class="detail-spec">
                        <span class="detail-spec-label">
                            Transmission
                        </span>
                        <strong>
                            ${vehicle.transmission}
                        </strong>
                    </div>

                    <div class="detail-spec">
                        <span class="detail-spec-label">
                            Seats
                        </span>
                        <strong>
                            ${vehicle.seats}
                        </strong>
                    </div>

                    <div class="detail-spec">
                        <span class="detail-spec-label">
                            Category
                        </span>
                        <strong>
                            ${vehicle.category}
                        </strong>
                    </div>

                    <div class="detail-spec">
                        <span class="detail-spec-label">
                            Brand
                        </span>
                        <strong>
                            ${vehicle.brand}
                        </strong>
                    </div>
                </div>

                <!-- =========================
                    DESCRIPTION
                ========================== -->
                <div class="vehicle-description">
                    <h2>
                        About this vehicle
                    </h2>
                    <p>
                        Enjoy a comfortable and reliable
                        journey with the ${vehicle.name}.
                        This ${vehicle.category.toLowerCase()}
                        is available for rental through
                        Rento.
                    </p>
                </div>

                <!-- =========================
                    BOOK
                ========================== -->
                <div class="vehicle-details-actions">
                    ${bookButton}
                </div>
            </div>
        </div>
    `;
}

function bookVehicle(vehicleId) {

    window.location.href =
        "booking.html?id=" + vehicleId;

}