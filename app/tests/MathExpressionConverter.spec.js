import { calculatePostfixForm } from "~/Model/MathExpressionConverter";
import { UnknownMathOperationException } from "~/Model/MathExpressionConverter";
import { UnpairedBracketsFoundException } from "~/Model/MathExpressionConverter";

QUnit.test("Simple math expressions converting", testSimpleMathExpressionConverting);
QUnit.test("Regular math expressions converting", testRegularMathExpressionConverting);
QUnit.test("Complex math expressions converting", testComplexMathExpressionConverting);

QUnit.test("Converting wrong paired math expressions", testConvertingWrongPairedMathExpressions);
QUnit.test("Converting math expressions that contains unknown math operation", testConvertingMathExpressionsThatContainsUnknownMathOperation);

function testSimpleMathExpressionConverting(assert)
{
    let inputs = 
    [
        '2 + 2',
        '(2 + 2)',
        '1 + (2 + 3)',
        'cos(1)',
        'sin(1) + cos(1)',
        'sin(2 + 3)',
        'sin(1)!',
        'sin(1)! + cos(1)!',
        '2^2',
        '(220 + 130)^2',
        '-2 + 1 - 2',
        '+2 + 1 + 2 + (+2)',
        '2 * + 3'
    ];
    let expectedOutputs =
    [
        '2 2 +',
        '2 2 +',
        '1 2 3 + +',
        '1 cos',
        '1 sin 1 cos +',
        '2 3 + sin',
        '1 ! sin',
        '1 ! sin 1 ! cos +',
        '2 2 ^',
        '220 130 + 2 ^',
        '2 - 1 + 2 -',
        '2 + 1 + 2 + 2 + +',
        '2 3 *'
    ];
    for (let i = 0; i < inputs.length; i++) 
    {
        assert.deepEqual(
            calculatePostfixForm(inputs[i]),
            expectedOutputs[i],
            "Error"
        );
    }
}

function testRegularMathExpressionConverting(assert)
{
    let inputs = 
    [
        '(1 - 5)',
        '(1 - 5)^2',
        '2 / (1 - 5)^2',
        '4 * 2 / (1 - 5)^2',
        '3 + 4 * 2 / (1 - 5)^2',
        '3216^2 +4      -15'
    ];
    let expectedOutputs =
    [
        '1 5 -',
        '1 5 - 2 ^',
        '2 1 5 - 2 ^ /',
        '4 2 * 1 5 - 2 ^ /',
        '3 4 2 * 1 5 - 2 ^ / +',
        '3216 2 ^ 4 + 15 -'
    ];
    for (let i = 0; i < inputs.length; i++) 
    {
        assert.deepEqual(
            calculatePostfixForm(inputs[i]),
            expectedOutputs[i],
            "Error"
        );
    }
}

function testComplexMathExpressionConverting(assert)
{
    let inputs = 
    [
        '15/(7-(1+1))*3-(2+(1+1))*15/(7-(200+1))3-(2+(1+1))(15/(7-(1+1))*3-(2+(1+1))+15/(7-(1+1))*3-(2+(1+1)))'
    ];
    let expectedOutputs =
    [
        '15 7 1 1 + - / 3 * 2 1 1 + + 15 * 7 200 1 + - 3 / - 2 1 1 + + 15 7 1 1 + - / 3 * 2 1 1 + + - 15 7 1 1 + - / 3 * + 2 1 1 + + - -'
    ];
    for (let i = 0; i < inputs.length; i++) 
    {
        assert.deepEqual(
            calculatePostfixForm(inputs[i]),
            expectedOutputs[i],
            "Error"
        );
    }
}

function testConvertingWrongPairedMathExpressions(assert)
{
    let inputs = 
    [
        '2)',
        'sin 2)',
        '((())))',
        '('
    ];
    let expectedException = UnpairedBracketsFoundException;
    for (let i = 0; i < inputs.length; i++) 
    {
        assert.throws(
            function () 
            {
                calculatePostfixForm(inputs[i]);
            },
            expectedException
        );
    }
}

function testConvertingMathExpressionsThatContainsUnknownMathOperation(assert)
{
    let inputs = 
    [
        'what(3)'
    ];
    let expectedException = UnknownMathOperationException;
    for (let i = 0; i < inputs.length; i++) 
    {
        assert.throws(
            function () 
            {
                calculatePostfixForm(inputs[i]);
            },
            expectedException
        );
    }
}