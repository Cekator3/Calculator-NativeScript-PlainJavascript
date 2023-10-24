////////////////////////////////////////////////////////////////////
//A subsystem for generating math expressions from parts (components).
//
//It will be used, for example, if the user enters
//math expression using buttons rather than direct input
///////////////////////////////////////////////////////////////////

import
{
    getTypeOfMathElement,
    isClosingBracket,
    isOpeningBracket,
    isPostfixOperation,
    MathElementType,
} from "~/Model/MathElementType";
import {CharType, getCharType, isDigitDelimiter, isLatin} from "~/Model/CharType";

let mathExpressionComponents = [];

/**
 * Deletes all contents of math expression.
 * @returns {void}
 */
export function clearMathExpression()
{
    mathExpressionComponents = [];
}

function isComponentRequireSpaceSymbolAfterHim(component, nextComponent)
{
    return !(isOpeningBracket(component) ||
        isLatin(component) ||
        isPostfixOperation(nextComponent) ||
        isClosingBracket(nextComponent) ||
        (nextComponent === '^') ||
        (component === '^'));
}

/**
 * Generates math expression from provided components.
 * @returns {string}
 */
export function getMathExpression()
{
    let result = '';
    for (let i = 0; i < mathExpressionComponents.length; i++)
    {
        let nextComponent = mathExpressionComponents[i + 1];
        let currComponent = mathExpressionComponents[i];
        result += currComponent;
        if (isComponentRequireSpaceSymbolAfterHim(currComponent, nextComponent))
            result += ' ';
    }
    return result.trimEnd();
}

function isComponentRequireBracket(prevComponentType, currComponentType)
{
    return (prevComponentType === CharType.LATIN) &&
           (currComponentType !== CharType.LATIN);
}

function isComponentMustReplacePreviousComponent(prevComponent, component)
{
    if (prevComponent === undefined)
        return false;
    let prevComponentType = getTypeOfMathElement(prevComponent);
    let componentType = getTypeOfMathElement(component);
    return (prevComponentType === MathElementType.ARITHMETIC_OPERATION) &&
           (componentType === MathElementType.ARITHMETIC_OPERATION);
}

function countDigitDelimiters(component)
{
   let result = 0;
   for (let chr of component)
       if (isDigitDelimiter(chr))
           result++;
   return result;
}

function appendComponentToLastComponent(component)
{
    if (mathExpressionComponents.length === 0)
    {
        mathExpressionComponents.push(component);
        return;
    }
    mathExpressionComponents[mathExpressionComponents.length - 1] += component;
}

function replaceLastComponent(component)
{
    if (mathExpressionComponents.length === 0)
    {
        mathExpressionComponents.push(component);
        return;
    }
    mathExpressionComponents[mathExpressionComponents.length - 1] = component;
}

/**
 * Adds a component to a math expression.
 * @param {string} component - component of math expression, such as number, operator, etc.
 * @returns {void}
 */
export function addComponentToMathExpression(component)
{
    let prevComponent = mathExpressionComponents.at(-1);
    let prevComponentType = undefined;
    if (prevComponent !== undefined)
        prevComponentType = getCharType(prevComponent);
    let currComponentType = getCharType(component[0]);
    if (isComponentRequireBracket(prevComponentType, currComponentType))
    {
        mathExpressionComponents.push('(');
        prevComponent = '(';
        prevComponentType = getCharType(prevComponent);
    }
    switch (currComponentType)
    {
        case CharType.DIGIT:
            if ((prevComponentType === CharType.DIGIT) ||
                (prevComponentType === CharType.DIGIT_DELIMITER))
            {
                appendComponentToLastComponent(component);
                break;
            }
            mathExpressionComponents.push(component);
            break;
        case CharType.DIGIT_DELIMITER:
            if (isOpeningBracket(prevComponent) || (prevComponent === undefined))
            {
                mathExpressionComponents.push(0);
                appendComponentToLastComponent(component);
                break;
            }
            if (prevComponentType !== CharType.DIGIT)
                break;
            if (countDigitDelimiters(prevComponent) >= 1)
                break;
            appendComponentToLastComponent(component);
            break;
        case CharType.LATIN:
            if (prevComponentType === CharType.LATIN)
            {
                appendComponentToLastComponent(component);
                break;
            }
            mathExpressionComponents.push(component);
            break;
        case CharType.OTHER:
            if (isComponentMustReplacePreviousComponent(prevComponent, component))
            {
                replaceLastComponent(component);
                break;
            }
            mathExpressionComponents.push(component);
            break;
        case CharType.SPACE:
            break;
    }
}

/**
 * Removes last component from math expression.
 * @returns {void}
 */
export function removeLastComponentFromMathExpression()
{
    let removedComponent = mathExpressionComponents.pop();
    if (isComponentRequireBracket(removedComponent))
        mathExpressionComponents.pop();
}
