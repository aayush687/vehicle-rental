
const vehicleList = document.getElementById("vehicle-list");
const vehicleCount = document.getElementById("vehicle-count");
const searchCategory = document.getElementById("search-category");
const searchBrand = document.getElementById("search-brand");
const searchTransmission =
    document.getElementById("search-transmission");
const searchStatus =
    document.getElementById("search-status");
const searchBtn =
    document.getElementById("search-btn");

function loadBrands() {
    const brands = [];
    VEHICLES.forEach(function (vehicle) {
        if (!brands.includes(vehicle.brand)) {
            brands.push(vehicle.brand);
        }
    });
    brands.sort();
    // Add brands to select box
    brands.forEach(function (brand) {
        const option = document.createElement("option");
        option.value = brand;
        option.textContent = brand;
        searchBrand.appendChild(option);
    });
}

function vehicleCardHTML(vehicle) {
    const canBook =
        vehicle.status === "available";
    let statusText = "";
    if (vehicle.status === "available") {
        statusText = "Available";
    } else if (vehicle.status === "booked") {
        statusText = "Currently booked";
    } else if (vehicle.status === "maintenance") {
        statusText = "Under maintenance";
    }

    return `
        <div class="vehicle-card">
            <!-- Vehicle photo -->
            ${vehiclePictureHTML(vehicle, "browse-vehicle-icon")}
            <!-- Vehicle name -->
            <h3>
                ${vehicle.name}
            </h3>
            <!-- Brand and category -->
            <p class="vehicle-subtitle">
                ${vehicle.brand} • ${vehicle.category}
            </p>

            <!-- Vehicle specifications -->
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

            <!-- Status -->
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
    // Clear existing vehicles
    vehicleList.innerHTML = "";
    // Update number of vehicles
    vehicleCount.textContent =
        vehicles.length +
        (vehicles.length === 1 ? " vehicle" : " vehicles");
    // If no vehicles are found
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
    // Add each vehicle
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
    // Filter vehicles
    const filteredVehicles =
        VEHICLES.filter(function (vehicle) {
            // Category filter
            if (
                category !== "all" &&
                vehicle.category !== category
            ) {
                return false;
            }
            // Brand filter
            if (
                brand !== "all" &&
                vehicle.brand !== brand
            ) {
                return false;
            }
            // Transmission filter
            if (
                transmission !== "all" &&
                vehicle.transmission !== transmission
            ) {
                return false;
            }
            // Status filter
            if (
                status !== "all" &&
                vehicle.status !== status
            ) {
                return false;
            }
            return true;
        });
    // Display filtered vehicles
    renderVehicles(filteredVehicles);
}

function viewVehicle(vehicleId) {
    window.location.href =
        "vehicle-details.html?id=" + vehicleId;
}

function bookVehicle(vehicleId) {
    const vehicle =
        VEHICLES.find(function (vehicle) {
            return vehicle.id === Number(vehicleId);
        });
    if (!vehicle) {
        return;
    }
    // Only available vehicles can be booked
    if (vehicle.status !== "available") {
        showToast(
            "This vehicle is currently unavailable."
        );
        return;
    }
    // Send user to login for now
    window.location.href =
        "login.html?vehicle=" + vehicleId;
}
searchBtn.addEventListener(
    "click",
    searchVehicles
);

loadBrands();
renderVehicles(VEHICLES);