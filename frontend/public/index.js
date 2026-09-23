
const featuredBox = document.getElementById("featured-vehicle");
const vehicleList = document.getElementById("vehicle-list");
const searchCategory = document.getElementById("search-category");
const searchBtn = document.getElementById("search-btn");
const latest = getLatestVehicle();

featuredBox.innerHTML = `
  ${vehiclePictureHTML(latest, "featured-photo")}
  <div class="featured-info">
    <div class="featured-tag">Just added</div>
    <h3>${latest.name}</h3>
    <div class="status status-${latest.status}">${latest.status}</div>
    <p>${latest.category} • ${latest.brand}</p>
    <div class="price">${money(latest.pricePerDay)} / day</div>
  </div>
`;

// Builds one listing-style card for a vehicle
function vehicleCardHTML(vehicle) {
  const newBadge = isNewVehicle(vehicle) ? `<div class="new-badge">New</div>` : "";
  const canBook = vehicle.status === "available";
  const availabilityText = canBook ? "Free cancellation" : "Currently " + vehicle.status;

  return `
    <div class="vehicle-card">
      ${newBadge}

      <div class="vc-header">
        <div>
          <span class="vc-name">${vehicle.name}</span>
          <span class="vc-subtitle">or similar ${vehicle.category}</span>
        </div>
      </div>

      <div class="vc-specs">
        <span>⚙️ ${vehicle.transmission}</span>
        <span>👤 ${vehicle.seats}</span>
        <span>❄️ A/C</span>
      </div>

      <div class="vc-body">
        ${vehiclePictureHTML(vehicle, "vc-photo")}
        <div class="vc-price-block">
          <div class="vc-price">${money(vehicle.pricePerDay)}</div>
          <div class="vc-price-sub">per day</div>
          <div class="vc-availability ${canBook ? "" : "vc-unavailable"}">${availabilityText}</div>
        </div>
      </div>

      <div class="vc-rating-row">
        <div class="vc-rating-score">${vehicle.rating.toFixed(1)} ★</div>
        <div class="vc-rating-label">${ratingLabel(vehicle.rating)}</div>
      </div>

      <button class="vc-book-btn" ${canBook ? "" : "disabled"} onclick="handleBook('${vehicle.id}')">
        ${canBook ? "Book now" : "Not available"}
      </button>

    </div>
  `;
}

function renderVehicles(category) {
    const vehicles = category === "all"
        ? VEHICLES
        : VEHICLES.filter(function (v) { return v.category === category; });
    vehicleList.innerHTML = "";
    if (vehicles.length === 0) {
        vehicleList.innerHTML = "<p>No vehicles match your search.</p>";
        return;
    }
    vehicles.forEach(function (vehicle) {
        vehicleList.innerHTML += vehicleCardHTML(vehicle);
    });
}

function handleBook(vehicleId) {
  const vehicle = VEHICLES.find(function (v) { return v.id === Number(vehicleId); });
  showToast(vehicle.name + " — redirecting to booking...");
}
searchBtn.addEventListener("click", function () {
    renderVehicles(searchCategory.value);
});

renderVehicles("all");