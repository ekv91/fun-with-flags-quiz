document.addEventListener('DOMContentLoaded', async function() {
    const resultEl = document.getElementsByClassName('result')[0];
    const nextButton = document.querySelector('.next'); // Select the Next Question button

    async function fetchQuestions() {
        try {
            const response = await fetch('questions.json');
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return await response.json();
        } catch (error) {
            console.error('There has been a problem with your fetch operation:', error);
            return [];
        }
    }

    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    }

    const questions = await fetchQuestions();
    shuffleArray(questions);
    let currentQuestionIndex = 0;
    let correctAnswers = 0;
    let incorrectAnswers = 0;
    let answerSelected = false;

    function showQuestion() {
        answerSelected = false; // Reset the answer flag for each new question
        if (currentQuestionIndex >= questions.length) {
            alert('Quiz completed! Your score: ' + correctAnswers);
            return; // Exit function if there are no more questions
        }

        const question = questions[currentQuestionIndex];
        const imgContainer = document.querySelector('.flag-img img');
        const optionsList = document.querySelector('.options ul');

        imgContainer.src = `/img/${question.img}`;
        imgContainer.alt = question.right_answer;
        optionsList.innerHTML = ''; // Clear previous options

        question.options.forEach(option => {
            const li = document.createElement('li');
            li.textContent = option;
            li.addEventListener('click', () => handleAnswer(li, option, question.right_answer));
            optionsList.appendChild(li);
        });
    }

    function handleAnswer(li, selectedOption, rightAnswer) {
        resultEl.style.opacity = 100;
        if (answerSelected) return; // Prevent further clicks after the first answer
        answerSelected = true; // Set the flag when an answer is clicked
        if (selectedOption === rightAnswer) {
            li.style.backgroundColor = 'lightgreen';
            resultEl.textContent = 'Correct, right answer is: ' + rightAnswer;
            resultEl.style.color = 'green';
            correctAnswers++;
        } else {
            li.style.backgroundColor = 'lightcoral';
            resultEl.textContent = 'Wrong, right answer is: ' + rightAnswer;
            resultEl.style.color = 'red';
            incorrectAnswers++;
        }
        updateScore();
    }

    function updateScore() {
        document.querySelector('.box h3 span').textContent = correctAnswers;
        document.querySelector('.right span').textContent = correctAnswers;
        document.querySelector('.wrong span').textContent = incorrectAnswers;
    }

    document.querySelector('.new-game').onclick = function() {
        shuffleArray(questions);
        currentQuestionIndex = 0;
        correctAnswers = 0;
        incorrectAnswers = 0;
        showQuestion();
        updateScore();
    };

    nextButton.onclick = function() {
        currentQuestionIndex++; // Increment to next question
        resultEl.style.opacity= 0;
        resultEl.textContent ='';
        showQuestion();
    };

    showQuestion(); // Show the first question
});
