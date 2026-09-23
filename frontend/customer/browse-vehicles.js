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

const vehicleList =
    document.getElementById("vehicle-list");
const vehicleCount =
    document.getElementById("vehicle-count");
const searchCategory =
    document.getElementById("search-category");
const searchBrand =
    document.getElementById("search-brand");
const searchTransmission =
    document.getElementById("search-transmission");
const searchStatus =
    document.getElementById("search-status");
const searchBtn =
    document.getElementById("search-btn");

function loadBrands() {
    const brands = [];

    getVehicles().forEach(function (vehicle) {
        if (!brands.includes(vehicle.brand)) {
            brands.push(vehicle.brand);
        }
    });

    // Sort alphabetically
    brands.sort();

    // Add brands to dropdown
    brands.forEach(function (brand) {
        const option =
            document.createElement("option");
        option.value = brand;
        option.textContent = brand;
        searchBrand.appendChild(option);
    });
}

function customerVehicleImage(vehicle) {
    if (vehicle.image) {
        return `
            <img
                src="../public/${vehicle.image}"
                alt="${vehicle.name}"
                class="browse-vehicle-icon"
            >
        `;
    }
    return `
        <div class="browse-vehicle-icon">
            🚗
        </div>
    `;
}

function vehicleCardHTML(vehicle) {
    const canBook =
        vehicle.status === "available";
    let statusText = "";
    if (vehicle.status === "available") {
        statusText = "Available";
    }
    else if (vehicle.status === "booked") {
        statusText = "Currently booked";
    }
    else if (vehicle.status === "maintenance") {
        statusText = "Under maintenance";
    }

    return `
        <div class="vehicle-card">
            <!-- Vehicle image -->
            ${customerVehicleImage(vehicle)}
            <!-- Vehicle name -->
            <h3>
                ${vehicle.name}
            </h3>
            <!-- Brand and category -->
            <p class="vehicle-subtitle">
                ${vehicle.brand} • ${vehicle.category}
            </p>
            <!-- Specifications -->
            <div class="vehicle-specs">
                <span>
                    ⚙️ ${vehicle.transmission}
                </span>
                <span>
                    👤 ${vehicle.seats} seats
                </span>
                <span>
                    ⭐ ${vehicle.rating.toFixed(1)}
                </span>
            </div>

            <!-- Price -->
            <div class="price">
                ${money(vehicle.pricePerDay)}
                <span class="price-small">
                    / day
                </span>
            </div>

            <!-- Availability -->
            <div class="vehicle-status">
                <span class="status status-${vehicle.status}">
                    ${statusText}
                </span>
            </div>
            <!-- Buttons -->
            <div class="vehicle-actions">

                <button
                    class="btn btn-secondary"
                    onclick="viewVehicle(${vehicle.id})">
                    View Details
                </button>

                <button
                    class="btn"
                    onclick="bookVehicle(${vehicle.id})"
                    ${canBook ? "" : "disabled"}>
                    ${canBook ? "Book Now" : "Unavailable"}
                </button>
            </div>
        </div>
    `;
}

function renderVehicles(vehicles) {

    // Clear old results
    vehicleList.innerHTML = "";

    // Update count
    vehicleCount.textContent =
        vehicles.length +
        (vehicles.length === 1
            ? " vehicle"
            : " vehicles"
        );
    // No results
    if (vehicles.length === 0) {
        vehicleList.innerHTML = `
            <div class="no-results">
                <div class="no-results-icon">
                    🚗
                </div>
                <h3>
                    No vehicles found
                </h3>
                <p>
                    Try changing your search filters.
                </p>
            </div>
        `;
        return;
    }
    // Add vehicle cards
    vehicles.forEach(function (vehicle) {
        vehicleList.innerHTML +=
            vehicleCardHTML(vehicle);
    });
}

function searchVehicles() {
    const category =
        searchCategory.value;
    const brand =
        searchBrand.value;
    const transmission =
        searchTransmission.value;
    const status =
        searchStatus.value;
    const filteredVehicles =
        getVehicles().filter(function (vehicle) {
            // Category
            if (
                category !== "all" &&
                vehicle.category !== category
            ) {
                return false;
            }
            // Brand
            if (
                brand !== "all" &&
                vehicle.brand !== brand
            ) {
                return false;
            }
            // Transmission
            if (
                transmission !== "all" &&
                vehicle.transmission !== transmission
            ) {
                return false;
            }
            // Availability
            if (
                status !== "all" &&
                vehicle.status !== status
            ) {
                return false;
            }
            return true;
        });
    renderVehicles(filteredVehicles);
}
function viewVehicle(vehicleId) {
    const vehicle =
        getVehicles().find(function (vehicle) {
            return vehicle.id === Number(vehicleId);
        });
    if (!vehicle) {
        showToast("Vehicle not found.");
        return;
    }
    window.location.href =
        "vehicle-details.html?id=" + vehicleId;
}

function bookVehicle(vehicleId) {
    const vehicle =
        getVehicles().find(function (vehicle) {
            return vehicle.id === Number(vehicleId);
        });
    if (!vehicle) {
        showToast("Vehicle not found.");
        return;
    }
    // Only available vehicles can be booked
    if (vehicle.status !== "available") {
        showToast(
            "This vehicle is currently unavailable."
        );
        return;
    }

    window.location.href =
        "booking.html?id=" + vehicleId;
}

searchBtn.addEventListener(
    "click",
    searchVehicles
);

loadBrands();
renderVehicles(getVehicles());