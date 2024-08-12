import React from 'react';
import { styled } from '@mui/material/styles';
import ImageRow from './ImageRow';
import more from "./assets/tutorial/interpretation/more.png";
import less from "./assets/tutorial/interpretation/less.png";
import similar from "./assets/tutorial/interpretation/similar.png";
import counter from "./assets/tutorial/interpretation/counter.png";
import waterfall from "./assets/tutorial/interpretation/waterfall.png";
import bar from "./assets/tutorial/interpretation/bar.png";
import age from "./assets/tutorial/interpretation/age.png";
import workclass from "./assets/tutorial/interpretation/workclass.png";
import education from "./assets/tutorial/interpretation/education.png";
import marital from "./assets/tutorial/interpretation/marital.png";
import occupation from "./assets/tutorial/interpretation/occupation.png";
import relationship from "./assets/tutorial/interpretation/relationship.png";
import race from "./assets/tutorial/interpretation/race.png";
import sex from "./assets/tutorial/interpretation/sex.png";
import gain from "./assets/tutorial/interpretation/gain.png";
import loss from "./assets/tutorial/interpretation/loss.png";
import hours from "./assets/tutorial/interpretation/hours.png";
import country from "./assets/tutorial/interpretation/country.png";

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

const InterpretationTutorial = () => {
  return (
    <StyledDiv>
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

export default InterpretationTutorial;