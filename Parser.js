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

    StatementList() {
        const statementList = [this.Statement()];
        while(this._lookahead != null) {
            statementList.push(this.Statement());
        }

        return statementList;
    }

    Statement() {
        return this.ExpressionStatement();
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
        return this.AdditiveExpression();
    }

    AdditiveExpression() {
        let left = this.Literal();

        while(this._lookahead.type === 'ADDITIVE_OPERATOR') {
            const operator = this._eat('ADDITIVE_OPERATOR').value;
            const right = this.Literal();
            left = {
                type: 'BinaryExpression',
                operator,
                left,
                right,
            }
        }

        return left;
    }

    Literal() {
        return this.NumericLiteral();
    }

    NumericLiteral() {
        const token = this._eat('NUMBER');
        return {
            type: 'NumbericLiteral',
            value: Number(token.value)
        }
    }

    _eat(tokenType) {
        const token = this._lookahead;

        if(token == null) {
            throw new SyntaxError(`Unexpected end of input, expected "${tokenType}"`)
        }

        if(token.type !== tokenType) {
            throw new SyntaxError(`Unexpected token: "${token.value}", expected: ${tokenType} `)
        }

        this._lookahead = this._tokenizer.getNextToken();

        return token;
    }


}

module.exports = { Parser }