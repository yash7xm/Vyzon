
class Generator {

    constructor() {
        this._string = '';
        this._code = '';
    }

    generate(string) {
        this._string = string;

        return this.StatementsList();
    }

    StatementsList() {
        for (let i = 0; i < this._string.length; i++) {
            switch (this._string[i].type) {
                case ('ExpressionStatement'):
                    return this.ExpressionStatement(this._string[i].expression);
            }
        }
    }

    ExpressionStatement(expression) {
        switch (expression.type) {
            case ('NumericLiteral'):
                return this.NumericLiteral(expression);
            case ('BinaryExpression'):
                return this.BinaryExpression(expression);
        }
    }

    BinaryExpression(expression) {
        let left = this.ExpressionStatement(expression.left);
        let right = this.ExpressionStatement(expression.right);

        let operator = expression.operator;

        this._code = `${left} ${operator} ${right}`;
        return this._code;
    }

    NumericLiteral(expression) {
        this._code = `${expression.value}`;
        // console.log(this._code);    
        return this._code;
    }
}

module.exports = { Generator }