///////////////////////////////////////////////////////////////////
//subsystem for determining the type of mathematical operation
///////////////////////////////////////////////////////////////////

/**
 * Checks that the operation is arithmetic
 * @param {string} operation
 * @returns {boolean}
 */
export function isArithmeticOperation(operation)
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
