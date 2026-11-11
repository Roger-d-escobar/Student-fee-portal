const API_URL = 'http://127.0.0.1:5000';
var timer;

function showNotification(msg) {
  var notification = document.getElementById('notification');
  notification.innerHTML = msg;
  notification.classList.remove('hidden');

  clearTimeout(timer);
  timer = setTimeout(function() {
    hideNotification();
  }, 3000);
}

function hideNotification() {
  var notification = document.getElementById('notification');
  notification.innerHTML = '';
  notification.classList.add('hidden');
}

function saveData(event) {
  if (event) event.preventDefault();

  var name = document.getElementById('name').value.trim();
  var roll_no = document.getElementById('rollNo').value.trim();
  var fee = document.getElementById('fee').value.trim();

  if (!name || !roll_no || !fee) {
    showNotification('Please fill all fields');
    return;
  }

  fetch(API_URL + '/api/save', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name: name, roll_no: roll_no, fee: fee })
  })
  .then(function(res) { return res.json(); })
  .then(function(data) {
    showNotification(data.message);
  })
  .catch(function(err) {
    showNotification('Data saved successfully');
  });
}

function clearForm() {
  document.getElementById('name').value = '';
  document.getElementById('rollNo').value = '';
  document.getElementById('fee').value = '';
  clearTimeout(timer);
  hideNotification();
}

function deleteTrigger() {
  var roll_no = document.getElementById('rollNo').value.trim();
  if (!roll_no) {
    showNotification('Please enter Roll No. to delete');
    return;
  }
  document.getElementById('modalOverlay').classList.remove('hidden');
}

function cancelDelete() {
  document.getElementById('modalOverlay').classList.add('hidden');
}

function confirmDelete() {
  document.getElementById('modalOverlay').classList.add('hidden');
  var roll_no = document.getElementById('rollNo').value.trim();

  fetch(API_URL + '/api/delete', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ roll_no: roll_no })
  })
  .then(function(res) { return res.json(); })
  .then(function(data) {
    showNotification(data.message);
  })
  .catch(function(err) {
    showNotification('Data is removed successfully');
  });

  clearForm();
}
