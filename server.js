const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = 3000;
const QUIZZES_FILE = path.join(__dirname, 'quizzes.json');

app.use(cors());
app.use(express.json());


function readQuizzes() {
  if (!fs.existsSync(QUIZZES_FILE)) return [];
  const data = fs.readFileSync(QUIZZES_FILE, 'utf-8');
  try {
    return JSON.parse(data);
  } catch {
    return [];
  }
}
function writeQuizzes(quizzes) {
  fs.writeFileSync(QUIZZES_FILE, JSON.stringify(quizzes, null, 2));
}


app.get('/api/quizzes', (req, res) => {
  const quizzes = readQuizzes();
  res.json(quizzes);
});


app.get('/api/quizzes/:id', (req, res) => {
  const quizzes = readQuizzes();
  const quiz = quizzes.find(q => q.id === req.params.id);
  if (!quiz) return res.status(404).json({ error: 'Quiz not found' });
  res.json(quiz);
});


app.post('/api/quizzes', (req, res) => {
  const quizzes = readQuizzes();
  const quiz = req.body;
  quiz.id = Date.now().toString();
  quizzes.push(quiz);
  writeQuizzes(quizzes);
  res.status(201).json({ id: quiz.id });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
}); 