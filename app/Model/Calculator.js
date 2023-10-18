////////////////////////////////////////////////////////////
//Module for calculating a value from a postfix expression
////////////////////////////////////////////////////////////
import 
{ 
    calculatePostfixForm,
    ARIPHMETIC_OPERATIONS,
    POSTFIX_OPERATIONS,
    PREFIX_OPERATIONS
} 
from "./MathExpressionConverter";

const UnaryOperations = POSTFIX_OPERATIONS + PREFIX_OPERATIONS;

const BinaryOperations = ARIPHMETIC_OPERATIONS;

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
    return BinaryOperations.includes(token);
}

function isUnaryOperation(token)
{
    return UnaryOperations.includes(token);
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
            throw new Error('Binary operation not implenented');
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
            break;
    }
}

/**
 * Calculates value of math expression
 * @param {string} expression
 * @throws {UnknownMathOperationException}
 * @throws {UnpairedBracketsFoundException}
 * @throws {UnexpectedMathOperationFoundException}
 * @returns {number}
 */
export function evaluateExpression(expression)
{
    let tokens = calculatePostfixForm(expression);
    let stack = [];
    let a = 0;
    let b = 0;
    let result = 0;
    for (let token of tokens)
    {
        if (isNumber(token))
        {
            stack.push(+token);
            continue;
        }
        if (isBinaryOperation(token))
        {
            if (stack.length === 0)
                b = 0;
            else
                b = stack.pop();
            if (stack.length === 0)
                a = 0;
            else
                a = stack.pop();
            result = calculateBinaryExpression(a, b, token);
            stack.push(result);
            continue;
        }
        if (isUnaryOperation(token))
        {
            if (stack.length === 0)
                a = 0;
            else
                a = stack.pop();
            result = calculateUnaryExpression(a, token);
            stack.push(result);
            continue;
        }
    }
    return stack.pop();
}