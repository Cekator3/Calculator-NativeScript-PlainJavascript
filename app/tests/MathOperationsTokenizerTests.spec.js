import { splitMathExpressionToTokens } from "~/Model/MathOperationsTokenizer";

QUnit.test("Simple math expressions tokenizing", testSimpleMathExpressionTokenizing)
QUnit.test("Regular math expressions tokenizing", testRegularMathExpressionTokenizing)
QUnit.test("Complex math expressions tokenizing", testComplexMathExpressionTokenizing)

function testSimpleMathExpressionTokenizing(assert)
{
    let inputs =
    [
        '2',
        '0',
        '2 + 2',
        '1 * 2',
        '1++',
        '1.02 * 2',
        '101.2 * 2',
        '2 * 10.24 + 2',
        'abcd.',
        'sin.123'
    ];
    let expectedOutputs =
    [
        ['2'],
        ['0'],
        ['2', '+', '2'],
        ['1', '*', '2'],
        ['1', '+', '+'],
        [ '1.02', '*', '2'],
        [ '101.2', '*', '2'],
        [ '2', '*', '10.24', '+', '2'],
        [ 'abcd', '.' ],
        [ 'sin', '.123']
    ];
    for (let i = 0; i < inputs.length; i++)
    {
        assert.deepEqual(
            splitMathExpressionToTokens(inputs[i]),
            expectedOutputs[i],
            "Error"
        );
    }
}

function testRegularMathExpressionTokenizing(assert)
{
    let inputs =
    [
        '3216^2 +4      -15',
        'sin1 + 3',
        'sin(15) * cos(15)',
    ];
    let expectedOutputs =
    [
        ['3216', '^', '2', '+', '4', '-', '15'],
        ['sin', '1', '+', '3'],
        ['sin', '(', '15', ')', '*', 'cos', '(', '15', ')'],
    ]
    for (let i = 0; i < inputs.length; i++)
    {
        assert.deepEqual(
            splitMathExpressionToTokens(inputs[i]),
            expectedOutputs[i],
            "Error"
        );
    }
}

function testComplexMathExpressionTokenizing(assert)
{
    let inputs =
    [
        '15/(7-(1+1))*3-(2+(1+1))*15/(7-(200+1))3-(2+(1+1))(15/(7-(1+1))*3-(2+(1+1))+15/(7-(1+1))*3-(2+(1+1)))'
    ];
    let expectedOutputs =
    [
        [
            "15", "/", "(", "7", "-", "(", "1", "+", "1", ")", ")", "*", "3", "-",
            "(", "2", "+", "(", "1", "+", "1", ")", ")", "*", "15", "/", "(", "7",
            "-", "(", "200", "+", "1", ")", ")", "3", "-", "(", "2", "+", "(", "1",
            "+", "1", ")", ")", "(", "15", "/", "(", "7", "-", "(", "1", "+", "1",
            ")", ")", "*", "3", "-", "(", "2", "+", "(", "1", "+", "1", ")", ")",
            "+", "15", "/", "(", "7", "-", "(", "1", "+", "1", ")", ")", "*", "3",
            "-", "(", "2", "+", "(", "1", "+", "1", ")", ")", ")"
        ]
    ]
    for (let i = 0; i < inputs.length; i++)
    {
        assert.deepEqual(
            splitMathExpressionToTokens(inputs[i]),
            expectedOutputs[i],
            "Error"
        );
    }
}
