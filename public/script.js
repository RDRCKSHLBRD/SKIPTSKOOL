// Toggle Sidebar
function toggleSidebar() {
  const sidebar = document.getElementById('sidebar');
  sidebar.style.right = sidebar.style.right === "0px" ? "-15%" : "0px";
}

// Open Modal
function openModal(modalId) {
  document.getElementById(modalId).style.display = "flex";
}

// Close Modal
function closeModal(modalId) {
  document.getElementById(modalId).style.display = "none";
}

// Handle Login Form Submission
document.getElementById("loginForm").addEventListener("submit", function(event) {
  event.preventDefault();
  const email = document.getElementById("loginEmail").value;
  const password = document.getElementById("loginPassword").value;

  fetch('/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
  }).then(res => res.json()).then(data => {
      alert(data.message);
      closeModal("loginModal");
  }).catch(err => console.error(err));
});

// Handle Register Form Submission
document.getElementById("registerForm").addEventListener("submit", function(event) {
  event.preventDefault();
  const email = document.getElementById("registerEmail").value;
  const password = document.getElementById("registerPassword").value;

  fetch('/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
  }).then(res => res.json()).then(data => {
      alert(data.message);
      closeModal("registerModal");
  }).catch(err => console.error(err));
});
