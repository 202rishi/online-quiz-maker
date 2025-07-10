// Quiz data will be stored in-memory
let quiz = {
  title: '',
  questions: []
};

// DOM elements
const quizTitleInput = document.getElementById('quiz-title');
const questionsContainer = document.getElementById('questions-container');
const addQuestionBtn = document.getElementById('add-question-btn');
const saveQuizBtn = document.getElementById('save-quiz-btn');
const quizCreationSection = document.getElementById('quiz-creation');
const quizTakingSection = document.getElementById('quiz-taking');
const takeQuizTitle = document.getElementById('take-quiz-title');
const takeQuizForm = document.getElementById('take-quiz-form');
const submitQuizBtn = document.getElementById('submit-quiz-btn');
const quizResultSection = document.getElementById('quiz-result');
const resultSummary = document.getElementById('result-summary');
const retakeQuizBtn = document.getElementById('retake-quiz-btn');

function createQuestionBlock(index, question = {}) {
  const block = document.createElement('div');
  block.className = 'question-block';
  block.innerHTML = `
    <label>Question ${index + 1}:</label>
    <input type="text" class="question-text" placeholder="Enter question" value="${question.text || ''}">
    <div class="options-list"></div>
    <button type="button" class="add-option-btn">Add Option</button>
    <button type="button" class="remove-question-btn">Remove Question</button>
  `;

  const optionsList = block.querySelector('.options-list');
  const addOptionBtn = block.querySelector('.add-option-btn');
  const removeQuestionBtn = block.querySelector('.remove-question-btn');

  // Add existing options if any
  (question.options || []).forEach((opt, i) => {
    addOption(optionsList, index, opt, question.answerIndex === i);
  });

  addOptionBtn.onclick = () => addOption(optionsList, index);
  removeQuestionBtn.onclick = () => {
    quiz.questions.splice(index, 1);
    renderQuestions();
  };

  return block;
}

function addOption(optionsList, qIndex, value = '', isCorrect = false) {
  const optionDiv = document.createElement('div');
  optionDiv.className = 'option-item';
  optionDiv.innerHTML = `
    <input type="text" class="option-input" placeholder="Option text" value="${value}">
    <input type="radio" name="correct-${qIndex}" class="correct-radio" ${isCorrect ? 'checked' : ''}>
    <span class="correct-label">Correct</span>
    <button type="button" class="remove-option-btn">Remove</button>
  `;
  optionsList.appendChild(optionDiv);

  optionDiv.querySelector('.remove-option-btn').onclick = () => {
    optionDiv.remove();
  };
}

function renderQuestions() {
  questionsContainer.innerHTML = '';
  quiz.questions.forEach((q, i) => {
    const block = createQuestionBlock(i, q);
    questionsContainer.appendChild(block);
  });
}

addQuestionBtn.onclick = () => {
  quiz.questions.push({ text: '', options: [], answerIndex: null });
  renderQuestions();
};

saveQuizBtn.onclick = () => {
  // Gather quiz data
  quiz.title = quizTitleInput.value.trim();
  const questionBlocks = questionsContainer.querySelectorAll('.question-block');
  const questions = [];
  let valid = true;
  questionBlocks.forEach((block, i) => {
    const text = block.querySelector('.question-text').value.trim();
    const optionInputs = block.querySelectorAll('.option-input');
    const correctRadios = block.querySelectorAll('.correct-radio');
    const options = [];
    let answerIndex = null;
    optionInputs.forEach((opt, j) => {
      options.push(opt.value.trim());
      if (correctRadios[j].checked) answerIndex = j;
    });
    if (!text || options.length < 2 || answerIndex === null || options.some(opt => !opt)) {
      valid = false;
    }
    questions.push({ text, options, answerIndex });
  });
  if (!quiz.title || questions.length === 0 || !valid) {
    alert('Please fill out all fields, each question must have at least 2 options and a correct answer.');
    return;
  }
  quiz.questions = questions;
  // Hide creation, show taking
  quizCreationSection.style.display = 'none';
  showQuizTaking();
};

function showQuizTaking() {
  quizTakingSection.style.display = '';
  takeQuizTitle.textContent = quiz.title;
  takeQuizForm.innerHTML = '';
  quiz.questions.forEach((q, i) => {
    const qDiv = document.createElement('div');
    qDiv.className = 'question-block';
    qDiv.innerHTML = `<div><b>Q${i + 1}:</b> ${q.text}</div>`;
    q.options.forEach((opt, j) => {
      const optDiv = document.createElement('div');
      optDiv.innerHTML = `
        <label>
          <input type="radio" name="answer-${i}" value="${j}"> ${opt}
        </label>
      `;
      qDiv.appendChild(optDiv);
    });
    takeQuizForm.appendChild(qDiv);
  });
}

submitQuizBtn.onclick = () => {
  const answers = [];
  let allAnswered = true;
  quiz.questions.forEach((q, i) => {
    const selected = takeQuizForm.querySelector(`input[name="answer-${i}"]:checked`);
    if (!selected) allAnswered = false;
    answers.push(selected ? parseInt(selected.value) : null);
  });
  if (!allAnswered) {
    alert('Please answer all questions.');
    return;
  }
  // Calculate score
  let score = 0;
  answers.forEach((ans, i) => {
    if (ans === quiz.questions[i].answerIndex) score++;
  });
  // Show result
  quizTakingSection.style.display = 'none';
  quizResultSection.style.display = '';
  resultSummary.innerHTML = `You scored <b>${score}</b> out of <b>${quiz.questions.length}</b>!`;
};

retakeQuizBtn.onclick = () => {
  quizResultSection.style.display = 'none';
  showQuizTaking();
};

// Initial render
renderQuestions(); 