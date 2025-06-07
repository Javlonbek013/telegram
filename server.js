const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const users = [];
const messages = [];

app.post('/register', (req, res) => {
  const { phone, password } = req.body;
  if (!phone || !password) return res.status(400).json({ error: 'Telefon va parol kerak' });

  const user = users.find(u => u.phone === phone);
  if (user) {
    if (user.password === password) {
      return res.json({ message: 'Tizimga kirdingiz (oldin ro‘yxatdan o‘tgan)' });
    } else {
      return res.status(400).json({ error: 'Bu raqam oldin ro‘yxatdan o‘tgan. Parol xato.' });
    }
  }

  users.push({ phone, password });
  res.json({ message: 'Ro‘yxatdan muvaffaqiyatli o‘tildi' });
});

app.post('/login', (req, res) => {
  const { phone, password } = req.body;
  const user = users.find(u => u.phone === phone && u.password === password);
  if (!user) return res.status(400).json({ error: 'Telefon yoki parol noto‘g‘ri' });
  res.json({ message: 'Kirish muvaffaqiyatli' });
});

app.post('/send-message', (req, res) => {
  const { from, to, text } = req.body;
  if (!from || !to || !text) return res.status(400).json({ error: 'Ma’lumotlar yetarli emas' });

  const sender = users.find(u => u.phone === from);
  const receiver = users.find(u => u.phone === to);
  if (!sender || !receiver) return res.status(400).json({ error: 'Foydalanuvchi topilmadi' });

  messages.push({ from, to, text, time: new Date() });
  res.json({ message: 'Xabar yuborildi' });
});

app.get('/messages', (req, res) => {
  const { user1, user2 } = req.query;
  const result = messages.filter(
    msg => (msg.from === user1 && msg.to === user2) || (msg.from === user2 && msg.to === user1)
  );
  res.json(result);
});

// ❗ PORT muhim o‘zgarish
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Server ${PORT}-portda ishlamoqda`);
});
