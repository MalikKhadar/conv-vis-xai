import React, { useState, useEffect } from 'react';
import '@chatscope/chat-ui-kit-styles/dist/default/styles.min.css';
import { Button } from '@chatscope/chat-ui-kit-react';
import ConfidenceDropdown from './ConfidenceDropdown';
import { useAddCustomData, useLogger } from './Logger';

const QuizComponent = ({ setQuestions, setDone, setRecentlySelectedOption }) => {
  // Import all PNG images from the specified directory
  const images = import.meta.glob('/src/assets/nonTutorial/questions/*.png');

  const [currentIndex, setCurrentIndex] = useState(-1);
  const [quizCompleted, setQuizCompleted] = useState(0);
  const [answers, setAnswers] = useState({});
  const [selectedOption, setSelectedOption] = useState(-1);
  const [shuffledQuestions, setShuffledQuestions] = useState([]);
  const [indexMap, setIndexMap] = useState({});
  const [confidenceRating, setConfidenceRating] = useState("");
  const { addLog, logs } = useLogger();
  const addCustomData = useAddCustomData();
  const [imageSrc, setImageSrc] = useState(null);

  useEffect(() => {
    const loadQuestions = async () => {
      const questions = await import('/src/assets/nonTutorial/questions/questions.json');
      const questionsData = questions.default || questions;

      const selectRandomFromArray = (array) => array[Math.floor(Math.random() * array.length)];

      const processQuestions = (questions) => questions.map(question =>
        Array.isArray(question) ? selectRandomFromArray(question) : question
      );

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

        // Set questions for the system message in ChatComponent
        setQuestions(JSON.stringify(processedQuestions.map(q => q.Prompt), null, 2));
        setCurrentIndex(0);
      } else {
        console.error(`No questions found`);
      }
    };

    loadQuestions();
  }, [setQuestions]);

  useEffect(() => {
    if (quizCompleted) {
      Object.keys(answers).forEach((key) => {
        addCustomData(`q${parseInt(key) + 1}`, answers[key][0].toString());
        addCustomData(`c${parseInt(key) + 1}`, answers[key][1] - 1);
      });
      setDone(true);
    }
  }, [quizCompleted, answers, addCustomData, setDone]);

  useEffect(() => {
    const currentQuestion = shuffledQuestions[currentIndex];

    if (!currentQuestion?.Image) {
      setImageSrc(null);
      return;
    }

    const imagePath = currentQuestion.Image;

    if (imagePath) {
      // Ensure the imagePath starts with a leading '/'
      const formattedImagePath = imagePath.startsWith('/') ? imagePath : `/${imagePath}`;

      // Check if the formatted path exists in the images object
      if (images[formattedImagePath]) {
        images[formattedImagePath]().then((module) => {
          setImageSrc(module.default);
        });
      } else {
        setImageSrc(null);
      }
    } else {
      setImageSrc(null);
    }
  }, [currentIndex]);

  const handleOptionClick = (option, index) => {
    setRecentlySelectedOption(true);
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

  if (!shuffledQuestions.length) {
    return <div>Loading...</div>;
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', width: "100%", height: "100%" }}>
      <div style={{ display: 'flex', flexDirection: 'column', width: "100%", height: "100%", overflow: 'hidden' }}>
        <h3 style={{ whiteSpace: 'pre-wrap', fontWeight: 'normal', flexShrink: 0 }}>
          <b>Question {currentIndex + 1}/{shuffledQuestions.length}</b>: {shuffledQuestions[currentIndex].Prompt}
        </h3>
        {imageSrc && (
          <div style={{ flex: '1', display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: '10px' }}>
            <img
              src={imageSrc}
              alt="Question related"
              style={{ maxHeight: "45vh", objectFit: 'contain' }}
            />
          </div>
        )}
        <div style={{ display: "flex", flexFlow: "column" }}>
          {shuffledQuestions[currentIndex].Options.map((option, index) => (
            <Button
              key={index}
              border
              onClick={() => handleOptionClick(option, index)}
              style={{
                margin: '2px',
                backgroundColor: index === selectedOption ? '#c6e3fa' : 'white',
                flex: "1 0 auto"
              }}
            >
              {option}
            </Button>
          ))}
        </div>
        <div style={{ height: '1em' }} />
        <div style={{ display: "flex", flexFlow: "row", width: "100%", alignItems: "center", marginTop: '10px' }}>
          <ConfidenceDropdown
            confidenceRating={confidenceRating}
            setConfidenceRating={setConfidenceRating}
            style={{ flexShrink: 0, marginRight: '10px' }}
          />
          <Button
            border
            onClick={handleSubmit}
            disabled={!(selectedOption >= 0 && confidenceRating)}
            style={{ flexShrink: 0, height: "100%" }}
          >
            Submit
          </Button>
        </div>
      </div>
    </div>
  );
};

export default QuizComponent;