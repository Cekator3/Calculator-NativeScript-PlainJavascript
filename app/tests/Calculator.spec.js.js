import 
{ 
    evaluateExpression, 
    UnknownMathOperationException, 
    UnpairedBracketsFoundException, 
    UnexpectedMathOperationFoundException 
} from "~/Model/Calculator";

QUnit.test("Simple math expressions evaluating", testSimpleMathExpressionEvaluating)
QUnit.test("Regular math expressions evaluating", testRegularMathExpressionEvaluating)
QUnit.test("Complex math expressions evaluating", testComplexMathExpressionEvaluating)

QUnit.test("Evaluating math expression with unknown operations", testEvaluatingMathExpressionWithUnknownOperations);
QUnit.test("Evaluating math expression with unpaired brackets", testEvaluatingMathExpressionWithUnpairedBrackets);
QUnit.test("Evaluating math expression with unexpected placement of math operations", testEvaluatingMathExpressionWithUnexpectedPlacementOfMathOperations);

function testSimpleMathExpressionEvaluating(assert)
{
    let inputs = 
    [
        '2',
        '0',
        '2 + 2',
        '1 * 2',
        '1++',
        '1 + 3 * 2',
        '3!*8',
        '2 * 2 * 2 ^ 3'
    ];
    let expectedOutputs =
    [
        2,
        0,
        4,
        2,
        1,
        7,
        48,
        32
    ]
    for (let i = 0; i < inputs.length; i++) 
    {
        assert.deepEqual(
            evaluateExpression(inputs[i]),
            expectedOutputs[i],
            "Error"
        );
    }
}

function testRegularMathExpressionEvaluating(assert)
{
    let inputs = 
    [
        '3^2 +4      -15',
    ];
    let expectedOutputs =
    [
        -2
    ]
    for (let i = 0; i < inputs.length; i++) 
    {
        assert.deepEqual(
            evaluateExpression(inputs[i]),
            expectedOutputs[i],
            "Error"
        );
    }
}

function testComplexMathExpressionEvaluating(assert)
{
    let inputs = 
    [
        '15/(7-(1+1))*3-(2+(1+1))*15/(7-(200+1))*3-(2+(1+1))*(15/(7-(1+1))*3-(2+(1+1))+15/(7-(1+1))*3-(2+(1+1)))'
    ];
    let expectedOutputs =
    [
        -30.0721649484536082
    ]
    for (let i = 0; i < inputs.length; i++) 
    {
        assert.deepEqual(
            evaluateExpression(inputs[i]),
            expectedOutputs[i],
            "Error"
        );
    }
}

function testEvaluatingMathExpressionWithUnknownOperations(assert)
{
    let inputs = 
    [
        'You cannot see me',
        'man(132)',
        'man(132!)!',
        '12!*man(41)'
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

function testEvaluatingMathExpressionWithUnpairedBrackets(assert)
{
    let inputs = 
    [
        '(((123 * 131)^2) + 3',
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

function 
testEvaluatingMathExpressionWithUnexpectedPlacementOfMathOperations(assert)
{
    let inputs = 
    [
        '312 */ 3',
        '123 *! 31',
        '(123 + 31)(123 + 31)'
    ];
    let expectedException = UnexpectedMathOperationFoundException;
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