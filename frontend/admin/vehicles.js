/* =========================================
   ADMIN — MANAGE VEHICLES
========================================= */


/* =========================================
   GET ELEMENTS
========================================= */

const vehiclesTableBody =
    document.getElementById("vehicles-table-body");

const vehicleSearchInput =
    document.getElementById("vehicle-search");

const filterCategory =
    document.getElementById("filter-category");

const filterStatus =
    document.getElementById("filter-status");

const vehicleModalOverlay =
    document.getElementById("vehicle-modal-overlay");

const vehicleForm =
    document.getElementById("vehicle-form");

const vehicleModalTitle =
    document.getElementById("vehicle-modal-title");


/* =========================================
   GET VEHICLES
   (localStorage overrides the sample data
    from data.js, same pattern used for
    bookings elsewhere in the app)
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
   RENDER VEHICLES TABLE
========================================= */

function renderVehicles() {

    const vehicles =
        getVehicles();

    const searchTerm =
        vehicleSearchInput.value
            .trim()
            .toLowerCase();

    const categoryFilter =
        filterCategory.value;

    const statusFilter =
        filterStatus.value;

    const filtered =
        vehicles.filter(function (vehicle) {

            const matchesSearch =
                !searchTerm ||
                vehicle.name.toLowerCase().includes(searchTerm) ||
                vehicle.brand.toLowerCase().includes(searchTerm);

            const matchesCategory =
                categoryFilter === "all" ||
                vehicle.category === categoryFilter;

            const matchesStatus =
                statusFilter === "all" ||
                vehicle.status === statusFilter;

            return (
                matchesSearch &&
                matchesCategory &&
                matchesStatus
            );

        });

    vehiclesTableBody.innerHTML = "";


    if (filtered.length === 0) {

        vehiclesTableBody.innerHTML = `
            <tr>
                <td colspan="8" class="admin-empty">
                    No vehicles found.
                </td>
            </tr>
        `;

        return;

    }


    filtered.forEach(function (vehicle) {

        const row =
            document.createElement("tr");

        const imagePath =
            vehicle.image
                ? "../public/" + vehicle.image
                : "";

        row.innerHTML = `

            <td>
                <div class="admin-vehicle-cell">

                    ${
                        imagePath
                        ? `<img src="${imagePath}" class="admin-vehicle-thumb" alt="${escapeHTML(vehicle.name)}" onerror="this.style.display='none'">`
                        : ""
                    }

                    <span>${escapeHTML(vehicle.name)}</span>

                </div>
            </td>

            <td>${escapeHTML(vehicle.category)}</td>

            <td>${escapeHTML(vehicle.brand)}</td>

            <td>Rs. ${Number(vehicle.pricePerDay || 0).toLocaleString("en-IN")}</td>

            <td>${escapeHTML(vehicle.transmission || "-")}</td>

            <td>${escapeHTML(String(vehicle.seats || "-"))}</td>

            <td>
                <span class="admin-status status-${escapeHTML(vehicle.status)}">
                    ${formatVehicleStatus(vehicle.status)}
                </span>
            </td>

            <td>
                <div class="admin-table-actions">

                    <button
                        class="admin-edit-btn"
                        onclick="openEditModal(${vehicle.id})">
                        Edit
                    </button>

                    <button
                        class="admin-delete-btn"
                        onclick="deleteVehicle(${vehicle.id})">
                        Delete
                    </button>

                </div>
            </td>

        `;

        vehiclesTableBody.appendChild(row);

    });

}


/* =========================================
   FORMAT VEHICLE STATUS
========================================= */

function formatVehicleStatus(status) {

    switch (String(status).toLowerCase()) {

        case "available":
            return "Available";

        case "booked":
            return "Booked";

        case "maintenance":
            return "Maintenance";

        default:
            return status;

    }

}


/* =========================================
   MODAL — ADD VEHICLE
========================================= */

