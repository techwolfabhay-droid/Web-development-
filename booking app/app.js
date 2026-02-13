let bookings = {}; // Store bookings globally for the session
let editIndex = null;

const bookingForm = document.getElementById('bookingForm');
const editBookingForm = document.getElementById('editBookingForm');
const bookingList = document.getElementById('bookingList');
const searchInput = document.getElementById('searchInput');

// Retrieve logged-in user details from localStorage
const currentUser = JSON.parse(localStorage.getItem('loggedInUser'));

// If no user is logged in, redirect to login page
if (!currentUser) {
    window.location.href = 'login.html'; 
} else {
    document.getElementById('welcomeMessage').textContent = `Welcome, ${currentUser.username}!`;
}

// Get the user's bookings from localStorage, or initialize if not present
const userBookings = JSON.parse(localStorage.getItem(currentUser.email)) || [];

function saveBookings() {
    // Store the bookings under the user's email in localStorage
    localStorage.setItem(currentUser.email, JSON.stringify(userBookings));
    console.log('Saved bookings for', currentUser.email, userBookings);
}

function renderBookings(filteredBookings = null) {
    bookingList.innerHTML = '';
    const list = filteredBookings || userBookings;

    list.forEach((booking, index) => {
        const bookingCard = document.createElement('div');
        bookingCard.className = 'booking-card';

        // Use toLocaleDateString() to display dates in a readable format
        const fromDateFormatted = new Date(booking.fromDate).toLocaleDateString();
        const toDateFormatted = new Date(booking.toDate).toLocaleDateString();

        bookingCard.innerHTML = `
            <input type="checkbox" class="select-booking" data-index="${index}">
            <p><strong>Owner:</strong> ${booking.ownerName}</p>
            <p><strong>Contact:</strong> ${booking.contact}</p>
            <p><strong>Rooms:</strong> ${booking.rooms}</p>
            <p><strong>Location:</strong> ${booking.location}</p>
            <p><strong>From Date:</strong> ${fromDateFormatted}</p>
            <p><strong>To Date:</strong> ${toDateFormatted}</p>
            <p><strong>Notes:</strong> ${booking.notes}</p>
            <button class="edit-btn" onclick="openEditModal(${index})">Edit</button>
            <button class="delete-btn-single" onclick="deleteBooking(${index})">Delete</button>
            <button class="download-btn-single" onclick="downloadSelectedBooking(${index})">Download</button>
        `;

        bookingList.appendChild(bookingCard);
    });

    // Update total bookings count
    document.getElementById('totalBookings').textContent = userBookings.length;
}


    // Update total bookings count
    document.getElementById('totalBookings').textContent = userBookings.length;


// Add a new booking when the booking form is submitted
bookingForm.addEventListener('submit', function(e) {
    e.preventDefault();

    const newBooking = {
        ownerName: document.getElementById('ownerName').value,
        contact: document.getElementById('contact').value,
        rooms: document.getElementById('rooms').value,
        location: document.getElementById('location').value,
        fromDate: document.getElementById('fromDate').value,
        toDate: document.getElementById('toDate').value,
        notes: document.getElementById('notes').value
    };
    
    // Add the new booking to the current user's bookings
    userBookings.push(newBooking);
    saveBookings();
    renderBookings();
    bookingForm.reset();
});

