import { Observable } from '@nativescript/core';
import { evaluateExpression } from '~/Model/Calculator';

let mathExpressionTokens = [];
const viewModel = new Observable();

function getCurrentMathExpression()
{
    return mathExpressionTokens.join();
}

function appendTokenToMathExpression(token)
{
    //TODO всё кроме цифр, слов и скобок --- ораньжевым цветом
    mathExpressionTokens.push(token);
}

function AddSubstringToMathExpression(args)
{
    let token = args.object.substr;
    appendTokenToMathExpression(token);
    viewModel.set('currentMathExpression', getCurrentMathExpression);
}

export function getCalculatorViewModel() 
{
    viewModel.previousMathExpression = '';
    viewModel.currentMathExpression = '';
    viewModel.AddSubstringToMathExpression = AddSubstringToMathExpression;
    return viewModel;
}