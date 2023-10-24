class Interpreter {

    interpret(node) {
        return this.StatementList(node);
    }

    StatementList(body) {
        return body.map((statement) => this.Statement(statement)).join('\n');
    }

    Statement(node) {
        switch (node.type) {
            case 'ExpressionStatement':
                return this.ExpressionStatement(node.expression);
        }
    }

    ExpressionStatement(expression) {
        return this.Expression(expression);
    }

    Expression(node) {
        switch (node.type) {
            case 'NumericLiteral':
                return this.NumericLiteral(node);
            case 'BinaryExpression':
                return this.BinaryExpression(node);
        }
    }

    BinaryExpression(node) {
        switch (node.operator) {
            case ('+'):
                return this.AdditionExpression(node.left, node.right);
        }
    }

    AdditionExpression(left, right) {
        return ((this.Expression(left)) + (this.Expression(right)));
    }

    NumericLiteral(node) {
        return node.value;
    }

}

module.exports = { Interpreter };