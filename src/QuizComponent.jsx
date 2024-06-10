import React, { useState, useEffect } from 'react';
import '@chatscope/chat-ui-kit-styles/dist/default/styles.min.css';
import { Button } from '@chatscope/chat-ui-kit-react';
import TextField from '@mui/material/TextField';
import $ from 'jquery';

const QuizComponent = ({ datapointPath }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [answers, setAnswers] = useState({});
  const [explanation, setExplanation] = useState("");
  const [selectedOption, setSelectedOption] = useState("");
  const [shuffledQuestions, setShuffledQuestions] = useState([]);
  const [indexMap, setIndexMap] = useState({});
  const [questionsData, setQuestionsData] = useState([]);

  useEffect(() => {
    const loadQuestions = async () => {
      const questions = import.meta.glob('/src/assets/datapoints/**/questions.json');
      const questionsPath = Object.keys(questions).find(path => path.includes(datapointPath));
      
      if (questionsPath) {
        const questionsModule = await questions[questionsPath]();
        setQuestionsData(questionsModule.default || questionsModule);
      } else {
        console.error(`No questions found for path: ${datapointPath}`);
      }
    };
    
    loadQuestions();
  }, [datapointPath]);

  useEffect(() => {
    if (questionsData.length > 0) {
      const shuffleArray = (array) => {
        for (let i = array.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
      };

      const shuffled = shuffleArray([...questionsData]);
      const map = shuffled.reduce((acc, question, index) => {
        acc[index] = questionsData.findIndex(q => q.question === question.question);
        return acc;
      }, {});

      setShuffledQuestions(shuffled);
      setIndexMap(map);
    }
  }, [questionsData]);

  const handleOptionClick = (option) => {
    setSelectedOption(option);
  };

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
      setQuizCompleted(true);
    }
  };

  useEffect(() => {
    if (quizCompleted) {
      let data = {
        participantId: "Joe of the Schmoe clan",
      };

      Object.keys(answers).forEach((key, index) => {
        data[`q${parseInt(key) + 1}`] = answers[key][0];
        data[`e${parseInt(key) + 1}`] = answers[key][1];
      });

      $.ajax({
        url: "https://script.google.com/macros/s/AKfycbweLsnfsFu-Q59DRQwoGUi3bz1BmoYXGcNaLOqmWYF6OErfcd3-VLFmLe-2LtS7-rZP/exec",
        type: "post",
        data: data,
      });
    }
  }, [quizCompleted]);

  if (!shuffledQuestions.length) {
    return <div>Loading...</div>;
  }

  const currentQuestion = shuffledQuestions[currentIndex];

  if (quizCompleted) {
    return (
      <div>
        <h3 style={{ textAlign: "center" }}>Quiz complete</h3>
        <p>Thank you for participating! You can exit the page</p>
      </div>
    );
  }

  return (
    <div style={{ textAlign: "center" }}>
      <h2>Question {currentIndex + 1}/{shuffledQuestions.length}</h2>
      <h3 style={{ whiteSpace: 'pre-wrap' }}>{currentQuestion.question}</h3>
      <div style={{ display: "flex", flexDirection: "column", width: "100%" }}>
        {currentQuestion.options.map((option, index) => (
          <Button
            key={index}
            border
            onClick={() => handleOptionClick(option)}
            style={{
              margin: '2px',
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
            style={{ margin: '5px 2px' }}
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
};

export default QuizComponent;