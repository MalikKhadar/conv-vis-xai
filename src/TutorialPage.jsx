import React from 'react';
import { Button, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import { styled } from '@mui/material/styles';
import ComparisonTable from './ComparisonTable';
import more from "./assets/tutorial/more.json";
import less from "./assets/tutorial/less.json";
import similar from "./assets/tutorial/similar.json";
import counter from "./assets/tutorial/counter.json";
import waterfall from "./assets/tutorial/waterfall.png";

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
    const featureDescriptions = {
        age: 'age of the individual in years',
        workclass: 'type of employment the individual has',
        'education-num': 'corresponds to the individual\'s level of education',
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

    return (
        <StyledDiv>
            <StyledHeader>Introduction:</StyledHeader>
            <StyledParagraph>
                <b>Welcome to our XAI visualization tutorial</b>! This guide will help you understand how to interpret the visualizations generated by our model predictions based on the 1995 census income dataset.
            </StyledParagraph>

            <StyledHeader>General Dataset Information:</StyledHeader>
            <StyledParagraph>
                <b>1995 Census Income Dataset:</b> This dataset contains information about individuals from the 1995 US Census, including demographic and employment details.
            </StyledParagraph>
            <StyledParagraph>
                <b>Important Context:</b> 1995 is nearly 30 years in the past. According to the 1995 US Census, the <b>median household income in 1995 was $34,076</b>
            </StyledParagraph>
            <StyledSub>
                <b>Features:</b>
                <StyledList>
                    {Object.keys(featureDescriptions).map((feature, index) => (
                        <StyledListItem key={index}>{feature} - {featureDescriptions[feature]}</StyledListItem>
                    ))}
                </StyledList>
            </StyledSub>
            <StyledParagraph>
                <b>Objective:</b> Predict whether an individual makes <b>over $50k a year</b>.
            </StyledParagraph>

            <StyledHeader>Examples of Model Predictions:</StyledHeader>
            <StyledSub>
                <StyledParagraph>
                    <b>Positive Prediction Examples:</b> Two tabular examples where the model predicts that an individual makes <b>over $50k</b>:
                </StyledParagraph>
                <ComparisonTable tableData={more} />
            </StyledSub>
            <StyledSub>
                <StyledParagraph>
                    <b>Negative Prediction Examples:</b> Two tabular examples where the model predicts that an individual makes <b>less than $50k</b>:
                </StyledParagraph>
                <ComparisonTable tableData={less} />
            </StyledSub>

            <StyledHeader>How to Interpret Tables:</StyledHeader>
            <StyledParagraph>
                <b>Significance of First Row:</b> The first row represents the <b>main data point</b>.
            </StyledParagraph>
            <StyledParagraph>
                <b>Gold Coloring:</b> Highlights cells that share the same values as the <b>main data point</b>.
            </StyledParagraph>
            <StyledSub>
                <StyledParagraph>
                    <b>Similar Data Points Table:</b> Shows data points with similar feature values and the <b>same</b> prediction outcome as the main data point.
                </StyledParagraph>
                <ComparisonTable tableData={similar} />
            </StyledSub>
            <StyledSub>
                <StyledParagraph>
                    <b>Counterfactual Data Points Table:</b> Shows data points with similar feature values but the <b>opposite</b> prediction outcome as the main data point:
                </StyledParagraph>
                <ComparisonTable tableData={counter} />
            </StyledSub>

            <StyledHeader>How to Interpret the Waterfall Plot:</StyledHeader>
            <StyledParagraph>
                <b>What are SHAP Values?:</b> SHAP (SHapley Additive exPlanations) values are used to explain the output of machine learning models by showing the contribution of each feature to the prediction.
            </StyledParagraph>
            <StyledParagraph>
                <b>Importance:</b> They provide a way to understand how each feature impacts the model's prediction, making the model more interpretable.
            </StyledParagraph>
            <StyledParagraph>
                <b>Note:</b> SHAP values depend on the values of multiple features, so the same feature value can result in different SHAP values between data points.
            </StyledParagraph>
            <StyledSub>
                <StyledParagraph>
                    <b>SHAP Waterfall Plot:</b> Visualize the impact of each feature on a single prediction.
                </StyledParagraph>
                <div>
                    <StyledList>
                        <StyledListItem><b>Threshold of Classification at 0:</b> A decision threshold that determines the classification outcome.</StyledListItem>
                        <StyledListItem><b>Expected Value:</b> The baseline value if no features are considered.</StyledListItem>
                        <StyledListItem><b>Feature Contributions:</b> Red bars indicate features that push the prediction higher, while blue bars indicate features that push it lower.</StyledListItem>
                    </StyledList>
                </div>
                <div style={{ display: 'flex', justifyContent: 'center' }}>
                    <img src={waterfall} />
                </div>
                <StyledParagraph>
                    <b>Explanation:</b> This plot explains why an individual was classified as making <b>more than $50k</b>. Features like 'marital status' and 'age' contributed <b>positively</b>, while 'education num' and 'capital gain' contributed <b>negatively</b>.
                </StyledParagraph>
            </StyledSub>
        </StyledDiv>
    );
}

export default TutorialPage;
