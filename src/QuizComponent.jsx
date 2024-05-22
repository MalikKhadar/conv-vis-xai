import React, { useState } from 'react';
import questionsData from './questions.json';
import '@chatscope/chat-ui-kit-styles/dist/default/styles.min.css';
import { Button } from '@chatscope/chat-ui-kit-react';
import $ from 'jquery';

function QuizComponent() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [quizCompleted, setQuizCompleted] = useState(false);  // State to track completion
  const [answers, setAnswers] = useState({}); // State to store user's answers

  const handleOptionClick = (questionIndex, answer) => {
    if (currentIndex < questionsData.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      setQuizCompleted(true);  // Set quiz completion state to true

      // send answer data to google sheets
      let data = {
        participantId: "Joe of the Schmoe clan",
      };

      // need to make finalAnswers since answers state takes a moment to update
      const finalAnswers = {
        ...answers,
        [questionIndex]: answer,
      }

      // Dynamically add answers to data
      Object.keys(finalAnswers).forEach((key, index) => {
        data[`q${parseInt(key) + 1}`] = finalAnswers[key];
      });
      $.ajax({
        url: "https://script.google.com/macros/s/AKfycbweLsnfsFu-Q59DRQwoGUi3bz1BmoYXGcNaLOqmWYF6OErfcd3-VLFmLe-2LtS7-rZP/exec",
        type: "post",
        data: data
      });
    }

    // Update answers state with the current question's answer
    setAnswers((prevAnswers) => ({
      ...prevAnswers,
      [questionIndex]: answer,
    }));
  };

  const currentQuestion = questionsData[currentIndex];

  if (quizCompleted) {
    return <h3 style={{ textAlign: "center" }}>Quiz complete! Do the next thing you're supposed to do</h3>
  }

  return (
    <div style={{ textAlign: "center" }}>
      <h2>Question {currentIndex + 1}/{questionsData.length}</h2>
      <h3>{currentQuestion.question}</h3>
      <div style={{ display: "flex", flexDirection: "column", width: "100%" }}>
        {currentQuestion.options.map((option, index) => (
          <Button border key={index} onClick={() => handleOptionClick(currentIndex, option)}>
            {option}
          </Button>
        ))}
      </div>
    </div>
  );
}

export default QuizComponent;