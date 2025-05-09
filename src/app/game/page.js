// /app/game/page.js
'use client';

import { useState, useEffect } from 'react';
import {client} from '../../../sanity.js'; // Adjust the path if your sanity.js is located elsewhere
import '../../styles/guess-it-game.css'; // Ensure this path matches your CSS file location

export default function GamePage() {
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [hintIndex, setHintIndex] = useState(0);

  useEffect(() => {
    const fetchQuestions = async () => {
      const data = await client.fetch(
        `*[_type == "guessItGame"]{
          question,
          option1,
          option2,
          option3,
          option4,
          answer,
          hint1,
          hint2,
          hint3,
          category,
          "imageUrl": image.asset->url
        }`
      );
      setQuestions(data);
    };

    fetchQuestions();
  }, []);

  if (questions.length === 0) {
    return <div className='game-page-loading'>Loading Post...</div>;
  }

  const currentQuestion = questions[currentQuestionIndex];
  const options = [
    currentQuestion.option1,
    currentQuestion.option2,
    currentQuestion.option3,
    currentQuestion.option4,
  ];
  const hints = [currentQuestion.hint1, currentQuestion.hint2, currentQuestion.hint3];

  const isAnswered = selectedOption !== null;

  const handleOptionClick = (option) => {
    if (!isAnswered) {
      setSelectedOption(option);
    }
  };

  const showNextHint = () => {
    if (hintIndex < hints.length) {
      setHintIndex(hintIndex + 1);
    }
  };

  const goToNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedOption(null);
      setHintIndex(0);
    }
  };

  const goToPreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
      setSelectedOption(null);
      setHintIndex(0);
    }
  };

  return (

    <div className="game-wrapper">




      <div className="game-container">




        <div className="game-half game-left">

          <div className="game-question">{currentQuestion.question}</div>

          {currentQuestion.imageUrl && (
          <div className="question-image">
          <img src={currentQuestion.imageUrl} alt="Question visual hint" />
          </div>
          )}

          <div className="options">
            {options.map((option, index) => {
              const isCorrect = option === currentQuestion.answer;
              const className =
                selectedOption === null
                  ? 'option-btn'
                  : isCorrect
                  ? 'option-btn correct'
                  : selectedOption === option
                  ? 'option-btn wrong'
                  : 'option-btn';
              return (
                <button
                  key={index}
                  className={className}
                  onClick={() => handleOptionClick(option)}
                  disabled={isAnswered}
                >
                  {option}
                </button>
              );
            })}
          </div>

        </div>




        <div className="game-half game-right">

          <div>

            <button className="hint-button" onClick={showNextHint}>
              Show Hint
            </button>

            <span className="hints-used">{hintIndex} hint(s) used</span>

          </div>


          <div className="hint-section">
            {hints.slice(0, hintIndex).map((hint, i) => (
              <div key={i} className="hint-text">
                {hint}
              </div>
            ))}
          </div>


        </div>



      </div>





      <div className="nav-buttons">

        <button onClick={goToPreviousQuestion} disabled={currentQuestionIndex === 0}>
          Previous
        </button>

        <button onClick={goToNextQuestion} disabled={currentQuestionIndex === questions.length - 1}>
          Next
        </button>

      </div>





    </div>
  );
}
