let currentUser = null;
const backendURL = "https://telegram-8yhr.onrender.com"; // Renderdagi backend URL

function register() {
  const phone = document.getElementById('reg-phone').value.trim();
  const password = document.getElementById('reg-pass').value.trim();

  fetch(`${backendURL}/register`, {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({ phone, password })
  })
  .then(res => res.json())
  .then(data => {
    if (data.error) return alert(data.error);
    alert(data.message);
    currentUser = phone;
    showChatSection();
  })
  .catch(() => alert("Server bilan bog‘lanishda xatolik yuz berdi"));
}

function login() {
  const phone = document.getElementById('login-phone').value.trim();
  const password = document.getElementById('login-pass').value.trim();

  fetch(`${backendURL}/login`, {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({ phone, password })
  })
  .then(res => res.json())
  .then(data => {
    if (data.error) return alert(data.error);
    currentUser = phone;
    showChatSection();
  })
  .catch(() => alert("Server bilan bog‘lanishda xatolik yuz berdi"));
}

function showChatSection() {
  document.getElementById('register-section').style.display = 'none';
  document.getElementById('login-section').style.display = 'none';
  document.getElementById('chat-section').style.display = 'block';
  loadMessages();
  loadUsers();
}

function loadMessages() {
  const otherPhone = document.getElementById('chat-to').value.trim();
  if (!currentUser || !otherPhone) return;

  fetch(`${backendURL}/messages?user1=${currentUser}&user2=${otherPhone}`)
    .then(res => res.json())
    .then(data => {
      const chatMessages = document.getElementById('chat-messages');
      chatMessages.innerHTML = '';
      data.forEach(msg => {
        const div = document.createElement('div');
        div.textContent = `${msg.from}: ${msg.text} (${new Date(msg.time).toLocaleTimeString()})`;
        chatMessages.appendChild(div);
      });
      chatMessages.scrollTop = chatMessages.scrollHeight;
    });
}

function sendMessage() {
  const to = document.getElementById('chat-to').value.trim();
  const text = document.getElementById('chat-text').value.trim();
  if (!to || !text) return alert('Kimga va matnni kiriting');

  fetch(`${backendURL}/send-message`, {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({ from: currentUser, to, text })
  })
  .then(res => res.json())
  .then(data => {
    if (data.error) return alert(data.error);
    document.getElementById('chat-text').value = '';
    loadMessages();
  });
}

function loadUsers() {
  fetch(`${backendURL}/users`)
    .then(res => res.json())
    .then(data => {
      const userList = document.getElementById('user-list');
      userList.innerHTML = '';
      data.forEach(phone => {
        const li = document.createElement('li');
        li.textContent = phone;
        userList.appendChild(li);
      });
    });
}

// Har 2 soniyada avtomatik yangilanish
setInterval(() => {
  if (currentUser) loadMessages();
}, 2000);