function openAddModal() {

    vehicleModalTitle.textContent =
        "Add Vehicle";

    vehicleForm.reset();

    document.getElementById("vehicle-id").value = "";

    vehicleModalOverlay.classList.add("show");

}


/* =========================================
   MODAL — EDIT VEHICLE
========================================= */

function openEditModal(id) {

    const vehicles =
        getVehicles();

    const vehicle =
        vehicles.find(function (item) {
            return Number(item.id) === Number(id);
        });

    if (!vehicle) {
        return;
    }

    vehicleModalTitle.textContent =
        "Edit Vehicle";

    document.getElementById("vehicle-id").value = vehicle.id;
    document.getElementById("vehicle-name").value = vehicle.name;
    document.getElementById("vehicle-category").value = vehicle.category;
    document.getElementById("vehicle-brand").value = vehicle.brand;
    document.getElementById("vehicle-price").value = vehicle.pricePerDay;
    document.getElementById("vehicle-seats").value = vehicle.seats;
    document.getElementById("vehicle-transmission").value = vehicle.transmission;
    document.getElementById("vehicle-status").value = vehicle.status;
    document.getElementById("vehicle-image").value = vehicle.image || "";

    vehicleModalOverlay.classList.add("show");

}


/* =========================================
   CLOSE MODAL
========================================= */

function closeVehicleModal() {

    vehicleModalOverlay.classList.remove("show");

    vehicleForm.reset();

}


/* =========================================
   SAVE VEHICLE (ADD OR EDIT)
========================================= */

vehicleForm.addEventListener("submit", function (event) {

    event.preventDefault();

    const vehicles =
        getVehicles();

    const id =
        document.getElementById("vehicle-id").value;

    const vehicleData = {

        name: document.getElementById("vehicle-name").value.trim(),

        category: document.getElementById("vehicle-category").value,

        brand: document.getElementById("vehicle-brand").value.trim(),

        pricePerDay: Number(
            document.getElementById("vehicle-price").value
        ),

        seats: Number(
            document.getElementById("vehicle-seats").value
        ),

        transmission: document.getElementById("vehicle-transmission").value,

        status: document.getElementById("vehicle-status").value,

        image: document.getElementById("vehicle-image").value.trim(),

        rating: 8.0

    };


    if (id) {

        /* Editing an existing vehicle */

        const index =
            vehicles.findIndex(function (item) {
                return Number(item.id) === Number(id);
            });

        if (index !== -1) {

            vehicles[index] = {
                ...vehicles[index],
                ...vehicleData
            };

        }

    } else {

        /* Adding a new vehicle */

        const newId =
            vehicles.length > 0
                ? Math.max.apply(
                    null,
                    vehicles.map(function (item) {
                        return Number(item.id);
                    })
                ) + 1
                : 1;

        vehicles.push({
            id: newId,
            dateAdded: new Date().toISOString().slice(0, 10),
            ...vehicleData
        });

    }


    saveVehicles(vehicles);

    closeVehicleModal();

    renderVehicles();

    if (typeof showToast === "function") {

        showToast(
            id ? "Vehicle updated." : "Vehicle added."
        );

    }

});


/* =========================================
   DELETE VEHICLE
========================================= */

function deleteVehicle(id) {

    const confirmDelete =
        confirm(
            "Are you sure you want to delete this vehicle?"
        );

    if (!confirmDelete) {
        return;
    }

    const vehicles =
        getVehicles();

    const updatedVehicles =
        vehicles.filter(function (item) {
            return Number(item.id) !== Number(id);
        });

    saveVehicles(updatedVehicles);

    renderVehicles();

    if (typeof showToast === "function") {

        showToast("Vehicle deleted.");

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

vehicleSearchInput.addEventListener("input", renderVehicles);

filterCategory.addEventListener("change", renderVehicles);

filterStatus.addEventListener("change", renderVehicles);

vehicleModalOverlay.addEventListener("click", function (event) {

    if (event.target === vehicleModalOverlay) {

        closeVehicleModal();

    }

});


/* =========================================
   INITIAL LOAD
========================================= */

renderVehicles();