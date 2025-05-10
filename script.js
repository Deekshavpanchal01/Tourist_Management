const baseUrl = 'http://localhost:5000/tourists';

const form = document.getElementById('touristForm');
const list = document.getElementById('touristList');
const nameInput = document.getElementById('name');
const countryInput = document.getElementById('country');
const visitDateInput = document.getElementById('visitDate');
const attractionsInput = document.getElementById('attractions');
const budgetInput = document.getElementById('budget');

let isEditing = false;
let editTouristId = null;

// Fetch and render all tourists
async function fetchTourists() {
  const res = await fetch(baseUrl);
  const tourists = await res.json();
  list.innerHTML = '';
  tourists.forEach(tourist => {
    const li = document.createElement('li');
    li.innerHTML = `
      <strong>${tourist.name}</strong> from ${tourist.country}<br>
      Visit: ${new Date(tourist.visitDate).toLocaleDateString()}<br>
      Attractions: ${tourist.attractions.join(', ')}<br>
      Budget: ₹${tourist.budget}
      <br>
      <button onclick="editTourist('${tourist._id}')">Edit</button>
      <button class="delete" onclick="deleteTourist('${tourist._id}')">Delete</button>
    `;
    list.appendChild(li);
  });
}

// Submit form (Create or Update)
form.addEventListener('submit', async (e) => {
  e.preventDefault();

  const data = {
    name: nameInput.value,
    country: countryInput.value,
    visitDate: visitDateInput.value,
    attractions: attractionsInput.value.split(',').map(a => a.trim()),
    budget: parseFloat(budgetInput.value) || 0
  };

  if (isEditing && editTouristId) {
    // UPDATE
    await fetch(`${baseUrl}/${editTouristId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    isEditing = false;
    editTouristId = null;
    form.querySelector('button').textContent = "Add Tourist";
  } else {
    // CREATE
    await fetch(baseUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
  }

  form.reset();
  fetchTourists();
});

// Edit tourist
async function editTourist(id) {
  const res = await fetch(`${baseUrl}/${id}`);
  const tourist = await res.json();

  nameInput.value = tourist.name;
  countryInput.value = tourist.country;
  visitDateInput.value = tourist.visitDate.split('T')[0];
  attractionsInput.value = tourist.attractions.join(', ');
  budgetInput.value = tourist.budget;

  isEditing = true;
  editTouristId = id;
  form.querySelector('button').textContent = "Update Tourist";
}

// Delete tourist
async function deleteTourist(id) {
  await fetch(`${baseUrl}/${id}`, {
    method: 'DELETE'
  });
  fetchTourists();
}

// Load tourists on page load
fetchTourists();
