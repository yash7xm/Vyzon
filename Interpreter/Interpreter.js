const Environment = require('./Environment.js');
const env = new Environment({});

class Interpreter {

    constructor(global = GlobalEnvironment) {
        this.global = global;
    }

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
            case 'VariableStatement':
                return this.VaribaleStatement(node.declarations);
        }
    }

    VaribaleStatement(node) {
        return node.map((declarations) => this.VariableDeclaration(declarations));
    }

    VariableDeclaration(node) {
        let id = node.id.name;
        let init = 1;

        this.global.define(id,init);
        console.log(this.global);
        
    }

    ExpressionStatement(expression) {
        return this.Expression(expression);
    }

    Expression(node) {
        switch (node.type) {
            case 'NumericLiteral':
                return this.NumericLiteral(node);
            case 'AssignmentExpression':
                return this.AssignmentExpression(node);
            case ('NumericLiteral'):
                return this.NumericLiteral(node);
            case ('BinaryExpression'):
                return this.BinaryExpression(node);
        }
    }

    AssignmentExpression(node) {
       
    }


    BinaryExpression(node) {
        switch (node.operator) {
            case ('+'):
                return this.AdditionExpression(node.left, node.right);
        }
        switch (node.operator) {
            case ('*'):
                return this.MultipicationExpression(node.left, node.right);
        }
    }

    AdditionExpression(left, right) {
        return ((this.Expression(left)) + (this.Expression(right)));
    }

    MultipicationExpression(left, right) {
        return (this.Expression(left) * this.Expression(right));
    }

    NumericLiteral(node) {
        return node.value;
    }
}

const GlobalEnvironment = new Environment({
    null: null,
    true: true,
    false: false,
})

module.exports = { Interpreter };