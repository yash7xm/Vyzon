
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
        let body = [];
        for (let i = 0; i < this._string.length; i++) {
            switch (this._string[i].type) {
                case ('ExpressionStatement'):
                    body.push(this.ExpressionStatement(this._string[i].expression))
            }
        }
        return body;
    }

    ExpressionStatement(expression) {
        switch (expression.type) {
            case ('NumericLiteral'):
                return this.NumericLiteral(expression);
            case ('StringLiteral'):
                return this.StringLiteral(expression);
            case ('Identifier'):
                return this.Identifier(expression);
            case ('BinaryExpression'):
                return this.BinaryExpression(expression);
            case ('AssignmentExpression'):
                return this.AssignmentExpression(expression);
            case ('ConditionalExpression'):
                return this.ConditionalExpression(expression);
        }
    }

    ConditionalExpression(node) {
        let test = this.ExpressionStatement(node.test);
        let consequent = this.ExpressionStatement(node.consequent);
        let alternate = this.ExpressionStatement(node.alternate);

        return `${test} ? ${consequent} : ${alternate}`;
    }

    AssignmentExpression(node) {
        let left = this.ExpressionStatement(node.left);
        let right = this.ExpressionStatement(node.right);

        let operator = node.operator;

        return `${left} ${operator} ${right}`;
    }

    BinaryExpression(expression) {
        let left = this.ExpressionStatement(expression.left);
        let right = this.ExpressionStatement(expression.right);

        let operator = expression.operator;

        this._code = `${left} ${operator} ${right}`;
        return this._code;
    }

    NumericLiteral(node) {
        return `${node.value}`;
    }

    StringLiteral(node) {
        return `"${node.value}"`
    }

    Identifier(node) {
        return `${node.name}`;
    }
}

module.exports = { Generator }