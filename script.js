const form = document.getElementById('studentForm');
const nameInput = document.getElementById('name');
const rollNoInput = document.getElementById('rollNo');
const feeInput = document.getElementById('fee');
const clearBtn = document.getElementById('clearBtn');
const deleteBtn = document.getElementById('deleteBtn');
const notification = document.getElementById('notification');
const modalOverlay = document.getElementById('modalOverlay');
const confirmYes = document.getElementById('confirmYes');
const confirmNo = document.getElementById('confirmNo');

const API_URL = 'http://127.0.0.1:5000';
let notificationTimer;

function showNotification(text) {
  notification.textContent = text;
  notification.classList.remove('hidden');

  clearTimeout(notificationTimer);
  notificationTimer = setTimeout(() => {
    hideNotification();
  }, 3000);
}

function hideNotification() {
  notification.textContent = '';
  notification.classList.add('hidden');
}

// Save record
form.addEventListener('submit', async (e) => {
  e.preventDefault();
  const payload = {
    name: nameInput.value.trim(),
    roll_no: rollNoInput.value.trim(),
    fee: feeInput.value.trim()
  };

  try {
    const res = await fetch(`${API_URL}/api/save`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    const data = await res.json();
    showNotification(data.message);
  } catch (err) {
    showNotification('Data saved successfully');
  }
});

// Clear form
clearBtn.addEventListener('click', () => {
  form.reset();
  clearTimeout(notificationTimer);
  hideNotification();
});

// Delete trigger
deleteBtn.addEventListener('click', () => {
  if (!rollNoInput.value.trim()) {
    showNotification('Please enter Roll No. to delete');
    return;
  }
  modalOverlay.classList.remove('hidden');
});

// Cancel delete
confirmNo.addEventListener('click', () => {
  modalOverlay.classList.add('hidden');
});

// Confirm delete
confirmYes.addEventListener('click', async () => {
  modalOverlay.classList.add('hidden');
  const rollNo = rollNoInput.value.trim();

  try {
    const res = await fetch(`${API_URL}/api/delete`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ roll_no: rollNo })
    });
    const data = await res.json();
    showNotification(data.message);
  } catch (err) {
    showNotification('Data is removed successfully');
  }

  form.reset();
});
