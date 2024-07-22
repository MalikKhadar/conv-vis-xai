import React from 'react';
import { useState, useEffect } from 'react'
import { styled } from '@mui/material/styles';
import ImageRow from './ImageRow';
import more from "./assets/tutorial/more.png";
import less from "./assets/tutorial/less.png";
import similar from "./assets/tutorial/similar.png";
import counter from "./assets/tutorial/counter.png";
import waterfall from "./assets/tutorial/waterfall.png";
import bar from "./assets/tutorial/bar.png";
import age from "./assets/tutorial/age.png";
import workclass from "./assets/tutorial/workclass.png";
import education from "./assets/tutorial/education.png";
import marital from "./assets/tutorial/marital.png";
import occupation from "./assets/tutorial/occupation.png";
import relationship from "./assets/tutorial/relationship.png";
import race from "./assets/tutorial/race.png";
import sex from "./assets/tutorial/sex.png";
import gain from "./assets/tutorial/gain.png";
import loss from "./assets/tutorial/loss.png";
import hours from "./assets/tutorial/hours.png";
import country from "./assets/tutorial/country.png";
import baseline from "./assets/tutorial/baseline.png";
import chat from "./assets/tutorial/chat.png";

const featureImages = [
  age,
  workclass,
  education,
  marital,
  occupation,
  relationship,
  race,
  sex,
  gain,
  loss,
  hours,
  country
]

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

