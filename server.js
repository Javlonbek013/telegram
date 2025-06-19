const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

const users = [];
const messages = [];

app.use(cors());
app.use(express.json());

app.post('/register', (req, res) => {
  const { phone, password } = req.body;
  if (!phone || !password) return res.json({ error: 'Iltimos, telefon va parol kiriting' });

  const exists = users.find(u => u.phone === phone);
  if (exists) return res.json({ error: 'Bu telefon raqam allaqachon ro‘yxatdan o‘tgan' });

  users.push({ phone, password });
  res.json({ message: 'Ro‘yxatdan o‘tish muvaffaqiyatli!' });
});

app.post('/login', (req, res) => {
  const { phone, password } = req.body;
  if (!phone || !password) return res.json({ error: 'Iltimos, telefon va parol kiriting' });

  const user = users.find(u => u.phone === phone && u.password === password);
  if (!user) return res.json({ error: 'Noto‘g‘ri telefon yoki parol' });

  res.json({ message: 'Kirish muvaffaqiyatli!' });
});

app.get('/messages', (req, res) => {
  const { user1, user2 } = req.query;
  if (!user1 || !user2) return res.json([]);

  const chat = messages.filter(m =>
    (m.from === user1 && m.to === user2) || (m.from === user2 && m.to === user1)
  );
  res.json(chat);
});
app.post('/send-message', (req, res) => {
  const { from, to, text } = req.body;
  if (!from || !to || !text) return res.json({ error: 'Barcha maydonlarni to‘ldiring' });

  if (!users.find(u => u.phone === from) || !users.find(u => u.phone === to)) {
    return res.json({ error: 'Foydalanuvchi topilmadi' });
  }

  const time = new Date();
  messages.push({ from, to, text, time });

  res.json({ message: 'Xabar jo‘natildi' });
});

app.listen(PORT, () => {
  console.log(`Server ${PORT} portda ishlayapti`);
});
const path = require('path');

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});
app.get('/users', (req, res) => {
  res.json(users);
});
