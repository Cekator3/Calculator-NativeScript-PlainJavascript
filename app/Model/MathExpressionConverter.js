///////////////////////////////////////////////////////////////////
//module for converting a mathematical expression into postfix form
///////////////////////////////////////////////////////////////////

import { splitMathExpressionToTokens } from "./MathOperationsTokenizer";

//Emulating enum type
class TokenType
{
    static NUMBER = 0;
    static ARIPHMETIC_OPERATION = 1
    static POSTFIX_OPERATION = 2;
    static PREFIX_OPERATION = 3;
    static OPENING_BRACKET = 4;
    static CLOSING_BRACKET = 5;
    static UKNOWN = 6;
}

const OPERATION_PRIORITY = new Map([
    ['sin', 9],
    ['cos', 9],
    ['!', 8],
    ['^', 8],
    ['*', 7],
    ['/', 7],
    ['+', '6'],
    ['-', '6']
]);

const ARIPHMETIC_OPERATIONS = 
[
    '+', '-', '/', '*', '^'
];

const POSTFIX_OPERATIONS =
[
    '!'
];

const PREFIX_OPERATIONS =
[
    'sin', 'cos'
];

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

function isAriphmeticOperation(token)
{
    return ARIPHMETIC_OPERATIONS.includes(token);
}

function isPostfixOperation(token)
{
    return POSTFIX_OPERATIONS.includes(token);
}

function isPrefixOperation(token)
{
    return PREFIX_OPERATIONS.includes(token);
}

function isMathOperation(token)
{
    return isAriphmeticOperation(token) || 
           isPostfixOperation(token) ||
           isPrefixOperation(token);
}

function getTokenType(token)
{
    if (isNumber(token))
        return TokenType.NUMBER;
    if (isAriphmeticOperation(token))
        return TokenType.ARIPHMETIC_OPERATION;
    if (isPostfixOperation(token))
        return TokenType.POSTFIX_OPERATION;
    if (isPrefixOperation(token))
        return TokenType.PREFIX_OPERATION;
    if (token === '(')
        return TokenType.OPENING_BRACKET;
    if (token === ')')
        return TokenType.CLOSING_BRACKET;
    return TokenType.UKNOWN;
}

function extractItemsUntilOpeningBracketFromStack(bracket, stack)
{
    let result = [];
    while (stack.length > 0)
    { 
        let token = stack.pop();
        if (token === bracket)
            return result;
        result.push(token);
    }
    //There is no passing by reference parameters in JavaScript:(((
    return false;
}

function extractAllOperationsFromStack(stack)
{
    let result = [];
    while (stack.length > 0)
    {
        let token = stack.pop();
        if (!isMathOperation(token))
            return false;
        result.push(token);
    }
    return result;
}

function extractAriphmeticAndHighPriorityOperationsFromStack(priorityLimit, stack)
{
    let result = [];
    while (stack.length > 0)
    {
        let token = stack.at(-1);
        if (isPrefixOperation(token) || 
            (OPERATION_PRIORITY.get(token) >= priorityLimit))
        {
            result.push(stack.pop());
            continue;
        }
        break;
    }
    return result;
}

export class UnknownMathOperationException extends Error
{
    unknownOperation;
    position;
    constructor (unknownOperation, position)
    {
        super('ERROR: Unknown operation ' + unknownOperation + ' at position ' + position);
        this.name = 'UnknownOperationException';
        this.unknownOperation = unknownOperation;
        this.position = position;
    }
}

export class UnpairedBracketsFoundException extends Error
{
    bracket;
    position;
    constructor (bracket = undefined, position = undefined)
    {
        if (bracket === undefined)
            super('Math expression is unpaired');
        else
            super('Found unpaired bracket "' + bracket + '" at position ' + position);
        this.bracket = bracket;
        this.position = position;
    }
}

/**
 * Generates postfix expression from given math expression
 * @param {string} mathExpression
 * @throws {UnknownMathOperationException}
 * @throws {UnpairedBracketsFoundException}
 * @returns {string}
 */
export function calculatePostfixForm(mathExpression)
{
    let tokens = splitMathExpressionToTokens(mathExpression);
    let result = '';
    let stack = [];
    let temp = [];
    for (let i = 0; i < tokens.length; i++) 
    {
        let tokenType = getTokenType(tokens[i]);
        switch (tokenType)
        {
            case TokenType.NUMBER:
            case TokenType.POSTFIX_OPERATION:
                result += tokens[i] + ' ';
                break;
            case TokenType.PREFIX_OPERATION:
            case TokenType.OPENING_BRACKET:
                stack.push(tokens[i]);
                break;
            case TokenType.CLOSING_BRACKET:
                temp = extractItemsUntilOpeningBracketFromStack('(', stack);
                if (temp === false)
                    throw new UnpairedBracketsFoundException(tokens[i], i + 1);
                if (temp.length > 0)
                    result += temp.join(' ') + ' ';
                break;
            case TokenType.ARIPHMETIC_OPERATION:
                temp = extractAriphmeticAndHighPriorityOperationsFromStack
                (
                    OPERATION_PRIORITY.get(tokens[i]), 
                    stack
                );
                if (temp.length > 0)
                    result += temp.join(' ') + ' ';
                stack.push(tokens[i]);
                break;
            case TokenType.UKNOWN:
                throw new UnknownMathOperationException(tokens[i], i + 1);
        }
    }
    temp = extractAllOperationsFromStack(stack);
    if (temp === false)
        throw new UnpairedBracketsFoundException();
    result += temp.join(' ');
    //there will be an extra space at the end 
    //if there is a closing bracket at the end of math expression
    if (result.at(-1) === ' ')
        return result.trimEnd();
    return result;
}