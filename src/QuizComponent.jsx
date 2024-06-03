import React, { useState, useEffect } from 'react';
import questionsData from './assets/questions.json';
import '@chatscope/chat-ui-kit-styles/dist/default/styles.min.css';
import { Button } from '@chatscope/chat-ui-kit-react';
import TextField from '@mui/material/TextField';
import $ from 'jquery';

function QuizComponent() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [quizCompleted, setQuizCompleted] = useState(false);  // State to track completion
  const [answers, setAnswers] = useState({}); // State to store user's answers
  const [explanation, setExplanation] = useState(""); // State to track explanation input

  const handleOptionClick = (questionIndex, answer) => {
    // Update answers state with the current question's answer
    setAnswers((prevAnswers) => ({
      ...prevAnswers,
      [questionIndex]: [answer, explanation],
    }));

    setExplanation("");

    if (currentIndex < questionsData.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      setQuizCompleted(true);  // Set quiz completion state to true
    }
  }

  useEffect(() => {
    if (quizCompleted) {
      // send answer data to google sheets
      let data = {
        participantId: "Joe of the Schmoe clan",
      };

      // Dynamically add answers to data
      Object.keys(answers).forEach((key, index) => {
        data[`q${parseInt(key) + 1}`] = answers[key][0];
        data[`e${parseInt(key) + 1}`] = answers[key][1];
        console.log(answers[key]);
      });
      $.ajax({
        url: "https://script.google.com/macros/s/AKfycbweLsnfsFu-Q59DRQwoGUi3bz1BmoYXGcNaLOqmWYF6OErfcd3-VLFmLe-2LtS7-rZP/exec",
        type: "post",
        data: data
      });
    }
  }, [quizCompleted]);

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
          <Button border disabled={currentQuestion.explain && explanation.trim() === ""} key={index} onClick={() => handleOptionClick(currentIndex, option)}>
            {option}
          </Button>
        ))}
        {currentQuestion.explain ? <TextField multiline placeholder='Explain your reasoning and then select one of the options above'
          onChange={(e) => setExplanation(e.target.value)} /> : null}
      </div>
    </div>
  );
}

export default QuizComponent;