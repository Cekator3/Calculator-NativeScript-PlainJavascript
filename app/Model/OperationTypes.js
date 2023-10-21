///////////////////////////////////////////////////////////////////
//module for checking the type of operation, its priority, and obtaining it's unary version
///////////////////////////////////////////////////////////////////

/**
 * Checks that the operation is ariphmetic
 * @param {string} operation
 * @returns {boolean}
 */
export function isAriphmeticOperation(operation)
{
    return (operation === '+') ||
           (operation === '-') ||
           (operation === '*') ||
           (operation === '/') ||
           (operation === '^');
}

/**
 * Checks that the operation is postfix
 * @param {string} operation
 * @returns {boolean}
 */
export function isPostfixOperation(operation)
{
    return operation === '!';
}

/**
 * Checks that the operation is prefix
 * @param {string} operation
 * @returns {boolean}
 */
export function isPrefixOperation(operation)
{
    return (operation === 'sin') ||
           (operation === 'cos') ||
           (operation === '~');      //Unary minus
}

/**
 * Returns priority of the operation
 * @param {string} operation
 * @returns {int|undefined}
 */
export function getOperationPriority(operation)
{
    switch (operation) 
    {
        case '~':
            return 10;
        case 'sin':
        case 'cos':
            return 9;
        case '!':
        case '^':
            return 8;
        case '*':
        case '/':
            return 7;
        case '+':
        case '-':
            return 6;
        case '(':
            return -1;
        default:
            undefined;
    }
}

/**
 * Returns unary version of the operation if such exists
 * @param {string} operation
 * @returns {string}
 */
export function getUnaryVersionOfOperation(operation)
{
    switch (operation)
    {
        case '-':
        case '~':
            return '~';
        case '+':
            return '';
        default:
            return undefined;
    }
}