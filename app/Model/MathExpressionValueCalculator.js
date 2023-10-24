////////////////////////////////////////////////////////////
//Module for calculating a value from a math expression
////////////////////////////////////////////////////////////
import
{
    generatePostfixFormFromMathExpression,
    DeveloperForgotToWriteImplementationOfMathOperationException,
}
from "./MathExpressionConverterToPostfixForm";

import
{
    isNumber,
    isPostfixOperation,
    isPrefixOperation,
    isArithmeticOperation
} from "~/Model/MathElementType";

function isBinaryOperation(token)
{
    return isArithmeticOperation(token);
}

function isUnaryOperation(token)
{
    return isPostfixOperation(token) || isPrefixOperation(token);
}

function factorial(n)
{
    //Factorial of float is undefined (in this application)
    if (!Number.isSafeInteger(n))
        throw new AttemptToCalculateFactorialOfFloatNumberException();
    //Factorial of negative integer is undefined
    if(n < 0)
        throw new AttemptToCalculateFactorialOfNegativeNumberException();
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
            throw new DeveloperForgotToWriteImplementationOfMathOperationException(operation, '');
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
            return factorial(a);
        default:
            throw new DeveloperForgotToWriteImplementationOfMathOperationException(operation, '');
    }
}

export class AttemptToCalculateFactorialOfNegativeNumberException extends Error { }

export class AttemptToCalculateFactorialOfFloatNumberException extends Error { }

/**
 * Calculates value of math expression
 * @param {string} expression
 * @throws {UnknownMathOperationException}
 * @throws {UnexpectedMathOperationFoundException}
 * @throws {DeveloperForgotToWriteImplementationOfMathOperationException}
 * @throws {UnpairedBracketsFoundException}
 * @throws {OpeningBracketExpectedButNotFoundException}
 * @throws {TooManyDecimalDelimitersInNumberFoundException}
 * @throws {UnexpectedDecimalDelimiterPositionException}
 * @throws {AttemptToCalculateFactorialOfFloatNumberException}
 * @throws {AttemptToCalculateFactorialOfNegativeNumberException}
 * @throws {DeveloperForgotToWriteImplementationOfMathOperationException}
 * @returns {number}
 */
export function calculateValueFromMathExpression(expression)
{
    let tokens = generatePostfixFormFromMathExpression(expression);
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
            stack.push(result);
        }
    }
    return stack.pop();
}