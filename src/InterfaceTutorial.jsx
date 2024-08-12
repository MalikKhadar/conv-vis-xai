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
      <StyledHeader>General Dataset Information:</StyledHeader>
      <StyledParagraph>
        <b>UCI Census Income Dataset:</b> This dataset is extracted from 1994 census data. The prediction task is to determine whether a person's income exceeds $50k a year. 24.2% of data points in the dataset actually made more than $50k.
      </StyledParagraph>
      <StyledSub>
        <b>Features:</b>
        <StyledList>
          {Object.keys(featureDescriptions).map((feature, index) => (
            <StyledListItem key={index}>{feature} - {featureDescriptions[feature]}</StyledListItem>
          ))}
        </StyledList>
      </StyledSub>
      <StyledSub>
        <b>Education levels, ranked from lowest to highest:</b>
        <StyledList>
          {ordinalEducations.map((level, index) => (
            <StyledListItem key={index}>{level}</StyledListItem>
          ))}
        </StyledList>
      </StyledSub>

      <StyledHeader>The Interface:</StyledHeader>
      {condition == "noChat" ?
        <>
          <img src={noChatExplore} style={{ width: "100%" }} />
          <img src={noChatQnA} style={{ width: "100%" }} />
        </>
        : null
      }
      {condition == "chat" ?
        <>
          <img src={chatExplore} style={{ width: "100%" }} />
          <img src={chatQnA} style={{ width: "100%" }} />
        </>
        : null
      }
      {condition == "guide" ?
        <>
          <img src={guideExplore} style={{ width: "100%" }} />
          <img src={guideQnA} style={{ width: "100%" }} />
        </>
        : null
      }
    </StyledDiv >
  );
}

export default InterfaceTutorial;