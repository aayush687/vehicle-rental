// Shared mock data and helper functions
// Stand-in for the MySQL database until the backend is connected.
// Replace the TODO fetch() calls in each page's JS file once the
// Java backend is ready — the rest of the code will not need to change.

const VEHICLES = [
  { id: 1, name: "Hyundai Creta",    category: "Car",  brand: "Hyundai",  pricePerDay: 4500, status: "available",    image: "images/HyundaiCreta.png",    dateAdded: "2026-06-01", transmission: "Automatic", seats: 5, rating: 8.4 },
  { id: 2, name: "Honda City",       category: "Car",  brand: "Honda",    pricePerDay: 4000, status: "available",    image: "images/hondacity.avif",       dateAdded: "2026-05-20", transmission: "Manual",    seats: 5, rating: 8.1 },
  { id: 3, name: "Yamaha FZ",        category: "Bike", brand: "Yamaha",   pricePerDay: 1200, status: "booked",       image: "images/yamahafz.jpg",        dateAdded: "2026-04-15", transmission: "Manual",    seats: 2, rating: 7.9 },
  { id: 4, name: "TVS Apache",       category: "Bike", brand: "TVS",      pricePerDay: 1000, status: "available",    image: "images/apache.png",       dateAdded: "2026-03-10", transmission: "Manual",    seats: 2, rating: 7.6 },
  { id: 5, name: "Toyota Hiace",     category: "Van",  brand: "Toyota",   pricePerDay: 8000, status: "maintenance",  image: "images/hiace.webp",     dateAdded: "2026-02-01", transmission: "Manual",    seats: 12, rating: 8.0 },
  { id: 6, name: "Mahindra Scorpio", category: "Car",  brand: "Mahindra", pricePerDay: 5200, status: "available",    image: "images/scorpio.jpg", dateAdded: "2026-07-05", transmission: "Manual",    seats: 7, rating: 8.3 },
  { id: 7, name: "Bajaj Pulsar",     category: "Bike", brand: "Bajaj",    pricePerDay: 900,  status: "available",    image: "images/pulsar.webp",     dateAdded: "2026-01-12", transmission: "Manual",    seats: 2, rating: 7.5 },
  { id: 8, name: "Suzuki Ertiga",    category: "Car",  brand: "Suzuki",   pricePerDay: 4700, status: "booked",      image: "images/arrival.avif",    dateAdded: "2026-08-01", transmission: "Automatic", seats: 7, rating: 8.2 }
];

const BOOKINGS = [
  { id: 101, customer: "Sagar Thapa",     vehicle: "Yamaha FZ",     start: "2026-09-10", end: "2026-09-12", total: 2400,  status: "confirmed" },
  { id: 102, customer: "Susmita Tamang",    vehicle: "Suzuki Ertiga", start: "2026-09-09", end: "2026-09-14", total: 23500, status: "confirmed" },
  { id: 103, customer: "Aayush Subedi",   vehicle: "Honda City",    start: "2026-09-15", end: "2026-09-17", total: 8000,  status: "pending" },
  { id: 104, customer: "Nirajan Aryal",   vehicle: "Hyundai Creta", start: "2026-08-28", end: "2026-08-30", total: 9000,  status: "completed" },
  { id: 105, customer: "Zenith Bhandari", vehicle: "TVS Apache",    start: "2026-08-20", end: "2026-08-21", total: 1000,  status: "cancelled" }
];

// Format a number as Nepali rupees, e.g. money(4500) -> "Rs. 4,500"
function money(amount) {
  return "Rs. " + amount.toLocaleString("en-IN");
}

// Returns the vehicle with the most recent dateAdded value
function getLatestVehicle() {
  return VEHICLES.reduce(function (latest, current) {
    return new Date(current.dateAdded) > new Date(latest.dateAdded) ? current : latest;
  });
}

// True if a vehicle was added within the last 30 days
function isNewVehicle(vehicle) {
  const daysSinceAdded = (new Date() - new Date(vehicle.dateAdded)) / (1000 * 60 * 60 * 24);
  return daysSinceAdded <= 30;
}

// Turns a numeric rating into a word, like booking sites do
function ratingLabel(rating) {
  if (rating >= 9) return "Excellent";
  if (rating >= 8) return "Good";
  if (rating >= 7) return "Fair";
  return "Average";
}

// Returns HTML for a vehicle's picture: a real photo if "image" is set,
// otherwise falls back to the emoji icon so nothing breaks if a photo
// is missing. Also falls back automatically if the image file 404s.
function vehiclePictureHTML(vehicle, sizeClass) {
  if (vehicle.image) {
    return `<img src="${vehicle.image}" alt="${vehicle.name}" class="${sizeClass}"
              onerror="this.replaceWith(Object.assign(document.createElement('div'), {className: '${sizeClass}', textContent: '${vehicle.icon}'}))">`;
  }
  return `<div class="${sizeClass}">${vehicle.icon}</div>`;
}

// Show a small message box in the corner of the screen for 2.5 seconds
function showToast(message) {
  let toast = document.querySelector(".toast");
  if (!toast) {
    toast = document.createElement("div");
    toast.className = "toast";
    document.body.appendChild(toast);
  }
  toast.textContent = message;
  toast.classList.add("show");
  clearTimeout(toast.hideTimer);
  toast.hideTimer = setTimeout(function () {
    toast.classList.remove("show");
  }, 2500);
}