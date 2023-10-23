import { Observable } from '@nativescript/core';


export function getCalculatorViewModel()
{
    const viewModel = new Observable();
    viewModel.currentMathExpression = '';
    return viewModel;
}