const TutorialPage = () => {
  const [isChatting, setIsChatting] = useState(false);

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

  useEffect(() => {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);

    if (urlParams.has('chat')) {
      setIsChatting(true);
    }
  },
    []);

  return (
    <StyledDiv>
      <StyledHeader>Introduction:</StyledHeader>
      <StyledParagraph>
        In this study,
        you will use an interface to answer questions about a machine learning model trained on the UCI Census income dataset. This tutorial describes the dataset, the model, the interface, and the visualizations presented in the interface. You can access this tutorial at any time from the interface.
      </StyledParagraph>

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

      <StyledHeader>Model details:</StyledHeader>
      <StyledParagraph>
        For this task, the model predicted that 21.2% of data points made more than $50k. The accuracy of the model on its training set is 90.1%, and the accuracy of the model on its test set is 87.3%. Below, you'll find two examples of data points and predictions that the model made on them (these data points won't be used in the interface)
      </StyledParagraph>

      <StyledSub>
        <StyledParagraph>
          <b>Positive Prediction Example:</b> The model predicts that this data point makes <b>over $50k</b>:
        </StyledParagraph>
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: "-300px" }}>
          <img src={more} />
        </div>
        <StyledParagraph>
          <b>Negative Prediction Example:</b> The model predicts that this data point makes <b>less than $50k</b>:
        </StyledParagraph>
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: "-300px" }}>
          <img src={less} />
        </div>
      </StyledSub>

      <StyledHeader>Using the Interface:</StyledHeader>
      <StyledParagraph>
        You will use the following interface to answer sets of 4 questions about two data points, one after the other.
      </StyledParagraph>
      <StyledSub>
        {!isChatting ?
          <div>
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <img src={baseline} style={{ maxHeight: '70%', maxWidth: '70%' }} />
            </div>
            <StyledParagraph>
              The interface presents multiple explanations to help you understand the model’s prediction, allowing you to answer a series of questions for each data point. There are <b>5 components</b> in the interface:
            </StyledParagraph>
            <div>
              <StyledList>
                <StyledListItem><b>1:</b> The prediction on the main data point, stating whether the model predicted that it made more or less than $50k.</StyledListItem>
                <StyledListItem><b>2:</b> The multiple choice quiz. You will use information from the explanations to answer these questions. Select one of the answers below the question text, explain why you selected it in the “Explain your reasoning” field, select an option from the “Confidence in your answer” dropdown, and then click the “Submit” button for each question.</StyledListItem>
                <StyledListItem><b>3:</b> The current explanation.</StyledListItem>
                <StyledListItem><b>4:</b> The list of explanations. These can be clicked to change the current explanation. The current explanation is highlighted in this list.</StyledListItem>
                <StyledListItem><b>5:</b> The reopen tutorial button.</StyledListItem>
              </StyledList>
            </div>
          </div>
          :
          <div>
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <img src={chat} style={{ maxHeight: '70%', maxWidth: '70%' }} />
            </div>
            <StyledParagraph>
              The interface presents multiple explanations and a chat assistant to help you understand the model’s prediction, allowing you to answer a series of questions for each data point. Once you’ve entered your GPT API key, an interface with the following <b>6 components</b> will appear:
            </StyledParagraph>
            <div>
              <StyledList>
                <StyledListItem><b>1:</b> The prediction on the main data point, stating whether the model predicted that it made more or less than $50k.</StyledListItem>
                <StyledListItem><b>2:</b> The multiple choice quiz. You will use information from the explanations to answer these questions. Select one of the answers below the question text, explain why you selected it in the “Explain your reasoning” field, select an option from the “Confidence in your answer” dropdown, and then click the “Submit” button for each question.</StyledListItem>
                <StyledListItem><b>3:</b> The current explanation.</StyledListItem>
                <StyledListItem><b>4:</b> The chat assistant. It can answer questions about the current explanation and the XAI interpretation contents of this tutorial. It will not answer any other questions, nor will it answer quiz questions.</StyledListItem>
                <StyledListItem><b>5:</b> The list of explanations. These can be clicked to change the current explanation. The current explanation is highlighted in this list.</StyledListItem>
                <StyledListItem><b>6:</b> The reopen tutorial button.</StyledListItem>
              </StyledList>
            </div>
          </div>
        }
      </StyledSub>

      <StyledHeader>Explanation details:</StyledHeader>
      <StyledParagraph>
        Below, we describe the three main types of explanations you'll receive about the model's reasoning and how to interpret them.
      </StyledParagraph>
      <StyledSub>
        <StyledParagraph>
          <b>Similar Data Points Table:</b> Shows data points with similar feature values and the <b>same</b> prediction outcome as the main data point (the data point that the quiz asks about).
        </StyledParagraph>
        <div>
          <StyledList>
            <StyledListItem><b>Significance of First Row:</b> The first row represents the <b>main data point</b>.</StyledListItem>
            <StyledListItem><b>Dashes "-":</b> Dashes indicate that a data point has the same value as the main data point for that column.</StyledListItem>
          </StyledList>
        </div>
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: "-110px" }}>
          <img src={similar} />
        </div>
        <StyledParagraph>
          <b>Counterfactual Data Points Table:</b> Shows data points with similar feature values but the <b>opposite</b> prediction outcome as the main data point:
        </StyledParagraph>
        <div>
          <StyledList>
            <StyledListItem>It's interpreted similarly to the Similar Data Points Table.</StyledListItem>
          </StyledList>
        </div>
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: "-80px" }}>
          <img src={counter} />
        </div>
        <StyledParagraph>
          <b>SHAP Waterfall Plot:</b> Visualize the impact of each feature on the main data point's prediction.
        </StyledParagraph>
        <div>
          <StyledList>
            <StyledListItem><b>Threshold of Classification at 0:</b> A decision threshold that determines the classification outcome. Negative values indicate a prediction of less than $50k, and nonnegative values indicate a prediction of more than $50k.</StyledListItem>
            <StyledListItem><b>Expected Value:</b> The baseline value if no features are considered.</StyledListItem>
            <StyledListItem><b>Feature Contributions:</b> Red bars indicate features that push the prediction higher, while blue bars indicate features that push it lower.</StyledListItem>
            <StyledListItem><b>Note:</b> The same feature value can have different SHAP values for different data points (so an age of 47 doesn't always result in +0.94).</StyledListItem>
          </StyledList>
        </div>
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <img src={waterfall} />
        </div>
      </StyledSub>

      <StyledHeader>Other Global Explanations of Interest (optional):</StyledHeader>
      <StyledParagraph>
        Global explanations help you understand how features influence the model's predictions across all datapoints. These visualizations won't be presented in the interface, but can help give a more general understanding of the model.
      </StyledParagraph>
      <StyledSub>
        <StyledParagraph>
          <b>Global bar plot:</b> The global importance of each feature is taken to be the mean absolute SHAP value for that feature over all the given samples
        </StyledParagraph>
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <img src={bar} />
        </div>
        <StyledParagraph>
          <b>Scatter plots:</b> These show the effect a single feature has on the predictions made by the model.
        </StyledParagraph>
        <div>
          <StyledList>
            <StyledListItem><b>Dots:</b> Each dot is a single prediction from the dataset, the x-axis is the value of the feature, and the y-axis is the SHAP value for that feature which represents how much knowing that feature's value changes the output of the model for that sample's prediction.</StyledListItem>
            <StyledListItem><b>Grey bars:</b> The light grey area at the bottom of the plot is a histogram showing the distribution of data values.</StyledListItem>
          </StyledList>
        </div>
        <ImageRow images={featureImages} />
      </StyledSub>
    </StyledDiv >
  );
}

export default TutorialPage;
