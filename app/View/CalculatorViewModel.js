import { Observable } from '@nativescript/core';

import
{
    clearMathExpression,
    getMathExpression,
    removeLastComponentFromMathExpression,
    addComponentToMathExpression
}
from "~/Model/MathExpressionGenerator";
import {calculateValueFromMathExpression} from "~/Model/MathExpressionValueCalculator";

const viewModel = new Observable();
const CURRENT_MATH_EXPRESSION_PROPERTY_NAME = 'currentMathExpression';
const PREVIOUS_MATH_EXPRESSION_PROPERTY_NAME = 'previousMathExpression';

function ClearMathExpression()
{
    clearMathExpression();
    viewModel.set(CURRENT_MATH_EXPRESSION_PROPERTY_NAME, '');
    viewModel.set(PREVIOUS_MATH_EXPRESSION_PROPERTY_NAME, '');
}

function RemoveLastElementFromMathExpression()
{
    removeLastComponentFromMathExpression();
    viewModel.set(CURRENT_MATH_EXPRESSION_PROPERTY_NAME, getMathExpression());
}

function AddElementToMathExpression(args)
{
    addComponentToMathExpression(args.object.mathElement);
    viewModel.set(CURRENT_MATH_EXPRESSION_PROPERTY_NAME, getMathExpression());
}

function EvaluateMathExpression()
{
    try
    {
        let answer = calculateValueFromMathExpression(getMathExpression());
        viewModel.set(PREVIOUS_MATH_EXPRESSION_PROPERTY_NAME, getMathExpression());
        viewModel.set(CURRENT_MATH_EXPRESSION_PROPERTY_NAME, answer);
        clearMathExpression();
        addComponentToMathExpression(answer.toString());
    }
    catch (e) {}
}

export function getCalculatorViewModel()
{
    viewModel.currentMathExpression = '';
    viewModel.ClearMathExpression = ClearMathExpression;
    viewModel.RemoveLastElementFromMathExpression = RemoveLastElementFromMathExpression;
    viewModel.AddElementToMathExpression = AddElementToMathExpression;
    viewModel.EvaluateMathExpression = EvaluateMathExpression;

    return viewModel;
}
