import { splitMathExpressionToTokens } from "./MathOperationsTokenizer";
import { calculatePostfixForm } from "./MathExpressionConverter";
//TODO 
//Сделать прикол при делении на ноль: графический интерфейс 
//зависает, и бесконечно воспроизводится глючный звук,
//как в винде

export class Calculator
{
    /**
     * Description
     * @param {string} expression
     * @throws {UnknownMathOperationException}
     * @throws {UnpairedBracketsFoundException}
     * @throws {UnexpectedBinaryOperationFoundException}
     * @returns {number}
     */
    static evaluateExpression(expression)
    {
        let expr = calculatePostfixForm(expression);
        let tokens = splitMathExpressionToTokens(expr);
    }
}