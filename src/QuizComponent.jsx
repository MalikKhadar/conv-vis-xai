import React, { useState, useEffect } from 'react';
import questionsData from './assets/questions.json';
import '@chatscope/chat-ui-kit-styles/dist/default/styles.min.css';
import { Button } from '@chatscope/chat-ui-kit-react';
import TextField from '@mui/material/TextField';
import $ from 'jquery';

function QuizComponent() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [quizCompleted, setQuizCompleted] = useState(false); // State to track completion
  const [answers, setAnswers] = useState({}); // State to store user's answers
  const [explanation, setExplanation] = useState(""); // State to track explanation input
  const [selectedOption, setSelectedOption] = useState(""); // State to track selected option
  const [shuffledQuestions, setShuffledQuestions] = useState([]);
  const [indexMap, setIndexMap] = useState({});

  useEffect(() => {
    // Function to shuffle array
    const shuffleArray = (array) => {
      for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
      }
      return array;
    };

    // Shuffle questions and create an index map
    const shuffled = shuffleArray([...questionsData]);
    const map = shuffled.reduce((acc, question, index) => {
      acc[index] = questionsData.findIndex(q => q.question === question.question);
      return acc;
    }, {});

    setShuffledQuestions(shuffled);
    setIndexMap(map);
  }, []);

  const handleOptionClick = (option) => {
    setSelectedOption(option);
  }

  const handleSubmit = () => {
    const originalIndex = indexMap[currentIndex];

    setAnswers((prevAnswers) => ({
      ...prevAnswers,
      [originalIndex]: [selectedOption, explanation],
    }));

    setExplanation("");
    setSelectedOption("");

    if (currentIndex < shuffledQuestions.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      setQuizCompleted(true); // Set quiz completion state to true
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
      });

      $.ajax({
        url: "https://script.google.com/macros/s/AKfycbweLsnfsFu-Q59DRQwoGUi3bz1BmoYXGcNaLOqmWYF6OErfcd3-VLFmLe-2LtS7-rZP/exec",
        type: "post",
        data: data
      });
    }
  }, [quizCompleted]);

  if (!shuffledQuestions.length) {
    return <div>Loading...</div>;
  }

  const currentQuestion = shuffledQuestions[currentIndex];

  if (quizCompleted) {
    return <h3 style={{ textAlign: "center" }}>Quiz complete! Do the next thing you're supposed to do</h3>
  }

  return (
    <div style={{ textAlign: "center" }}>
      <h2>Question {currentIndex + 1}/{shuffledQuestions.length}</h2>
      <h3>{currentQuestion.question}</h3>
      <div style={{ display: "flex", flexDirection: "column", width: "100%" }}>
        {currentQuestion.options.map((option, index) => (
          <Button
            key={index}
            border
            onClick={() => handleOptionClick(option)}
            style={{
              margin: '5px',
              backgroundColor: selectedOption === option ? '#c6e3fa' : 'white',
            }}
          >
            {option}
          </Button>
        ))}
        {currentQuestion.explain ? (
          <TextField
            multiline
            placeholder='Explain your reasoning'
            onChange={(e) => setExplanation(e.target.value)}
            value={explanation}
            style={{ margin: '5px 5px' }}
          />
        ) : null}
        <Button
          border
          onClick={handleSubmit}
          disabled={!selectedOption || (currentQuestion.explain && explanation.trim() === "")}
          style={{ marginTop: '30px' }}
        >
          Submit
        </Button>
      </div>
    </div>
  );
}

export default QuizComponent;
