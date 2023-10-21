///////////////////////////////////////////////////////////////////
//module for converting a mathematical expression into postfix form
///////////////////////////////////////////////////////////////////

import { splitMathExpressionToTokens } from "./MathOperationsTokenizer";
import 
{ 
    isAriphmeticOperation,
    isPostfixOperation,
    isPrefixOperation,
    getOperationPriority,
    getUnaryVersionOfOperation
} from "./OperationTypes";


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

function isUnaryOperation(prevToken)
{
    if (prevToken === undefined) 
        return true;
    let prevTokenType = getTokenType(prevToken);
    return (prevTokenType === TokenType.ARIPHMETIC_OPERATION) ||
           (prevTokenType === TokenType.OPENING_BRACKET);
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
    //Opening bracket not found
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
        let operationPriority = getOperationPriority(token);
        if (operationPriority === undefined)
            throw new DeveloperForgotToWriteImplementationOfMathOperationException(token, []);
        if (operationPriority >= priorityLimit)
        {
            result.push(stack.pop());
            continue;
        }
        break;
    }
    return result;
}

function isPostfixOperationCanGoAfterThisToken(token)
{
    if (token === undefined)
        return false;
    let tokenType = getTokenType(token);
    return (tokenType !== TokenType.OPENING_BRACKET) &&
           (tokenType !== TokenType.ARIPHMETIC_OPERATION) &&
           (tokenType !== TokenType.PREFIX_OPERATION);
}

export class OpeningBracketExpectedButNotFoundException extends Error
{
    tokenFound;
    tokenPosition;
    constructor (tokenFound, tokenPosition)
    {
        super('ERROR: Opening bracket expecteed but found "' + tokenFound + '" at position ' + tokenPosition);
        this.tokenFound = tokenFound;
        this.tokenPosition = tokenPosition;
    }
}

export class UnknownMathOperationException extends Error
{
    unknownOperation;
    tokenPosition;
    constructor (unknownOperation, tokenPosition)
    {
        super('ERROR: Unknown operation ' + unknownOperation + ' at token position ' + tokenPosition);
        this.unknownOperation = unknownOperation;
        this.tokenPosition = tokenPosition;
    }
}

export class UnpairedBracketsFoundException extends Error
{
    bracket;
    tokenPosition;
    constructor (bracket = undefined, tokenPosition = undefined)
    {
        if (bracket === undefined)
            super('Math expression is unpaired');
        else
            super('Found unpaired bracket "' + bracket + '" at token position ' + tokenPosition);
        this.bracket = bracket;
        this.tokenPosition = tokenPosition;
    }
}

export class UnexpectedMathOperationFoundException extends Error
{
    operation;
    tokenPosition;
    constructor (operation, tokenPosition)
    {
        super('Found unexpected math operation "' + operation + '" at token ' + tokenPosition);
        this.operation = operation;
        this.tokenPosition = tokenPosition;
    }
}

export class DeveloperForgotToWriteImplementationOfMathOperationException extends Error
{
    operator;
    mathExpression;
    constructor (operator, mathExpression)
    {
        super('The developer forgot to write the implementation of ' + operator + ' operator');
        this.operator = operator;
        this.mathExpression = mathExpression;
    }
}

/**
 * Generates postfix expression from given math expression
 * @param {string} mathExpression
 * @throws {UnknownMathOperationException}
 * @throws {UnpairedBracketsFoundException}
 * @throws {UnexpectedMathOperationFoundException}
 * @throws {OpeningBracketExpectedButNotFoundException}
 * @throws {DeveloperForgotToWriteImplementationOfMathOperationException}
 * @returns {string[]}
 */
export function calculatePostfixForm(mathExpression)
{
    let tokens = splitMathExpressionToTokens(mathExpression);
    let result = [];
    let stack = [];
    let temp = [];
    let isOpeningBracketRequired = false;
    for (let i = 0; i < tokens.length; i++) 
    {
        let tokenType = getTokenType(tokens[i]);
        if(isOpeningBracketRequired && (tokenType !== TokenType.OPENING_BRACKET))
            throw new OpeningBracketExpectedButNotFoundException(tokens[i], i + 1);
        isOpeningBracketRequired = false;
        switch (tokenType)
        {
            case TokenType.NUMBER:
                result.push(tokens[i]);
                break;
            case TokenType.POSTFIX_OPERATION:
                if (!isPostfixOperationCanGoAfterThisToken(tokens[i - 1]))
                    throw new UnexpectedMathOperationFoundException(tokens[i], i + 1);
                result.push(tokens[i]);
                break;
            case TokenType.PREFIX_OPERATION:
                isOpeningBracketRequired = (tokens[i] === 'cos') || 
                                           (tokens[i] === 'sin');
                stack.push(tokens[i]);
                break;
            case TokenType.OPENING_BRACKET:
                stack.push(tokens[i]);
                break;
            case TokenType.CLOSING_BRACKET:
                temp = extractItemsUntilOpeningBracketFromStack('(', stack);
                if (temp === false)
                    throw new UnpairedBracketsFoundException(tokens[i], i + 1);
                result = result.concat(temp)
                break;
            case TokenType.ARIPHMETIC_OPERATION:
                if (isUnaryOperation(tokens[i - 1]))
                {
                    let token = getUnaryVersionOfOperation(tokens[i]);
                    if (token === undefined)
                        throw new UnexpectedMathOperationFoundException(tokens[i], i + 1);
                    if (token !== '')
                        stack.push(token);
                    break;
                }
                if (isPrefixOperation(tokens[i - 1]))
                    throw new UnexpectedMathOperationFoundException(tokens[i], i + 1);
                let operationPriority = getOperationPriority(tokens[i]);
                if (operationPriority === undefined)
                    throw new DeveloperForgotToWriteImplementationOfMathOperationException(tokens[i], tokens);
                try
                {
                    temp = extractAriphmeticAndHighPriorityOperationsFromStack
                    (
                        operationPriority,
                        stack
                    );
                }
                catch (err)
                {
                    if (err.name === 'DeveloperForgotToWriteImplementationOfMathOperationException')
                        err.mathExpression = tokens;
                    throw err;
                }
                result = result.concat(temp)
                stack.push(tokens[i]);
                break;
            case TokenType.UKNOWN:
                throw new UnknownMathOperationException(tokens[i], i + 1);
        }
    }
    temp = extractAllOperationsFromStack(stack);
    if (temp === false)
        throw new UnpairedBracketsFoundException();
    return result.concat(temp);
}