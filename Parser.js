const { Tokenizer } = require('./Tokenizer.js');

class Parser {

    constructor() {
        this._string = '';
        this._tokenizer = new Tokenizer();
    }

    parse(string) {
        this._string = string;
        this._tokenizer.init(this._string);

        this._lookahead = this._tokenizer.getNextToken();

        return this.Program();
    }

    Program() {
        return {
            type: 'Program',
            body: this.StatementList()
        }
    }

    StatementList(stopLookAhead = null) {
        const statementList = [this.Statement()];
        while (this._lookahead != null && this._lookahead.type !== stopLookAhead) {
            statementList.push(this.Statement());
        }

        return statementList;
    }

    Statement() {
        switch (this._lookahead.type) {
            case '{':
                return this.BlockStatement();
            case ';':
                return this.EmptyStatement();
            case 'let':
                return this.VariableStatement();
            case 'if':
                return this.IfStatement();
            default:
                return this.ExpressionStatement();
        }
    }

    BlockStatement() {
        this._eat('{');
        const body = this._lookahead.type !== '}' ? this.StatementList('}') : [];
        this._eat('}');
        return {
            type: 'BlockStatement',
            body,
        };
    }

    EmptyStatement() {
        this._eat(';');
        return {
            type: 'EmptyStatement',
        }
    }

    VariableStatement() {
        const variableStatement = this.VariableStatementInit();
        this._eat(';');

        return variableStatement;
    }

    VariableStatementInit() {
        this._eat('let');
        const declarations = this.VariableDeclarationList();

        return {
            type: 'VariableStatement',
            declarations
        }
    }

    VariableDeclarationList() {
        const declarations = [];

        do {
            declarations.push(this.VariableDeclaration());
        }
        while (this._lookahead.type === ',' && this._eat(','));

        return declarations;
    }

    VariableDeclaration() {
        const id = this.Identifier();

        const init = (this._lookahead.type !== ';' && this._lookahead.type !== ',') ? this.VariableInitilizer() : null;

        return {
            type: 'VariableDeclaration',
            id,
            init,
        }
    }

    VariableInitilizer() {
        this._eat('SIMPLE_ASSIGN');
        return this.AssignmentExpression();
    }

    IfStatement() {
        this._eat('if');
        this._eat('(');
        const test = this.Expression();
        this._eat(')');
        const consequent = this.Statement();
        
        let alternate = null;

        if(this._lookahead != null && this._lookahead.type === 'else') {
            this._eat('else');
            alternate = this.Statement();
        }

        return {
            type: 'IfStatement',
            test,
            consequent,
            alternate,
        }
    }

    ExpressionStatement() {
        const expression = this.Expression();
        this._eat(';');
        return {
            type: 'ExpressionStatement',
            expression
        }
    }

    Expression() {
        return this.AssignmentExpression();
    }

    AssignmentExpression() {
        let left = this.LogicalORExpression();

        while (this._isAssignmentOperator(this._lookahead.type)) {
            const operator = this.AssignmentOperator().value;
            const right = this.AssignmentExpression();

            return {
                type: 'AssignmentExpression',
                operator,
                left: this._checkValidAssignmentTarget(left),
                right
            }
        }

        return left;
    }

    LogicalORExpression() {
        let left = this.LogicalANDExpression();

        while(this._lookahead.type === 'LOGICAL_OR') {
            const operator = this._eat('LOGICAL_OR').value;
            const right = this.LogicalANDExpression();

            return {
                type: 'LogicalExpression',
                operator,
                left,
                right
            }
        }

        return left;
    }

    LogicalANDExpression() {
        let left = this.AdditiveExpression();

        while(this._lookahead.type === 'LOGICAL_AND') {
            const operator = this._eat('LOGICAL_AND').value;
            const right = this.AdditiveExpression();

            return {
                type: 'LogicalANDExpression',
                operator,
                left,
                right
            }
        }

        return left;
    }

    AdditiveExpression() {
        let left = this.MultipicativeExpression();

        while (this._lookahead.type === 'ADDITIVE_OPERATOR') {
            const operator = this._eat('ADDITIVE_OPERATOR').value;
            const right = this.MultipicativeExpression();
            left = {
                type: 'BinaryExpression',
                operator,
                left,
                right,
            }
        }

        return left;
    }

    MultipicativeExpression() {
        let left = this.PrimaryExpression();

        while (this._lookahead.type === 'MULTIPLICATIVE_OPERATOR') {
            const operator = this._eat('MULTIPLICATIVE_OPERATOR').value;
            const right = this.PrimaryExpression();
            left = {
                type: 'BinaryExpression',
                operator,
                left,
                right
            }
        }

        return left;
    }

    ParethesizedExpression() {
        this._eat('(');
        const expression = this.Expression();
        this._eat(')');
        return expression;
    }

    _isAssignmentOperator(node) {
        return node === 'SIMPLE_ASSIGN' || node === 'COMPLEX_ASSIGN'
    }

    AssignmentOperator() {
        if (this._lookahead.type === 'SIMPLE_ASSIGN') {
            return this._eat('SIMPLE_ASSIGN');
        }
        return this._eat('COMPLEX_ASSIGN');
    }

    _checkValidAssignmentTarget(node) {
        if (node.type === 'Identifier') {
            return node;
        }

        throw new SyntaxError('Invalid left-hand side in assignment expression');
    }

    Identifier() {
        const name = this._eat('IDENTIFIER').value;
        return {
            type: 'Identifier',
            name
        }
    }

    PrimaryExpression() {
        if (this._isLiteral(this._lookahead.type)) {
            return this.Literal();
        }
        switch (this._lookahead.type) {
            case ('IDENTIFIER'):
                return this.Identifier();
            case ('('):
                return this.ParethesizedExpression();
            default:
                throw new SyntaxError(`Unexpected Primary Expression`)
        }

    }


    _isLiteral(tokenType) {
        return tokenType === 'NUMBER' || tokenType === 'STRING'
    }

    Literal() {
        switch (this._lookahead.type) {
            case 'NUMBER':
                return this.NumericLiteral();
            case 'STRING':
                return this.StringLiteral();
        }
        throw new SyntaxError(`Literal: Unexpected Literal Prduction`);
    }

    NumericLiteral() {
        const token = this._eat('NUMBER');
        return {
            type: 'NumbericLiteral',
            value: Number(token.value)
        }
    }

    StringLiteral() {
        const token = this._eat('STRING');
        return {
            type: 'StringLiteral',
            value: token.value.slice(1, -1)
        }
    }

    _eat(tokenType) {
        const token = this._lookahead;

        if (token == null) {
            throw new SyntaxError(`Unexpected end of input, expected: "${tokenType}"`);
        }

        if (token.type !== tokenType) {
            throw new SyntaxError(`Unexpected token: "${token.value}", expected: "${tokenType}"`);
        }

        this._lookahead = this._tokenizer.getNextToken();

        return token;
    }


}

module.exports = { Parser }