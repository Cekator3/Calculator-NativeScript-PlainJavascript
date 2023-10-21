////////////////////////////////////////////////////////////
//Module for calculating a value from a postfix expression
////////////////////////////////////////////////////////////
import 
{ 
    calculatePostfixForm,
    DeveloperForgotToWriteImplementationOfMathOperationException,
} 
from "./MathExpressionConverter";

import 
{ 
    isAriphmeticOperation,
    isPostfixOperation,
    isPrefixOperation,
} from "./OperationTypes";

function isDigit(chr)
{
    return (chr >= '0') && (chr <= '9');
}

function isNumber(token)
{
    for (let chr of token)
        if (!isDigit(chr))
            return false;
    return true;
}

function isBinaryOperation(token)
{
    return isAriphmeticOperation(token);
}

function isUnaryOperation(token)
{
    return isPostfixOperation(token) || isPrefixOperation(token);
}

function Factorial(n)
{
    let result = 1;
    while(n > 1)
    {
        result *= n;
        n--;
    }
    return result;
}

function calculateBinaryExpression(a, b, operation)
{
    switch (operation)
    {
        case '-':
            return +a - +b;
        case '+':
            return +a + +b;
        case '*':
            return a * b;
        case '/':
            return a / b;
        case '^':
            return Math.pow(a, b);
        default:
            return undefined;
    }
}

function calculateUnaryExpression(a, operation)
{
    switch (operation) 
    {
        case 'sin':
            return Math.sin(a);
        case 'cos':
            return Math.cos(a);
        case '~':
            return -a;
        case '!':
            return Factorial(a);
        default:
            return undefined;
    }
}

/**
 * Calculates value of math expression
 * @param {string} expression
 * @throws {UnknownMathOperationException}
 * @throws {UnpairedBracketsFoundException}
 * @throws {UnexpectedMathOperationFoundException}
 * @throws {DeveloperForgotToWriteImplementationOfMathOperationException}
 * @returns {number}
 */
export function evaluateExpression(expression)
{
    let tokens = calculatePostfixForm(expression);
    let stack = [];
    let a = 0;
    let b = 0;
    let result = 0;
    for (let i = 0; i < tokens.length; i++) 
    {
        if (isNumber(tokens[i]))
        {
            stack.push(+tokens[i]);
            continue;
        }
        if (isBinaryOperation(tokens[i]))
        {
            if (stack.length === 0)
                b = 0;
            else
                b = stack.pop();
            if (stack.length === 0)
                a = 0;
            else
                a = stack.pop();
            result = calculateBinaryExpression(a, b, tokens[i]);
            if (result === undefined)
                throw new DeveloperForgotToWriteImplementationOfMathOperationException(tokens[i], tokens);
            stack.push(result);
            continue;
        }
        if (isUnaryOperation(tokens[i]))
        {
            if (stack.length === 0)
                a = 0;
            else
                a = stack.pop();
            result = calculateUnaryExpression(a, tokens[i]);
            if (result === undefined)
                throw new DeveloperForgotToWriteImplementationOfMathOperationException(tokens[i], tokens);
            stack.push(result);
            continue;
        }
    }
    return stack.pop();
}