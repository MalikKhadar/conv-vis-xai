import React, { useState, useEffect } from 'react';
import '@chatscope/chat-ui-kit-styles/dist/default/styles.min.css';
import { Button } from '@chatscope/chat-ui-kit-react';
import TextField from '@mui/material/TextField';
import ConfidenceDropdown from './ConfidenceDropdown';
import { useAddCustomData, useLogger } from './Logger';

const QuizComponent = ({ datapointPath, datapointIndex, setDatapointIndex, isChatting }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [quizCompleted, setQuizCompleted] = useState(0);
  const [answers, setAnswers] = useState({});
  const [explanation, setExplanation] = useState("");
  const [selectedOption, setSelectedOption] = useState("");
  const [shuffledQuestions, setShuffledQuestions] = useState([]);
  const [indexMap, setIndexMap] = useState({});
  const [confidenceRating, setConfidenceRating] = useState("");
  const { addLog, logs } = useLogger();
  const addCustomData = useAddCustomData();

  useEffect(() => {
    const loadQuestions = async () => {
      const questions = import.meta.glob('/src/assets/datapoints/**/questions.json');
      const questionsPath = Object.keys(questions).find(path => path.includes(datapointPath));
      setCurrentIndex(0);
      setAnswers({});

      if (questionsPath) {
        const questionsModule = await questions[questionsPath]();
        let questionsData = questionsModule.default || questionsModule;
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
      } else {
        console.error(`No questions found for path: ${datapointPath}`);
      }
    };

    loadQuestions();
  }, [datapointPath]);

  const handleOptionClick = (option) => {
    setSelectedOption(option);
    addLog('Selected option ' + option);
  };

  const handleSubmit = () => {
    const originalIndex = indexMap[currentIndex];

    setAnswers((prevAnswers) => ({
      ...prevAnswers,
      [originalIndex]: [selectedOption, explanation, confidenceRating],
    }));

    addLog('Submitted question ' + currentIndex.toString());

    setExplanation("");
    setSelectedOption("");
    setConfidenceRating("");

    if (currentIndex < shuffledQuestions.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      setQuizCompleted(quizCompleted + 1);
    }
  };

  useEffect(() => {
    if (quizCompleted) {
      let datapoint = datapointPath.split('/').pop();

      Object.keys(answers).forEach((key, index) => {
        addCustomData(`q${datapoint}.${parseInt(key) + 1}`, answers[key][0]);
        addCustomData(`e${datapoint}.${parseInt(key) + 1}`, answers[key][1]);
        addCustomData(`c${datapoint}.${parseInt(key) + 1}`, answers[key][2]-1);
      });

      setDatapointIndex(datapointIndex + 1);
    }
  }, [quizCompleted]);

  if (!shuffledQuestions.length) {
    return <div>Loading...</div>;
  }

  const currentQuestion = shuffledQuestions[currentIndex];

  return (
    <div style={{ display: 'flex', width: '100%', height: "100%" }}>
      <h3 style={{ whiteSpace: 'pre-wrap', fontWeight: 'normal', flex: '1' }}>
        <b>Question {currentIndex + 1}/{shuffledQuestions.length}</b>: {currentQuestion.question}
      </h3>
      <div style={{ display: 'flex', flexDirection: 'column', width: '40%', height: "100%" }}>
        <div style={{ height: '1em' }} />
        {currentQuestion.options.map((option, index) => (
          <Button
            key={index}
            border
            onClick={() => handleOptionClick(option)}
            style={{
              margin: '2px',
              backgroundColor: selectedOption === option ? '#c6e3fa' : 'white',
              flex: "1"
            }}
          >
            {option}
          </Button>
        ))}
        <TextField
          multiline
          placeholder={`Explain your reasoning${currentQuestion.explain ? ' (response required)' : ''}`}
          onChange={(e) => setExplanation(e.target.value)}
          value={explanation}
          style={{ margin: '5px 2px', overflowY: 'auto', maxHeight: "10vh" }}
        />
        <div style={{ flex: "10" }} />
        <ConfidenceDropdown confidenceRating={confidenceRating} setConfidenceRating={setConfidenceRating} />
        <Button
          border
          onClick={handleSubmit}
          disabled={!selectedOption || !confidenceRating || (currentQuestion.explain && explanation.trim().length < 10)}
        >
          Submit
        </Button>
      </div>
    </div>
  );
};

export default QuizComponent;