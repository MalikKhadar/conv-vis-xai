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
  backgroundColor: '#ffffff',
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
        First, you will explore the data and visualizations in the interface. A quiz will be unlocked once you've explored everything{condition != "noChat" ? " and asked 6 good questions to the bot" : ""}. The data and visualizations will remain accessible while completing the quiz.
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
            <img src={noChatExplore} style={{ maxHeight: "100vh", maxWidth: "100%" }} />
          </>
          : null
        }
        {condition == "chat" ?
          <>
            <img src={chatExplore} style={{ maxHeight: "100vh", maxWidth: "100%" }} />
          </>
          : null
        }
        {condition == "guide" ?
          <>
            <img src={guideExplore} style={{ maxHeight: "100vh", maxWidth: "100%" }} />
          </>
          : null
        }
      </StyledSub>

      <StyledSub>
        <StyledParagraph>
          The interface will look something like this once you've unlocked the quiz. <b>Some important notes:</b>
        </StyledParagraph>
        <div>
          <StyledList>
            <StyledListItem>You cannot revisit questions that have been submitted.</StyledListItem>
            <StyledListItem>You'll need to use the dropdowns (1 and 2) to answer some of the questions.</StyledListItem>
          </StyledList>
        </div>
        {condition == "noChat" ?
          <>
            <img src={noChatQnA} style={{ maxHeight: "100vh", maxWidth: "100%" }} />
          </>
          : null
        }
        {condition == "chat" ?
          <>
            <img src={chatQnA} style={{ maxHeight: "100vh", maxWidth: "100%" }} />
          </>
          : null
        }
        {condition == "guide" ?
          <>
            <img src={guideQnA} style={{ maxHeight: "100vh", maxWidth: "100%" }} />
          </>
          : null
        }
      </StyledSub>
    </StyledDiv >
  );
}

export default InterfaceTutorial;