const Environment = require('./Environment.js');

class Interpreter {

    constructor(global = GlobalEnvironment) {
        this.global = global;
    }

    interpret(node) {
        return this.StatementList(node);
    }

    StatementList(body, env = this.global) {
        let result;
        for (const statement of body) {
          result = this.Statement(statement, env);
        }
        return result;
    }

    Statement(node, env) {
        switch (node.type) {
            case 'ExpressionStatement':
                return this.ExpressionStatement(node.expression, env);
            case 'VariableStatement':
                return this.VariableStatement(node.declarations, env);
            case 'BlockStatement':
                return this.BlockStatement(node.body, env);
            case 'IfStatement':
                return this.IfStatement(node, env);
            case 'WhileStatement':
                return this.WhileStatement(node, env);
            case 'DoWhileStatement':
                return this.DoWhileStatement(node, env);
            case 'ForStatement':
                return this.ForStatement(node, env);
            case 'FunctionDeclaration':
                return this.FunctionDeclaration(node, env);
            case 'ReturnStatement':
                return this.ReturnStatement(node, env);
        }
    }
    FunctionDeclaration(node, env) {
        let name = node.name.name;

        let functionBody = {
            name: node.name.name,
            params: node.params,
            body: node.body,
            env
        }

        env.define(name, functionBody);
    }

    ReturnStatement(node, env) {
        return  this.Expression(node.argument, env);
    }

    ForStatement(node, env) {
        let result;
        for (this.Statement(node.init, env); this.Expression(node.test, env); this.Expression(node.update, env)) {
            result = this.Statement(node.body, env);
        }

        return result;
    }

    DoWhileStatement(node, env) {
        let result;
        do {
            result = this.Statement(node.body, env);
        }
        while (this.Expression(node.test, env));
        return result;
    }

    WhileStatement(node, env) {
        let result;

        while (this.Expression(node.test, env)) {
            result = this.Statement(node.body, env);
        }

        return result;
    }

    IfStatement(node, env) {
        const test = this.Expression(node.test, env);
        // console.log(test);
    
        if (test) {
            return this.Statement(node.consequent, env);
        } else if (node.alternate) {
            return this.Statement(node.alternate, env);
        } else {
            return undefined;
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
        let init = node.init !== null ? this.Expression(node.init, env): 0;
        env.define(id, init);
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
            case 'Identifier':
                return this.Identifier(node, env);
            case 'LogicalORExpression':
                return this.LogicalORExpression(node, env);
            case 'LogicalANDExpression':
                return this.LogicalANDExpression(node, env);
            case 'UnaryExpression':
                return this.UnaryExpression(node, env);
            case 'AssignmentExpression':
                return this.AssignmentExpression(node, env);
            case 'ConditionalExpression':
                return this.ConditionalExpression(node, env);
            case 'MemberExpression':
                return this.MemberExpression(node, env);
            case 'BinaryExpression':
                return this.BinaryExpression(node, env);
            case 'CallExpression':
                return this.CallExpression(node, env);
        }
    }

    CallExpression(node, env) {
        if(node.calle.name === 'write'){
            return this._callWriteExpression(node, env);
        }

        let fn = env.lookup(node.calle.name);
        let args = node.arguments.map((args) => this.Expression(args, env));
        let params = fn.params.map((param) => param.name);

        let activationRecord = {};
        params.forEach((param, index) => {
            activationRecord[param] = args[index];
        })

        const activationEnv = new Environment(activationRecord, fn.env);

        return this.Statement(fn.body, activationEnv);

    }

    _callWriteExpression(node, env) {
        let args = node.arguments.map((args) => this.Expression(args, env));
        return console.log(...args);
    }

    MemberExpression(node, env) {
        let object = this.Identifier(node.object, env);
        
        if(node.computed) {
            return object[this.Expression(node.property, env)];
        }
        else {
            let property = node.property.name;
            return object[property];
        }
    }

    ConditionalExpression(node, env) {
        return this.Expression(node.test, env) ? 
                this.Expression(node.consequent, env) :
                this.Expression(node.alternate, env);
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
            case '-':
            case '*':
            case '/':
                return this.MathExpression(node, env);
            case '==':
            case '>':
            case '<':
            case '>=':
            case '<=':
                return this.RealationalExpression(node, env);
        }
    }

    MathExpression(node, env) {
        let left = this.Expression(node.left, env);
        let right = this.Expression(node.right, env);

        switch (node.operator) {
            case '+':
                return left + right;
            case '-':
                return left - right;
            case '*':
                return left * right;
            case '/':
                return left / right;
        }
    }

    RealationalExpression(node, env) {
        let left = this.Expression(node.left, env);
        let right = this.Expression(node.right, env);

        
        switch (node.operator) {
            case '==':
                return left == right;
            case '>':
                return left > right;
            case '>=':
                return left >= right;
            case '<':
                return left < right;
            case '<=':
                return left <= right;
        }
    }

    LogicalORExpression(node, env) {
        let left = this.Expression(node.left, env);
        let right = this.Expression(node.right, env);

        return (left || right);
    }

    LogicalANDExpression(node, env) {
        let left = this.Expression(node.left, env);
        let right = this.Expression(node.right, env);

        return (left && right);
    }

    UnaryExpression(node, env) {
        let argument = this.Expression(node.argument, env);
        let operator = node.operator;

        switch (operator) {
            case '!':
                return !argument;
            case '+':
                return +argument;
            case '-':
                return -argument;
        }
    }

    SimpleAssign(node, env) {
        let left = node.left.name;
        let right = node.right !== null ? this.Expression(node.right, env) : null;
        env.lookup(left);
        env.assign(left, right);
        // console.log(env);
        return ;
    }


    ComplexAssign(node, env) {
        let left = node.left.name;
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
        // console.log(env);
        return;
    }

    Identifier(node, env) {
        return env.lookup(node.name);
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