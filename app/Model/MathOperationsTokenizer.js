////////////////////////////////////////////////////////////
//Module for splitting a mathematical expression into tokens
////////////////////////////////////////////////////////////

//Emulating enum type
class CharType
{
    static LATIN = 0;
    static DIGIT = 1;
    static SPACE = 2;
    static OTHER = 3;
}

const SPACE_SYMBOLS =
[
    String.prototype.charCodeAt(9),     //TAB
    String.prototype.charCodeAt(10),    //Line Feed 
    String.prototype.charCodeAt(13),    //Vertical TAB 
    String.prototype.charCodeAt(15),    //Carriage Return
    ' '
]

function isLatin(chr)
{
    return ((chr >= 'a') && (chr <= 'z')) ||
           ((chr >= 'A') && (chr <= 'Z'));
}

function isDigit(chr)
{
    return (chr >= '0') && (chr <= '9');
}

function isSpace(chr)
{
    return SPACE_SYMBOLS.includes(chr);
}

function getCharType(chr)
{
    if(isLatin(chr))
        return CharType.LATIN;
    if(isDigit(chr))
        return CharType.DIGIT;
    if(isSpace(chr))
        return CharType.SPACE;
    return CharType.OTHER;
}

function extractEntireNumberFromArrayEnd(chrArr)
{
    let result = '';
    while (chrArr.length > 0)
    {
        let chr = chrArr.pop();
        if (!isDigit(chr))
        {
            chrArr.push(chr);
            break;
        }
        result += chr;
    }
    return result;
}

function extractEntireWordFromArrayEnd(chrArr)
{
    let result = '';
    while (chrArr.length > 0)
    {
        let chr = chrArr.pop();
        if (!isLatin(chr))
        {
            chrArr.push(chr);
            break;
        }
        result += chr;
    }
    return result;
}

/**
 * Splits math expression to words, numbers and other ASCII-symbols.
 * @param {string} mathExpression
 * @returns {string[]}
 */
export function splitMathExpressionToTokens(mathExpression)
{
    let expr = mathExpression.split('').reverse();
    let result = [];
    while (expr.length > 0)
    {
        let chr = expr.pop();
        let chrType = getCharType(chr);
        switch (chrType)
        {
            case CharType.DIGIT:
                let number = chr + extractEntireNumberFromArrayEnd(expr);
                result.push(number);
                break;
            case CharType.LATIN:
                let word = chr + extractEntireWordFromArrayEnd(expr);
                result.push(word);
                break;
            case CharType.SPACE:
                break;
            default:
                result.push(chr);
                break;
        }
    }
    return result;
}