// Search function to filter bookings by owner name or date
function searchBookings() {
    const query = searchInput.value.trim().toLowerCase();

    if (query === "") {
        renderBookings(); // No search term, so render all bookings
        return;
    }

    // Filter bookings based on owner name or date
    const filtered = userBookings.filter(booking => {
        // Match by owner name
        const ownerMatch = booking.ownerName.toLowerCase().includes(query);

        // Match by full date, month, or year
        const fromDateMatch = matchesDateQuery(booking.fromDate, query);
        const toDateMatch = matchesDateQuery(booking.toDate, query);

        return ownerMatch || fromDateMatch || toDateMatch;
    });

    renderBookings(filtered);
}
// Function to download the selected booking
function downloadSelectedBooking(index) {
    const booking = userBookings[index];

    let text = '';
    text += `Booking Details:\n`;
    text += `Owner: ${booking.ownerName}\n`;
    text += `Contact: ${booking.contact}\n`;
    text += `Rooms: ${booking.rooms}\n`;
    text += `Location: ${booking.location}\n`;
    text += `From Date: ${new Date(booking.fromDate).toLocaleDateString()}\n`;
    text += `To Date: ${new Date(booking.toDate).toLocaleDateString()}\n`;
    text += `Notes: ${booking.notes}\n`;

    const blob = new Blob([text], { type: 'text/plain' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `booking_${index + 1}.txt`;
    link.click();
}


// Helper function to check if a date matches the query (full date, month, or year)
function matchesDateQuery(date, query) {
    if (!date) return false;

    // Extract year, month, and day from the date
    const [year, month, day] = date.split("-");

    // Match by full date (e.g., 2025-05-01)
    if (date.includes(query)) return true;

    // Match by month (e.g., 05 for May)
    if (month.includes(query)) return true;

    // Match by year (e.g., 2025)
    if (year.includes(query)) return true;

    return false;
}

// Delete a single booking
function deleteBooking(index) {
    if (confirm('Are you sure you want to delete this booking?')) {
        userBookings.splice(index, 1); // Remove booking from userBookings array
        saveBookings(); // Save updated bookings
        renderBookings(); // Re-render bookings list
    }
}

// Delete selected bookings
function deleteSelectedBookings() {
    const selected = document.querySelectorAll('.select-booking:checked');
    const indexes = Array.from(selected).map(item => parseInt(item.getAttribute('data-index'))).sort((a, b) => b - a);

    indexes.forEach(index => userBookings.splice(index, 1)); // Remove selected bookings

    saveBookings(); // Save updated bookings
    renderBookings(); // Re-render bookings list
}

// Clear all bookings for the current user
function clearAllBookings() {
    if (confirm('Are you sure you want to clear all bookings?')) {
        userBookings.length = 0; // Empty the user's bookings
        saveBookings(); // Save the empty list
        renderBookings(); // Re-render bookings list
    }
}

// Download bookings as a text file
function downloadBookings() {
    let text = '';
    userBookings.forEach((booking, index) => {
        text += `Booking ${index + 1}:\n`;
        text += `Owner: ${booking.ownerName}\n`;
        text += `Contact: ${booking.contact}\n`;
        text += `Rooms: ${booking.rooms}\n`;
        text += `Location: ${booking.location}\n`;
        text += `From Date: ${new Date(booking.fromDate).toLocaleDateString()}\n`;
        text += `To Date: ${new Date(booking.toDate).toLocaleDateString()}\n`;
        text += `Notes: ${booking.notes}\n\n`;
    });

    const blob = new Blob([text], { type: 'text/plain' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'bookings.txt';
    link.click();
}

// Modal Functions for editing bookings
const modal = document.getElementById('editModal');

function openEditModal(index) {
    editIndex = index;
    const booking = userBookings[index];

    document.getElementById('editOwnerName').value = booking.ownerName;
    document.getElementById('editContact').value = booking.contact;
    document.getElementById('editRooms').value = booking.rooms;
    document.getElementById('editLocation').value = booking.location;
    document.getElementById('editFromDate').value = booking.fromDate;
    document.getElementById('editToDate').value = booking.toDate;
    document.getElementById('editNotes').value = booking.notes;

    modal.style.display = 'block';
}

function closeEditModal() {
    modal.style.display = 'none';
}

editBookingForm.addEventListener('submit', function(e) {
    e.preventDefault();

    userBookings[editIndex] = {
        ownerName: document.getElementById('editOwnerName').value,
        contact: document.getElementById('editContact').value,
        rooms: document.getElementById('editRooms').value,
        location: document.getElementById('editLocation').value,
        fromDate: document.getElementById('editFromDate').value,
        toDate: document.getElementById('editToDate').value,
        notes: document.getElementById('editNotes').value
    };

    saveBookings();
    renderBookings();
    closeEditModal();
});

// Close modal when clicking outside
window.onclick = function(event) {
    if (event.target == modal) {
        closeEditModal();
    }
}

function logout() {
    localStorage.removeItem('loggedInUser');
    window.location.href = 'login.html';
}

// Initial Render
renderBookings();


