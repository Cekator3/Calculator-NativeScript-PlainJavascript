//////////////////////////////////////////////////////////////////////
//Module for splitting a mathematical expression into array of strings
//////////////////////////////////////////////////////////////////////

//Emulating enum type
class CharType
{
    static LATIN = 0;
    static DIGIT = 1;
    static DIGIT_DELIMITER = 2
    static SPACE = 3;
    static OTHER = 4;
}

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
    return (chr === ' ') ||
           (chr === String.prototype.charCodeAt(9)) ||    //TAB
           (chr === String.prototype.charCodeAt(10)) ||   //Line Feed
           (chr === String.prototype.charCodeAt(13)) ||   //Vertical TAB
           (chr === String.prototype.charCodeAt(15));     //Carriage Return
}

function isDigitDelimiter(chr)
{
    return (chr === '.') || (chr === ',');
}

function getCharType(chr)
{
    if(isLatin(chr))
        return CharType.LATIN;
    if(isDigit(chr))
        return CharType.DIGIT;
    if(isDigitDelimiter(chr))
        return CharType.DIGIT_DELIMITER;
    if(isSpace(chr))
        return CharType.SPACE;
    return CharType.OTHER;
}

/**
 * Splits math expression to words, numbers and other ASCII-symbols.
 * @param {string} mathExpression
 * @returns {string[]}
 */
export function splitMathExpressionToTokens(mathExpression)
{
    let result = [];
    for (let i = 0; i < mathExpression.length; i++)
    {
        let currChar = mathExpression[i];
        let prevChar = mathExpression[i - 1];
        if (prevChar === undefined)
            prevChar = ' ';
        let currCharType = getCharType(currChar);
        let prevCharType = getCharType(prevChar);
        switch (currCharType)
        {
            case CharType.DIGIT:
                if (prevCharType === CharType.DIGIT ||
                    prevCharType === CharType.DIGIT_DELIMITER)
                {
                  result[result.length - 1] += currChar;
                  break;
                }
                result.push(currChar);
                break;
            case CharType.DIGIT_DELIMITER:
                if (prevCharType === CharType.DIGIT)
                {
                  result[result.length - 1] += currChar;
                  break;
                }
                result.push(currChar);
                break;
            case CharType.LATIN:
                if (prevCharType === CharType.LATIN)
                {
                    result[result.length - 1] += currChar;
                    break;
                }
                result.push(currChar);
                break;
            case CharType.SPACE:
                break;
            default:
                result.push(currChar);
                break;
        }
    }
    return result;
}
