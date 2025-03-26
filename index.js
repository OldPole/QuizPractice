const data = [
    {
        question: 'Вопрос 1',
        answers: [
            {
                id: '1',
                value: 'Ответ 1',
                correct: true,
            },
            {
                id: '2',
                value: 'Ответ 2',
                correct: false,
            },
            {
                id: '3',
                value: 'Ответ 3',
                correct: false,
            },
        ]
    },
    {
        question: 'Вопрос 2',
        answers: [
            {
                id: '4',
                value: 'Ответ 4',
                correct: false,
            },
            {
                id: '5',
                value: 'Ответ 5',
                correct: true,
            },
        ]
    },
];

let localResults = {};

const quiz = document.getElementById('quiz');
const questions = document.getElementById('questions');
const indicator = document.getElementById('indicator');
const results = document.getElementById('results');
const btnNext = document.getElementById('btn-next');
const btnRestart = document.getElementById('btn-restart');

const renderQuestions = (index) => {
    renderIndicator(index + 1);

    questions.dataset.currentStep = index;

    const renderAnswers = () => data[index].answers
        .map((answer) => `
            <li>
                <label>
                    <input class="answer-input" type="radio" name=${index} value=${answer.id}>
                    ${answer.value}
                </label>
            </li>
        `)
        .join('');

    questions.innerHTML = `
        <div class="quiz-questions-item">
            <div class="quiz-questions-item__question">${data[index].question}</div>
            <ul class="quiz-questions-item__answers">${renderAnswers()}</ul>
        </div>
    `;
};

const renderResults = () => {
    let content = '';

    const getClassname = (answer, questionIndex) => {
        let classname = '';

        if(!answer.correct && localResults[questionIndex] === answer.id) {
            classname = 'answer--invalid';
        } else if(answer.correct) {
            classname = 'answer--valid';
        }

        return classname;
    }

    const getAnswers = (questionIndex) => data[questionIndex].answers
        .map((answer) => `<li class=${getClassname(answer, questionIndex)}>${answer.value}</li>`)
        .join('');

    data.forEach((question, index) => {
        content += `
        <div class="quiz-results-item">
            <div class="quiz-results-item__question">${question.question}</div>
            <ul class="quiz-results-item__answers">${getAnswers(index)}</ul>
         </div>
        `
    });

    results.innerHTML = content;
};

const renderIndicator = (currentStep) => {
    indicator.innerHTML = `${currentStep}/${data.length}`
};

quiz.addEventListener('change', (event) => {
    //логика ответа
    if(event.target.classList.contains('answer-input')) {
        localResults[event.target.name] = event.target.value;
        btnNext.disabled = false;
    }
});

quiz.addEventListener('click', (event) => {
    //нажатие на кнопку
    if(event.target.classList.contains('btn-next')){
        const nextQuestionIndex = Number(questions.dataset.currentStep) + 1;
        
        if(data.length === nextQuestionIndex){
            questions.classList.add('questions--hidden');
            indicator.classList.add('indicator--hidden');
            results.classList.add('results--visible');
            btnNext.classList.add('btn-next--hidden');
            btnRestart.classList.add('btn-restart--visible');

            renderResults();
        } else {
            renderQuestions(nextQuestionIndex);
        }

        btnNext.disabled = true;
    }

    if(event.target.classList.contains('btn-restart')){
        renderQuestions(0);
        results.innerHTML = '';

        questions.classList.remove('questions--hidden');
        indicator.classList.remove('indicator--hidden');
        results.classList.remove('results--visible');
        btnNext.classList.remove('btn-next--hidden');
        btnRestart.classList.remove('btn-restart--visible');

        renderQuestions(0);
    }
});

renderQuestions(0);