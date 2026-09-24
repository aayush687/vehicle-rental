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

let vehicles = [];

// Load vehicles from Java backend
async function loadVehicles() {

    try {

        const response =
            await fetch("http://localhost:8080/api/vehicles");

        if (!response.ok) {
            throw new Error("Could not load vehicles");
        }

        const data = await response.json();

        // Convert backend data to the format used by this page
        vehicles = data.map(function (vehicle) {

            return {
                id: vehicle.id,
                name: vehicle.name,
                category: vehicle.category,
                pricePerDay: vehicle.pricePerDay,
                status: vehicle.status.toLowerCase(),

                // These fields are not in our simple database
                brand: "",
                transmission: "",
                seats: 0,
                rating: 0
            };
        });

        loadCategories();
        loadBrands();

        renderVehicles(vehicles);

    } catch (error) {

        console.error("Error loading vehicles:", error);

        vehicleList.innerHTML = `
            <div class="no-results">
                <div class="no-results-icon">
                    🚗
                </div>
                <h3>
                    Could not load vehicles
                </h3>
                <p>
                    Please make sure the backend is running.
                </p>
            </div>
        `;
    }
}


// Load categories from database vehicles
function loadCategories() {

    const categories = [];

    vehicles.forEach(function (vehicle) {

        if (
            vehicle.category &&
            !categories.includes(vehicle.category)
        ) {
            categories.push(vehicle.category);
        }
    });

    categories.sort();

    categories.forEach(function (category) {

        const option =
            document.createElement("option");

        option.value = category;
        option.textContent = category;

        searchCategory.appendChild(option);
    });
}


// Load brands
// The simple database does not currently contain brands
function loadBrands() {

    searchBrand.innerHTML = `
        <option value="all">All Brands</option>
    `;
}


// Create vehicle card
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

    } else {

        statusText = vehicle.status;
    }

    return `
        <div class="vehicle-card">

            ${typeof vehiclePictureHTML === "function"
                ? vehiclePictureHTML(
                    vehicle,
                    "browse-vehicle-icon"
                )
                : `
                    <div class="browse-vehicle-icon">
                        🚗
                    </div>
                `
            }

            <h3>
                ${vehicle.name}
            </h3>

            <p class="vehicle-subtitle">
                ${vehicle.category}
            </p>

            <div class="vehicle-specs">

                <span>
                    🚗 ${vehicle.category}
                </span>

            </div>

            <div class="price">

                ${money(vehicle.pricePerDay)}

                <span class="price-small">
                    / day
                </span>

            </div>

            <div class="vehicle-status">

                <span class="status status-${vehicle.status}">
                    ${statusText}
                </span>

            </div>

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


// Display vehicles
function renderVehicles(vehicleArray) {

    vehicleList.innerHTML = "";

    vehicleCount.textContent =
        vehicleArray.length +
        (vehicleArray.length === 1
            ? " vehicle"
            : " vehicles");

    if (vehicleArray.length === 0) {

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

    vehicleArray.forEach(function (vehicle) {

        vehicleList.innerHTML +=
            vehicleCardHTML(vehicle);

    });
}


// Search and filter vehicles
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
        vehicles.filter(function (vehicle) {

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

    renderVehicles(filteredVehicles);
}


// View vehicle details
function viewVehicle(vehicleId) {

    window.location.href =
        "vehicle-details.html?id=" + vehicleId;
}


// Book vehicle
function bookVehicle(vehicleId) {

    const vehicle =
        vehicles.find(function (vehicle) {

            return vehicle.id ===
                Number(vehicleId);

        });

    if (!vehicle) {
        return;
    }

    if (vehicle.status !== "available") {

        if (typeof showToast === "function") {
            showToast(
                "This vehicle is currently unavailable."
            );
        }

        return;
    }

    window.location.href =
        "login.html?vehicle=" + vehicleId;
}


// Search button
searchBtn.addEventListener(
    "click",
    searchVehicles
);


// Load vehicles when page opens
loadVehicles();