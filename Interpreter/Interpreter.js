const Environment = require('./Environment.js');

class Interpreter {

    constructor(global = GlobalEnvironment) {
        this.global = global;
    }

    interpret(node) {
        return this.StatementList(node);
    }

    StatementList(body, env = this.global) {
        return body.map((statement) => this.Statement(statement, env)).join('\n');
    }

    Statement(node, env) {
        switch (node.type) {
            case 'ExpressionStatement':
                return this.ExpressionStatement(node.expression, env);
            case 'VariableStatement':
                return this.VariableStatement(node.declarations, env);
            case 'BlockStatement':
                return this.BlockStatement(node.body, env);
        }
    }

    BlockStatement(node, env) {
        const blockEnv = new Environment({}, env);
        return this.StatementList(node, blockEnv);
    }

    VariableStatement(node, env) {
        return node.map((declaration) => this.VariableDeclaration(declaration, env));
    }

    VariableDeclaration(node, env) {
        let id = node.id.name;
        let init = this.Expression(node.init, env);
        env.define(id, init);
        console.log(env);
    }

    ExpressionStatement(expression, env) {
        return this.Expression(expression, env);
    }

    Expression(node, env) {
        switch (node.type) {
            case 'NumericLiteral':
                return this.NumericLiteral(node);
            case 'StringLiteral':
                return this.StringLiteral(node);
            case 'BooleanLiteral':
                return this.BooleanLiteral(node);
            case 'NullLiteral':
                return this.NullLiteral(node);
            case 'LogicalORExpression':
                return this.LogicalORExpression(node);
            case 'LogicalANDExpression':
                return this.LogicalANDExpression(node);
            case 'UnaryExpression':
                return this.UnaryExpression(node);
            case 'AssignmentExpression':
                return this.AssignmentExpression(node, env);
            case 'BinaryExpression':
                return this.BinaryExpression(node, env);
        }
    }

    AssignmentExpression(node, env) {
        if (node.operator === '=') {
            return this.SimpleAssign(node, env);
        } else {
            return this.ComplexAssign(node, env);
        }
    }

    BinaryExpression(node, env) {
        switch (node.operator) {
            case '+':
                return this.AdditionExpression(node.left, node.right);
            case '*':
                return this.MultiplicationExpression(node.left, node.right);
        }
    }

    AdditionExpression(left, right) {
        return this.Expression(left) + this.Expression(right);
    }

    MultiplicationExpression(left, right) {
        return this.Expression(left) * this.Expression(right);
    }

    LogicalORExpression(node) {
        let left = this.Expression(node.left);
        let right = this.Expression(node.right);

        return (left || right);
    }

    LogicalANDExpression(node) {
        let left = this.Expression(node.left);
        let right = this.Expression(node.right);

        return (left && right);
    }

    UnaryExpression(node) {
        let argument = this.Expression(node.argument);
        let operator = node.operator;

        switch(operator) {
            case '!':
                return !argument;
            case '+':
                return +argument;
            case '-':
                return -argument;
        }
    }

    SimpleAssign(node, env) {
        let left = this.Identifier(node.left);
        let right = this.Expression(node.right, env);
        env.lookup(left);
        env.assign(left, right);
        console.log(env);
        return;
    }


    ComplexAssign(node, env) {
        let left = this.Identifier(node.left);
        let right = this.Expression(node.right, env);
        const operator = node.operator[0];
        const leftValue = env.lookup(left);

        if (typeof right === 'string' && typeof leftValue === 'string' && operator !== '+') {
            throw new SyntaxError('Invalid operation');
        }

        switch (operator) {
            case '+':
                right = leftValue + right;
                break;
            case '-':
                right = leftValue - right;
                break;
            case '*':
                right = leftValue * right;
                break;
            case '/':
                right = leftValue / right;
                break;
        }

        env.assign(left, right);
        console.log(env);
        return;
    }

    Identifier(node) {
        return node.name;
    }

    NumericLiteral(node) {
        return node.value;
    }

    StringLiteral(node) {
        return node.value;
    }

    BooleanLiteral(node) {
        return node.value;
    }

    NullLiteral(node) {
        return node.value;
    }
}

const GlobalEnvironment = new Environment({
    null: null,
    true: true,
    false: false,
});

module.exports = { Interpreter };
