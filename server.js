const express = require('express');
const path = require('path');
const app = express();

app.use(express.json());

// public papkasi frontend fayllaringiz joylashgan joy bo‘lsin
app.use(express.static(path.join(__dirname, 'public')));

// API endpointlar misol uchun
app.post('/register', (req, res) => {
  // ro'yxatdan o'tish kodi
});

app.post('/login', (req, res) => {
  // login kodi
});

// boshqa endpointlar...

// Boshqa barcha so'rovlarni frontend index.html ga yo'naltirish
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server ${PORT}-portda ishlayapti`));
