import React, { useState, useEffect } from 'react';
import '@chatscope/chat-ui-kit-styles/dist/default/styles.min.css';
import { Button } from '@chatscope/chat-ui-kit-react';
import ConfidenceDropdown from './ConfidenceDropdown';
import { useAddCustomData, useLogger } from './Logger';

const QuizComponent = ({ setQuestions, setDone }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [quizCompleted, setQuizCompleted] = useState(0);
  const [answers, setAnswers] = useState({});
  const [selectedOption, setSelectedOption] = useState(-1);
  const [shuffledQuestions, setShuffledQuestions] = useState([]);
  const [indexMap, setIndexMap] = useState({});
  const [confidenceRating, setConfidenceRating] = useState("");
  const { addLog, logs } = useLogger();
  const addCustomData = useAddCustomData();

  const loadQuestions = async () => {
    const questions = await import('/src/assets/nonTutorial/questions.json');
    const questionsData = questions.default || questions;
    console.log(questionsData);

    const selectRandomFromArray = (array) => {
      return array[Math.floor(Math.random() * array.length)];
    };

    const processQuestions = (questions) => {
      return questions.map(question => {
        if (Array.isArray(question)) {
          return selectRandomFromArray(question);
        }
        return question;
      });
    };

    if (questionsData && questionsData.length > 0) {
      const processedQuestions = processQuestions(questionsData);

      const shuffleArray = (array) => {
        for (let i = array.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
      };

      const shuffled = shuffleArray([...processedQuestions]);
      const map = shuffled.reduce((acc, question, index) => {
        acc[index] = processedQuestions.findIndex(q => q.Prompt === question.Prompt);
        return acc;
      }, {});

      setShuffledQuestions(shuffled);
      setIndexMap(map);

      // Extract question texts and format as JSON-like string
      const questionTexts = processedQuestions.map(q => q.Prompt);
      // use setQuestions to transmit questions to system message in ChatComponent
      setQuestions(JSON.stringify(questionTexts, null, 2));
    } else {
      console.error(`No questions found`);
    }
  };

  useEffect(() => {
    loadQuestions();
  }, []);

  const handleOptionClick = (option, index) => {
    setSelectedOption(index);
    addLog('Selected option ' + option);
  };

  const handleSubmit = () => {
    const originalIndex = indexMap[currentIndex];

    setAnswers((prevAnswers) => ({
      ...prevAnswers,
      [originalIndex]: [selectedOption, confidenceRating],
    }));

    addLog('Submitted question ' + currentIndex.toString());

    setSelectedOption(-1);
    setConfidenceRating("");

    if (currentIndex < shuffledQuestions.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      setQuizCompleted(quizCompleted + 1);
    }
  };

  useEffect(() => {
    if (quizCompleted) {
      Object.keys(answers).forEach((key, index) => {
        addCustomData(`q${parseInt(key) + 1}`, answers[key][0].toString());
        addCustomData(`c${parseInt(key) + 1}`, answers[key][1] - 1);
      });
      setDone(true);
    }
  }, [quizCompleted]);

  if (!shuffledQuestions.length) {
    return <div>Loading...</div>;
  }

  const currentQuestion = shuffledQuestions[currentIndex];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', width: "100%", height: "100%", justifyContent: "flex-end" }}>
      <div style={{ display: 'flex', flexDirection: 'column', width: "100%", height: "100%" }}>
        <h3 style={{ whiteSpace: 'pre-wrap', fontWeight: 'normal', flex: '1' }}>
          <b>Question {currentIndex + 1}/{shuffledQuestions.length}</b>: {currentQuestion.Prompt}
        </h3>
        {currentQuestion.Image && (
          <img
            src={currentQuestion.Image}
            alt="Question related"
            style={{ maxWidth: '100%', maxHeight: '300px', objectFit: 'contain', marginBottom: '10px' }}
          />
        )}
        {currentQuestion.Options.map((option, index) => (
          <Button
            key={index}
            border
            onClick={() => handleOptionClick(option, index)}
            style={{
              margin: '2px',
              backgroundColor: index === selectedOption ? '#c6e3fa' : 'white',
              flex: "1"
            }}
          >
            {option}
          </Button>
        ))}
        <div style={{ height: '1em' }} />
        <ConfidenceDropdown confidenceRating={confidenceRating} setConfidenceRating={setConfidenceRating} style={{ paddingBottom: "10px" }} />
        <div style={{ flex: "10" }} />
        <Button
          border
          onClick={handleSubmit}
          disabled={!(selectedOption >= 0 && confidenceRating)}
        >
          Submit
        </Button>
      </div>
      <div style={{ height: "5px" }} />
    </div>
  );
};

export default QuizComponent;