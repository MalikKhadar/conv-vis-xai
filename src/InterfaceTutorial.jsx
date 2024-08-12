import React from 'react';
import { styled } from '@mui/material/styles';
import noChatExplore from "./assets/tutorial/interface/nochat_explore.png";
import noChatQnA from "./assets/tutorial/interface/nochat_q&a.png";
import chatExplore from "./assets/tutorial/interface/chat_explore.png";
import chatQnA from "./assets/tutorial/interface/chat_q&a.png";
import guideExplore from "./assets/tutorial/interface/guide_explore.png";
import guideQnA from "./assets/tutorial/interface/guide_q&a.png";

const StyledDiv = styled('div')({
  margin: '20px',
  padding: '20px',
  backgroundColor: '#f5f5f5',
  borderRadius: '5px',
  boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
});

const StyledSub = styled('div')({
  margin: '10px',
  padding: '10px',
  backgroundColor: '#ececec',
  borderRadius: '5px',
});

const StyledHeader = styled('h2')({
  marginBottom: '10px',
});

const StyledParagraph = styled('p')({
  marginBottom: '10px',
});

const StyledList = styled('ul')({
  paddingLeft: '20px',
});

const StyledListItem = styled('li')({
  marginBottom: '5px',
});

const InterfaceTutorial = ({ condition }) => {
  const featureDescriptions = {
    age: 'age of the individual in years',
    workclass: 'type of employment the individual has',
    'education': 'the highest level of education completed by the individual',
    'marital-status': 'marital status of the individual',
    occupation: 'type of occupation the individual is engaged in',
    relationship: 'relationship status of the individual',
    race: 'race of the individual',
    sex: 'sex of the individual',
    'capital-gain': 'profit the individual made from the sale of capital assets',
    'capital-loss': 'loss the individual incurred from selling capital assets for lower prices than their purchase price',
    'hours-per-week': 'number of hours worked per week',
    'native-country': 'native country of the individual',
  };

  const ordinalEducations = [
    "Preschool",
    "1st-4th",
    "5th-6th",
    "7th-8th",
    "9th",
    "10th",
    "11th",
    "12th",
    "HS-grad (High school graduate)",
    "Some-college",
    "Assoc-voc (Associate - vocational)",
    "Assoc-acdm (Associate - academic)",
    "Bachelors",
    "Masters",
    "Prof-school (Professional school)",
    "Doctorate"
  ];

  return (
    <StyledDiv>
      <StyledHeader>The Task:</StyledHeader>
      <StyledParagraph>
        Your task is to answer some questions about a machine learning model. You will use an interface that displays data and visualizations about the model to help answer the questions.
      </StyledParagraph>
      <StyledParagraph>
        This page has instructions on how to use the interface. At the very bottom of this page is a button that will take you to the interface.
      </StyledParagraph>

      <StyledHeader>The Interface:</StyledHeader>
      <StyledParagraph>
        First, you will explore the data and visualizations in the interface. A quiz will be unlocked once you've explored everything. The data and visualizations will remain accessible while completing the quiz.
      </StyledParagraph>
      <StyledParagraph>
        <b>Note: </b> You don't need to visit every version of every visual to unlock the quiz. You'll only need to view one scatter plot out of the 12 available, and one version of each local visualization.
      </StyledParagraph>
      <StyledSub>
        <StyledParagraph>
          This is how the interface will look when you first open it:
        </StyledParagraph>
        {condition == "noChat" ?
          <>
            <img src={noChatExplore} style={{ width: "100%" }} />
          </>
          : null
        }
        {condition == "chat" ?
          <>
            <img src={chatExplore} style={{ width: "100%" }} />
          </>
          : null
        }
        {condition == "guide" ?
          <>
            <img src={guideExplore} style={{ width: "100%" }} />
          </>
          : null
        }
      </StyledSub>

      <StyledSub>
        <StyledParagraph>
          The interface will look something like this once you've unlocked the quiz. <b>Some important notes:</b>
          <ul>
            <li>You cannot revisit questions that have been submitted.</li>
            <li>You'll need to use the dropdowns (1 and 2) to answer some of the questions.</li>
          </ul>
        </StyledParagraph>
        {condition == "noChat" ?
          <>
            <img src={noChatQnA} style={{ width: "100%" }} />
          </>
          : null
        }
        {condition == "chat" ?
          <>
            <img src={chatQnA} style={{ width: "100%" }} />
          </>
          : null
        }
        {condition == "guide" ?
          <>
            <img src={guideQnA} style={{ width: "100%" }} />
          </>
          : null
        }
      </StyledSub>
    </StyledDiv >
  );
}

export default InterfaceTutorial;